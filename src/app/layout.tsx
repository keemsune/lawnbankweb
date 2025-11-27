'use client';

import './globals.css';
import { Noto_Sans_KR } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import FixedBottomBar from '@/components/layout/FixedBottomBar';
import { useEffect, useState } from 'react';

const notoSansKR = Noto_Sans_KR({ 
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // variant 상태 관리
  const [variant, setVariant] = useState<string | null>(null);

  // 컴포넌트 마운트 시 URL에서 variant 읽기
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setVariant(params.get('variant'));
  }, []);

  return (
    <html lang="ko">
      <head>
        {/* 기본 메타 태그 */}
        <title>회생터치 - 회생파산 전문 법무법인 로앤</title>
        <meta name="description" content="5번의 터치로 찾는 나만의 채무 해결책. 개인회생 개인파산 13년 경력 전문 변호사." />
        
        {/* Open Graph (카카오톡, 페이스북 등) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="회생터치" />
        <meta property="og:title" content="회생터치 - 회생파산 전문 법무법인 로앤" />
        <meta property="og:description" content="5번의 터치로 찾는 나만의 채무 해결책. 개인회생 개인파산 13년 경력 전문 변호사." />
        <meta property="og:url" content="https://revivetouchlaw.com" />
        <meta property="og:image" content="https://revivetouchlaw.com/images/main/hero/main_hero_1.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="ko_KR" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="회생터치 - 회생파산 전문 법무법인 로앤" />
        <meta name="twitter:description" content="5번의 터치로 찾는 나만의 채무 해결책. 개인회생 개인파산 13년 경력 전문 변호사." />
        <meta name="twitter:image" content="https://revivetouchlaw.com/images/main/hero/main_hero_1.webp" />
        
        {/* 폰트 프리로드 */}
        <link 
          rel="preload" 
          href="https://fastly.jsdelivr.net/gh/projectnoonnu/2410-1@1.0/RiaSans-ExtraBold.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        
        {/* 네이버 광고 스크립트 */}
        <script type="text/javascript" src="//wcs.naver.net/wcslog.js"></script>
        <script 
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              if (!wcs_add) var wcs_add={};
              wcs_add["wa"] = "s_34e93dd69ca9";
              if (!_nasa) var _nasa={};
              if(window.wcs){
                wcs.inflow();
                wcs_do();
              }
            `
          }}
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
          {variant !== 'simple' && <Footer />}
          
          {/* Floating Action Button - 전역 */}
          <FloatingActionButton />
          
          {/* Fixed Bottom Bar - 전역 */}
          <FixedBottomBar />
        </div>
      </body>
    </html>
  );
} 