import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-brand-green">Willkommen, Kero!</h1>
        <p className="text-brand-sage mt-2 text-lg">Dein Ziel: Goethe-Zertifikat A1</p>
      </header>

      <section className="bg-white p-8 rounded-xl shadow-sm border-l-4 border-brand-green">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Today's Mission</h2>
        <p className="text-gray-600 mb-6">45 Minutes • Unit 1: Vocabulary & Grammar Practice</p>
        <Link 
          href="/mission" 
          className="inline-block bg-brand-green text-brand-cream font-bold text-lg px-8 py-4 rounded-lg hover:bg-[#153d31] transition-colors shadow-md"
        >
          Start Studying
        </Link>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-xl text-brand-green mb-4">Mein Lehrbuch</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1 text-gray-700">
                <span>Unit 1: Guten Tag</span>
                <span>20%</span>
              </div>
              <div className="w-full bg-brand-cream h-2 rounded-full overflow-hidden">
                <div className="bg-brand-gold h-full w-1/5 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-xl text-brand-green mb-4">Wortschatz</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Reviews due today:</span>
            <span className="bg-brand-sage/20 text-brand-green px-4 py-1 rounded-full font-bold">12 Words</span>
          </div>
        </div>
      </div>
    </div>
  );
}
