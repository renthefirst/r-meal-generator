import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar';
import { ClerkProvider } from '@clerk/nextjs';
import ReactQueryProvider from '@/components/react-query-client-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Meal plan generator',
  description: 'Generate your meal plans for weeks and be healthy',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
        >
          <ReactQueryProvider>
            <Navbar />
            <div className="max-w-7xl mx-auto min-h-screen">{children}</div>
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
