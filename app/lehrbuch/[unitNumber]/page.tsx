import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    unitNumber: string;
  };
}

export default async function UnitDetailPage({ params }: PageProps) {
  const unitNum = parseInt(params.unitNumber, 10);
  if (isNaN(unitNum)) notFound();

  const unit = await prisma.unit.findUnique({
    where: { unitNumber: unitNum },
    include: {
      grammarTopics: true,
      vocabularyGroups: {
        include: {
          items: true,
        },
      },
      exercises: {
        include: {
          questions: true,
        },
      },
    },
  });

  if (!unit) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center bg-white rounded-xl shadow-sm border border-brand-sage/20">
        <h2 className="text-2xl font-bold text-brand-green mb-2">الوحدة غير موجودة حالياً</h2>
        <Link href="/lehrbuch" className="bg-brand-green text-brand-cream px-6 py-2.5 rounded-lg font-medium">
          العودة لقائمة الوحدات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 p-4" dir="rtl">
      <div className="border-b border-brand-sage/20 pb-6 text-right">
        <div className="flex items-center justify-between mb-2">
          <Link href="/lehrbuch" className="text-sm font-semibold text-brand-sage hover:underline">
            ← العودة لكتاب المنهج
          </Link>
          <span className="bg-brand-green text-brand-cream text-xs font-bold px-3 py-1 rounded-full">
            الوحدة {unit.unitNumber}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-brand-green">{unit.germanTitle}</h1>
        <p className="text-lg text-gray-700 mt-1">{unit.arabicTitle}</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-brand-green">📖 شرح القواعد (Grammatik)</h2>
        <div className="grid gap-6">
          {unit.grammarTopics.length === 0 ? (
            <p className="text-sm text-gray-500">لا توجد قواعد مضافة لهذه الوحدة بعد.</p>
          ) : (
            unit.grammarTopics.map((topic) => (
              <div key={topic.id} className="bg-white border border-brand-sage/30 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-brand-green">{topic.germanTitle}</h3>
                  <span className="text-sm font-medium text-brand-sage">{topic.arabicTitle}</span>
                </div>
                <div className="bg-brand-cream/60 p-4 rounded-lg text-gray-800 leading-relaxed text-sm whitespace-pre-wrap mb-4">
                  {topic.explanationEgyptian}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-brand-green">🗂️ أهم كلمات الوحدة (Wortschatz)</h2>
        {unit.vocabularyGroups.map((group) => (
          <div key={group.id} className="bg-white border border-brand-sage/30 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg text-brand-green mb-4 pb-2 border-b border-gray-100">
              {group.arabicTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.items.map((item) => (
                <div key={item.id} className="p-3 bg-brand-cream/40 rounded-lg border border-brand-sage/20 flex justify-between items-center">
                  <span className="font-semibold text-gray-800">{item.arabicMeaning}</span>
                  <div className="font-mono font-bold text-brand-green" dir="ltr">
                    {item.headword}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
