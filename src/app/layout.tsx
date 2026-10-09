import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/context';
import { ThemeProvider } from '@/lib/theme/context';
import { AuthProvider } from '@/lib/auth/context';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Nidaan (নিদান) - AI Prescription Scanner & Generic Medicine Finder Bangladesh',
  description:
    'Scan handwritten doctor prescriptions, extract medicines using AI vision and NLP, and find lower-cost certified generic brand alternatives in Bangladesh.',
  keywords: [
    'Prescription scanner Bangladesh',
    'Generic medicine Bangladesh',
    'Nidaan',
    'নিদান',
    'Square Pharmaceuticals',
    'Beximco Pharma',
    'Incepta',
    'Drug price comparison Bangladesh',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 antialiased selection:bg-brand-500 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
