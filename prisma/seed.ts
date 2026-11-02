import { PrismaClient, SkillType, ExerciseFormat, PartOfSpeech, GrammaticalGender, VerificationStatus, ContentOrigin } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data...');
  await prisma.vocabularyItem.deleteMany();
  await prisma.vocabularyGroup.deleteMany();
  await prisma.grammarTopic.deleteMany();
  await prisma.exerciseQuestion.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.sourceBook.deleteMany();

  console.log('Seeding database with A1 curriculum...');

  const book = await prisma.sourceBook.create({
    data: {
      code: 'DEUTSCH_MIT_KERO_A1',
      printedTitle: 'Menschen A1 (Student Book)',
      authorOrBrand: 'Hueber',
      level: 'A1',
      totalUnits: 12,
    },
  });
  console.log('Created SourceBook: DEUTSCH_MIT_KERO_A1');

  // إنشاء 12 وحدة
  for (let i = 1; i <= 12; i++) {
    const unit = await prisma.unit.create({
      data: {
        unitNumber: i,
        slug: `unit-${i}`,
        germanTitle: i === 1 ? 'Hallo! Ich bin Kero' : `Einheit ${i}`,
        arabicTitle: i === 1 ? 'التعارف والتحيات' : `الوحدة ${i}`,
        startPagePrinted: i * 10,
        endPagePrinted: (i * 10) + 9,
        sourcePdfName: 'Menschen_A1_KB.pdf',
        passThresholdOverall: 80.0,
        minSkillThresholds: { WORTSCHATZ: 75, GRAMMATIK: 75 },
        sourceBookId: book.id,
      }
    });
    console.log(`Created Unit ${i}`);

    // إضافة محتوى تجريبي للوحدة الأولى فقط عشان نجرب بيه
    if (i === 1) {
      // 1. القواعد (Grammatik)
      await prisma.grammarTopic.create({
        data: {
          code: 'U1_G1',
          orderIndex: 1,
          germanTitle: 'Personalpronomen (ich, du, Sie)',
          arabicTitle: 'الضمائر الشخصية (أنا، أنت، حضرتك)',
          printedPages: '12',
          explanationEgyptian: 'في الألماني عندنا 3 ضمائر مهمين جداً في البداية:\n1. ich (أنا)\n2. du (أنت - للمفرد القريب أو الصاحب)\n3. Sie (حضرتك - للاحترام أو حد متعرفوش)',
          patternSummary: { patterns: ["ich bin", "du bist", "Sie sind"] },
          commonMistakes: ["استخدام du مع شخص غريب", "كتابة sie بحرف صغير بدلاً من Sie للاحترام"],
          examplesWithAudio: { examples: ["Ich bin Kero.", "Wer bist du?"] },
          unitId: unit.id,
        }
      });

      // 2. الكلمات (Wortschatz)
      const vocabGroup = await prisma.vocabularyGroup.create({
        data: {
          code: 'U1_V1',
          orderIndex: 1,
          germanTitle: 'Begrüßung',
          arabicTitle: 'التحيات',
          printedPages: '10',
          unitId: unit.id,
        }
      });

      await prisma.vocabularyItem.createMany({
        data: [
          {
            code: 'U1_V_HALLO',
            headword: 'Hallo',
            partOfSpeech: PartOfSpeech.PHRASE,
            arabicMeaning: 'أهلاً / مرحباً',
            printedPage: 10,
            unitId: unit.id,
            groupId: vocabGroup.id,
          },
          {
            code: 'U1_V_TSCHUESS',
            headword: 'Tschüss',
            partOfSpeech: PartOfSpeech.PHRASE,
            arabicMeaning: 'وداعاً / سلام',
            hasUmlautOrEszett: true,
            printedPage: 10,
            unitId: unit.id,
            groupId: vocabGroup.id,
          }
        ]
      });

      // 3. تمرين تفاعلي (Exercise)
      const exercise = await prisma.exercise.create({
        data: {
          code: 'U1_E1',
          skill: SkillType.GRAMMATIK,
          format: ExerciseFormat.MULTIPLE_CHOICE,
          titleGerman: 'Ergänzen Sie das Personalpronomen',
          instructionEgyptian: 'اختار الضمير المناسب لكل جملة',
          printedPage: 13,
          unitId: unit.id,
        }
      });

      await prisma.exerciseQuestion.create({
        data: {
          questionNumber: 1,
          promptGerman: '___ bin Kero.',
          options: { choices: ["Ich", "Du", "Sie"] },
          officialAnswer: 'Ich',
          acceptedAlternatives: [],
          explanationEgyptian: 'عشان الفعل bin بييجي دايماً مع الضمير Ich (أنا).',
          errorCategoryTag: 'VERB_CONJUGATION',
          exerciseId: exercise.id,
        }
      });
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
