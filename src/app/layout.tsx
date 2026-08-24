import '../styles/globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { DataProvider } from '../context/DataContext';
import Navbar from '../components/Navbar';

export const metadata: Metadata = {
  title: 'BlackOrgConnectionz | Campus Black Student Orgs & NPHC Greek Life Hub',
  description: 'Centralized hub for Black student organizations, NPHC Divine Nine Greek life, events, community service, and campus social connection.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-neutral-950 text-neutral-100 min-h-screen flex flex-col selection:bg-gold-500 selection:text-black">
        <ThemeProvider>
          <AuthProvider>
            <DataProvider>
              <Navbar />
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
              </main>
              <footer className="border-t border-white/5 bg-neutral-950/80 py-8 text-center text-xs text-neutral-400">
                <div className="max-w-7xl mx-auto px-4 space-y-2">
                  <p className="font-semibold text-white">
                    BlackOrg<span className="text-gold-400">Connectionz</span> — Campus Collegiate Hub
                  </p>
                  <p className="text-neutral-400">
                    Empowering Black Student Organizations & National Pan-Hellenic Council (NPHC) Greek Life on Campus.
                  </p>
                </div>
              </footer>
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
