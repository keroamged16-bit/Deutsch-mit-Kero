import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Deutsch mit Kero | Startbereit A1',
  description: 'منصة تعلم الألمانية للمستوى A1 بالعامية المصرية - كتاب Startbereit الكامل (12 وحدة)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}

