const BUILD_TAG = "rb-6129";

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: {
    default: 'Thư viện khoa CNTT',
    template: '%s | Thư viện khoa',
  },
  description: 'Thư viện khoa CNTT PTIT',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <Providers>
          <Header />
          <main className="container" style={{ paddingBottom: '48px' }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
