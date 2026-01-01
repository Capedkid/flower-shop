import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import 'bootstrap/dist/css/bootstrap.min.css';
import Providers from '@/components/Providers';
import NavbarWrapper from '@/components/NavbarWrapper';

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant'
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit'
});

export const metadata: Metadata = {
  title: "Çiçekçi | Botanik Sanat ve Estetik",
  description: "Özel günlerinize zarafet katan, sanatla yoğrulmuş butik çiçek deneyimi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${cormorant.variable} ${outfit.variable} font-outfit`}>
        <Providers>
          <NavbarWrapper />
          <main className="min-vh-100 botanical-bg">
            {children}
          </main>
          <footer className="footer-elegant py-5">
            <div className="container text-center small">
              © 2025 Çiçekçi. Tüm hakları saklıdır.
            </div>
          </footer>
        </Providers>
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
} 