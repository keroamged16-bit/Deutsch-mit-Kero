import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Deutsch mit Kero",
  description: "A1 German Learning Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="ltr">
      <body className={`${inter.className} bg-brand-cream text-gray-900 flex h-screen overflow-hidden`}>
        <aside className="w-64 bg-brand-green text-brand-cream flex flex-col hidden md:flex flex-shrink-0">
          <div className="p-6 font-bold text-2xl border-b border-brand-sage/30 text-brand-gold">
            Deutsch mit Kero
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto text-sm">
            <Link href="/" className="block px-4 py-2 bg-brand-sage/20 rounded-md font-medium text-white">Dashboard</Link>
            <Link href="/lehrbuch" className="block px-4 py-2 hover:bg-brand-sage/20 rounded-md">Mein Lehrbuch</Link>
            <Link href="/wortschatz" className="block px-4 py-2 hover:bg-brand-sage/20 rounded-md">Wortschatz</Link>
            <Link href="/grammatik" className="block px-4 py-2 hover:bg-brand-sage/20 rounded-md">Grammatik</Link>
            <Link href="/hoeren" className="block px-4 py-2 hover:bg-brand-sage/20 rounded-md">Hören</Link>
            <Link href="/lesen-schreiben" className="block px-4 py-2 hover:bg-brand-sage/20 rounded-md">Lesen & Schreiben</Link>
            <Link href="/sprechen" className="block px-4 py-2 hover:bg-brand-sage/20 rounded-md">Sprechen</Link>
            <Link href="/goethe-a1" className="block px-4 py-2 hover:bg-brand-sage/20 rounded-md text-brand-gold font-semibold">Goethe A1</Link>
            <Link href="/fortschritt" className="block px-4 py-2 hover:bg-brand-sage/20 rounded-md">Fortschritt</Link>
          </nav>
          <div className="p-4 border-t border-brand-sage/30">
            <Link href="/profil" className="block px-4 py-2 hover:bg-brand-sage/20 rounded-md">Mein Profil</Link>
          </div>
        </aside>

        <main className="flex-1 h-screen overflow-y-auto bg-brand-cream p-4 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
