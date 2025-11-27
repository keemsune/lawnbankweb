import './globals.css';
import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import ClientLayout from './client-layout';

const notoSansKR = Noto_Sans_KR({ 
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: '회생터치 - 회생파산 전문 법무법인 로앤',
  description: '5번의 터치로 찾는 나만의 채무 해결책. 개인회생 개인파산 13년 경력 전문 변호사.',
  metadataBase: new URL('https://revivetouchlaw.com'),
  openGraph: {
    title: '회생터치 - 회생파산 전문 법무법인 로앤',
    description: '5번의 터치로 찾는 나만의 채무 해결책. 개인회생 개인파산 13년 경력 전문 변호사.',
    url: 'https://revivetouchlaw.com',
    siteName: '회생터치',
    images: [
      {
        url: '/images/main/hero/main_hero_1.webp',
        width: 1200,
        height: 630,
        alt: '회생터치 - 법무법인 로앤',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '회생터치 - 회생파산 전문 법무법인 로앤',
    description: '5번의 터치로 찾는 나만의 채무 해결책. 개인회생 개인파산 13년 경력 전문 변호사.',
    images: ['/images/main/hero/main_hero_1.webp'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
