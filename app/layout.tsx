// Server Component — DO NOT add 'use client'
import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from './providers';
import Script from 'next/script';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: {
    default: 'Supermarket — Premium Experience',
    template: '%s | Supermarket',
  },
  description:
    'Supermarket is your premium neighbourhood destination. Fresh produce, daily essentials, and gourmet finds — delivered in minutes.',
  keywords: ['supermarket', 'grocery', 'online grocery', 'fresh produce', 'convenience'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Supermarket',
  },
};

export const viewport: Viewport = {
  themeColor: '#FF6B00',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col">
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <Providers>
          <Header />
          <main className="flex-grow pt-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
