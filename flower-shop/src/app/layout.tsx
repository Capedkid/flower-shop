import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import 'bootstrap/dist/css/bootstrap.min.css';
import Providers from '@/components/Providers';
import NavbarWrapper from '@/components/NavbarWrapper';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Çiçekçi E-Ticaret",
  description: "Online çiçek satış platformu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Providers>
          <NavbarWrapper />
          <main className="min-vh-100 bg-light">
            {children}
          </main>
          <footer className="bg-dark text-white py-3 mt-5">
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