'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DiagnosisIntro() {
  return (
    <div className="min-h-screen bg-background-1 md:bg-gradient-to-br md:from-blue-100 md:via-cyan-50 md:to-teal-100 relative">
      {/* 모바일 배경 이미지 */}
      <div className="md:hidden absolute inset-0 z-0">
        <Image
          src="/images/diagnosis/start/diagnosis_start_bg.webp"
          alt="배경 이미지"
          fill
          className="object-cover opacity-30"
          priority
        />
      </div>

      {/* 데스크톱 레이아웃 */}
      <div className="hidden md:flex h-[calc(100vh-80px)] items-center justify-center relative z-10">
        <div className="max-w-7xl mx-auto w-full h-full grid grid-cols-2 gap-6 items-center px-4 sm:px-6 lg:px-8">
          {/* 좌측 텍스트 영역 */}
          <div className="text-center">
            {/* 텍스트 그룹 */}
            <div className="space-y-3">
              {/* 타이틀 텍스트 */}
              <h1 
                className="font-extrabold text-foreground"
                style={{ 
                  fontSize: '40px', 
                  lineHeight: '52px',
                  fontFamily: 'var(--font-title), sans-serif' 
                }}
              >
                7번의 터치로 끝내는<br />
                <span className="text-primary">자가진단 테스트</span>
            </h1>
              
              {/* 서브 텍스트 */}
              <div className="text-heading-lg text-gray-600">
                <p>
                  상황을 알아야 해결책이 보인다.<br />
                  나와 비슷한 상황, 어떻게 해결했을까?
                </p>
              </div>
            </div>
            
            {/* 버튼 */}
            <div className="mt-6">
              <Link href="/diagnosis/test">
                <Button 
                  colorVariant="alternative" 
                  styleVariant="outline"
                  size="base" 
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  테스트 시작하기
                </Button>
            </Link>
            </div>
          </div>
          
          {/* 우측 이미지 영역 */}
          <div className="relative w-full flex justify-center items-center">
            <div className="relative">
              {/* 배경 이미지 */}
              <Image
                src="/images/diagnosis/start/diagnosis_start_1.webp"
                alt="자가진단 시작 이미지"
                width={400}
                height={600}
                className="w-full h-auto max-w-xl"
                priority
              />
              
              {/* 클릭 가능한 버튼 오버레이 */}
              <div className="absolute inset-0 flex items-end justify-center pb-20 z-20">
                <div className="w-5/12">
                  <Link href="/diagnosis/test">
                    <Button 
                      variant="primary" 
                      size="base" 
                      rightIcon={<ArrowRight className="w-5 h-5 xl:w-6 xl:h-6" />}
                      className="w-full xl:text-label-md-css xl:min-h-[52px] xl:py-3.5 xl:px-6"
                    >
                      자가진단 시작하기
                    </Button>
                  </Link>
                </div>
                              </div>
                          </div>
                        </div>
                    </div>
                  </div>
                  
            {/* 모바일 레이아웃 (세로 3단 구성) */}
      <div className="md:hidden flex flex-col min-h-screen pt-20 pb-8 relative z-10">
        <div className="flex-1 flex flex-col px-4">
          
          {/* 1단: 텍스트 */}
          <div className="text-center mb-auto">
            <h1 className="font-extrabold" style={{ fontFamily: 'var(--font-title), sans-serif' }}>
              <div 
                className="text-primary"
                style={{ 
                  fontSize: '32px', 
                  lineHeight: '42px' 
                }}
              >
                채무해결,
              </div>
              <div 
                className="text-foreground"
                style={{ 
                  fontSize: '24px', 
                  lineHeight: '34px' 
                }}
              >
                지금부터 시작해볼까요?
                  </div>
            </h1>
            
            {/* 서브 텍스트 */}
            <div className="mt-3 text-heading-lg text-gray-600">
              7개의 문항으로 나의 상황을 알아봐요
                    </div>
                    </div>
                    
          {/* 2단: 버튼 */}
          <div className="px-4 mt-6 mb-6">
            <Link href="/diagnosis/test">
              <Button 
                colorVariant="default" 
                size="l"
                rightIcon={<ArrowRight />}
                className="w-full"
              >
                자가진단 시작하기
              </Button>
            </Link>
                    </div>
                    
          {/* 3단: 이미지 */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative flex justify-center">
              <Image
                src="/images/diagnosis/start/diagnosis_start_2.webp"
                alt="자가진단 시작 이미지"
                width={320}
                height={240}
                className="h-60 w-auto object-contain"
                priority
                      />
                    </div>
                  </div>
                  
          {/* 4단: 하단 안전 여백 */}
          <div className="h-20"></div>
                </div>
              </div>
              
      
    </div>
  );
} 