import './globals.css';
import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import FixedBottomBar from '@/components/layout/FixedBottomBar';

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
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="flex-1 bg-background pt-14 sm:pt-16 md:pt-[72px] lg:pt-[80px]">
            {children}
          </main>

          {/* Footer */}
          <Footer />
          
          {/* Floating Action Button - 전역 */}
          <FloatingActionButton />
          
          {/* Fixed Bottom Bar - 전역 */}
          <FixedBottomBar />
        </div>
      </body>
    </html>
  );
} 