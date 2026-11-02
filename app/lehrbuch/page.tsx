import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LehrbuchPage() {
  const units = await prisma.unit.findMany({
    orderBy: { unitNumber: "asc" },
    include: {
      _count: {
        select: {
          vocabularyItems: true,
          grammarTopics: true,
          exercises: true,
        },
      },
    },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      <header className="border-b border-brand-sage/20 pb-4">
        <h1 className="text-3xl font-bold text-brand-green">Mein Lehrbuch - كتاب المنهج</h1>
        <p className="text-brand-sage mt-1">منهج A1 كامل: 12 وحدة تعليمية تفاعلية</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit) => (
          <div
            key={unit.id}
            className="bg-white border border-brand-sage/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider bg-brand-cream text-brand-green px-2.5 py-1 rounded">
                  Einheit {unit.unitNumber}
                </span>
                <span className="text-xs text-gray-400">ص {unit.startPagePrinted} - {unit.endPagePrinted}</span>
              </div>
              <h2 className="text-xl font-bold text-brand-green mb-1">{unit.germanTitle}</h2>
              <p className="text-sm text-gray-600 mb-4">{unit.arabicTitle}</p>

              <div className="space-y-1.5 text-xs text-gray-500 border-t border-gray-100 pt-3">
                <div>📚 كلمات الوحدة: {unit._count.vocabularyItems} كلمة</div>
                <div>📝 قواعد: {unit._count.grammarTopics} موضوع</div>
                <div>✏️ تمارين تفاعلية: {unit._count.exercises} تمرين</div>
              </div>
            </div>

            <Link
              href={`/lehrbuch/${unit.unitNumber}`}
              className="mt-6 block text-center w-full bg-brand-green text-brand-cream py-2.5 rounded-lg font-medium hover:bg-[#153d31] transition-colors"
            >
              افتح الوحدة والتمارين
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
