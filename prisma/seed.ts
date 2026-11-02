import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with A1 curriculum...');
  const book = await prisma.sourceBook.upsert({
    where: { code: 'DEUTSCH_MIT_KERO_A1' },
    update: {},
    create: {
      code: 'DEUTSCH_MIT_KERO_A1',
      printedTitle: 'Deutsch mit Kero A1',
      authorOrBrand: 'Kero Amged',
      level: 'A1',
      totalUnits: 12,
    },
  });
  console.log('Created SourceBook:', book.code);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });