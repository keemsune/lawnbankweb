import './globals.css';
import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';

const notoSansKR = Noto_Sans_KR({ 
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bank Web',
  description: '은행 웹사이트',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link 
          rel="preload" 
          href="https://fastly.jsdelivr.net/gh/projectnoonnu/2410-1@1.0/RiaSans-ExtraBold.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
      </head>
      <body className={notoSansKR.className}>
        <main className="min-h-screen px-4 py-8 md:px-8">
          {children}
        </main>
      </body>
    </html>
  );
} 