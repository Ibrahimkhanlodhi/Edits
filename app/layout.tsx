import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IMAG - Professional Image & Video Editor',
  description: 'Transform your media with AI-powered editing tools. Professional image and video editing made simple.',
  icons: {
    icon: '/logo.ico', // or .png/.svg depending on what you're using
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider afterSignOutUrl={"/"}>
         <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>

    </ClerkProvider>
 
  );
}