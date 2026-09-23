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
  title: 'Fieldnotes — Meeting prep | Antfly',
  openGraph: { title: 'Fieldnotes — Meeting prep | Antfly', description: 'Walk into your next meeting with context, an agenda, and evidence from your Antfly workspace.', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: 'Fieldnotes — Meeting prep | Antfly', description: 'Walk into your next meeting with context, an agenda, and evidence from your Antfly workspace.', images: ['/og.png'] },
  description: 'Walk into your next meeting with context, an agenda, and evidence from your Antfly workspace.',
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
