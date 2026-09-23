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
  ...(process.env.SITE_URL ? { metadataBase: new URL(process.env.SITE_URL) } : {}),
  title: 'Ask your workspace | Antfly',
  openGraph: { title: 'Ask your workspace | Antfly', description: 'Search your files with SearchAF and get answers grounded in evidence.', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: 'Ask your workspace | Antfly', description: 'Search your files with SearchAF and get answers grounded in evidence.', images: ['/og.png'] },
  description: 'Search your files with SearchAF and get answers grounded in evidence.',
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
