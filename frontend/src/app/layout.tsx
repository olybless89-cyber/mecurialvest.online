import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: { default: 'NexBank — Modern Digital Banking', template: '%s | NexBank' },
  description: 'Secure, fast and modern digital banking platform. Manage accounts, transfers, and more.',
  keywords: ['banking', 'digital bank', 'online banking', 'fintech', 'nexbank'],
  authors: [{ name: 'NexBank' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nexbank.app',
    title: 'NexBank — Modern Digital Banking',
    description: 'Secure, fast and modern digital banking platform.',
    siteName: 'NexBank',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
