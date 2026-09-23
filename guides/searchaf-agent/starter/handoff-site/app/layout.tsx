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
  title: 'Project Handoff | Antfly',
  openGraph: { title: 'Project Handoff | Antfly', description: 'Pick up where we left off. A project handoff grounded in your Antfly workspace.', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: 'Project Handoff | Antfly', description: 'Pick up where we left off. A project handoff grounded in your Antfly workspace.', images: ['/og.png'] },
  description: 'Pick up where we left off. A project handoff grounded in your Antfly workspace.',
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
