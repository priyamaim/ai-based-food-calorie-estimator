import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NutriSnap AI - Instant Food Calorie & Nutrient Estimator',
  description:
    'Mobile-first AI Single Page Application estimating calories, protein, carbs, and fat from food photos using Google Gemini 2.5 API.',
  keywords: ['calorie estimator', 'food ai', 'gemini 2.5', 'nutrition tracker', 'macro counter'],
  authors: [{ name: 'NutriSnap AI' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0b0f19',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b0f19] text-gray-100 antialiased selection:bg-emerald-500 selection:text-gray-950">
        {children}
      </body>
    </html>
  );
}
