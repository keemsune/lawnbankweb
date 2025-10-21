'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ScrollPopupProps {
  /** 팝업이 나타날 스크롤 퍼센트 (기본값: 50) */
  triggerPercentage?: number;
  /** 팝업을 닫은 후 다시 나타나지 않게 할지 여부 (기본값: true) */
  persistClose?: boolean;
}

export function ScrollPopup({ 
  triggerPercentage = 50, 
  persistClose = true 
}: ScrollPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const updateScrollPosition = () => {
      const currentPosition = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = documentHeight > 0 ? (currentPosition / documentHeight) * 100 : 0;
      
      setScrollPercentage(percentage);
    };

    const handleScroll = () => {
      updateScrollPosition();
    };

    window.addEventListener('scroll', handleScroll);
    updateScrollPosition(); // 초기값 설정

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (scrollPercentage >= triggerPercentage && !isClosed) {
      setIsVisible(true);
    }
  }, [scrollPercentage, triggerPercentage, isClosed]);

  const handleClose = () => {
    setIsVisible(false);
    if (persistClose) {
      setIsClosed(true);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* 오버레이 */}
      <div 
        className="fixed inset-0 bg-black/50 z-[60] animate-in fade-in duration-300"
        onClick={handleClose}
      />
      
      {/* 팝업 */}
      <div className="fixed bottom-0 left-0 right-0 z-[70] animate-in slide-in-from-bottom-4 duration-300 md:bottom-6 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 md:w-[calc(100%-2rem)] md:max-w-md">
        <div className="bg-white rounded-t-3xl shadow-2xl p-6 relative md:rounded-3xl">
          {/* 닫기 버튼 */}
          <div className="absolute top-6 right-6">
            <Button
              onClick={handleClose}
              colorVariant="default"
              styleVariant="fill"
              size="xs"
              iconOnly={true}
              leftIcon={<X className="w-4 h-4" />}
              className="!bg-black !text-white hover:!bg-gray-800"
            >
              닫기
            </Button>
          </div>

          {/* 콘텐츠 */}
          <div className="flex gap-4 pr-8">
            {/* 왼쪽: 텍스트 그룹 */}
            <div className="flex-1">
              <h3 className="text-[24px] leading-[32px] font-bold text-primary font-title mb-3">
                잠깐!
              </h3>
              
              {/* 설명 텍스트 + 버튼과 이미지가 함께 정렬되는 영역 */}
              <div className="flex items-center gap-4">
                <div className="flex-1 flex flex-col gap-3">
                  <p className="text-heading-md md:text-heading-lg text-foreground">
                    간단한 테스트로<br />
                    신청자격을 조회해 보세요
                  </p>

                  <div>
                    <Link href="/diagnosis/test" onClick={handleClose}>
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-primary text-primary rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-colors">
                        바로 테스트 하기
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>

                {/* 오른쪽: 이미지 영역 */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 overflow-hidden rounded-xl">
                    <Image
                      src="/images/main/test/main_test_1.webp"
                      alt="테스트 이미지"
                      width={96}
                      height={96}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
