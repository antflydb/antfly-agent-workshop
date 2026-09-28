import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  title: 'Support Desk | Antfly',
  openGraph: { title: 'Support Desk | Antfly', description: 'Troubleshoot with answers grounded in approved support documents.', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: 'Support Desk | Antfly', description: 'Troubleshoot with answers grounded in approved support documents.', images: ['/og.png'] },
  description: 'Troubleshoot with answers grounded in approved support documents.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
