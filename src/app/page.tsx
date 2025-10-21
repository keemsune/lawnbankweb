'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { CaseCard, type CaseData } from '@/components/ui/CaseCard';
import { ReviewCard, type ReviewData } from '@/components/ui/ReviewCard';
import { ScrollPopup } from '@/components/ui/ScrollPopup';
import { ArrowRight, ArrowLeft } from 'lucide-react';

// 기능 플래그 설정
const FEATURE_FLAGS = {
  SHOW_SUCCESS_CASES: false,        // 성공사례 섹션 표시 여부 (임시 블라인드)
  SHOW_ADVANTAGES: true,            // 회생터치 장점 섹션 표시 여부
  SHOW_REVIEWS: true,               // 고객후기 섹션 표시 여부
  USE_TEMP_COPY: true,              // 임시 카피 사용 여부 (7번→5번 터치)
}

// 임시 사례 데이터 (나중에 DB에서 가져올 예정) 
const mockCaseData: CaseData[] = [
  {
    id: '1',
    category: '개인회생',
    reductionRate: '60% 탕감',
    title: '음식, 음주 또는 취미활동으로 인한 채무 해결사례',
    court: '서울중앙지방법원',
    totalDebt: '77,400,000 원',
    monthlyIncome: '2,300,000 원',
    monthlyPayment: '650,000 원'
  },
  {
    id: '2',
    category: '개인파산',
    reductionRate: '100% 탕감',
    title: '사례 2 타이틀',
    court: '서울회생법원',
    totalDebt: '50,000,000 원',
    monthlyIncome: '3,000,000 원',
    monthlyPayment: '800,000 원'
  },
  {
    id: '3',
    category: '회생신청',
    reductionRate: '80% 탕감',
    title: '사례 3 타이틀',
    court: '부산지방법원',
    totalDebt: '120,000,000 원',
    monthlyIncome: '1,800,000 원',
    monthlyPayment: '480,000 원'
  },
  {
    id: '4',
    category: '워크아웃',
    reductionRate: '70% 탕감',
    title: '사례 4 타이틀',
    court: '대구지방법원',
    totalDebt: '95,500,000 원',
    monthlyIncome: '2,500,000 원',
    monthlyPayment: '720,000 원'
  }
];

// 임시 고객후기 데이터
const mockReviewData: ReviewData[] = [
  {
    id: '1',
    name: '김** 고객님',
    category: '개인회생',
    caseType: '상담',
    content: '개인회생이 너무 어렵게만 느껴지고 혹시나 딱딱하고 무거운 분위기에서 상담해야 하는건 아닐까 고민하고 망설였는데 테스트 한번 했더니 바로 연락을 주셨어요. 궁금했던 부분들 자세히 설명해주셔서 도움이 많이 되었습니다.',
    profileImage: '/images/main/review/main_review_1.webp'
  },
  {
    id: '2',
    name: '이** 고객님',
    category: '개인파산',
    caseType: '상담',
    content: '파산 신청은 왠지 낙인처럼 느껴져서 망설였는데, 담당 변호사님이 차분하게 절차와 이후 생활까지 설명해주셔서 용기가 났습니다. 혼자가 아니라는 게 정말 큰 힘이 됐습니다.',
    profileImage: '/images/main/review/main_review_1.webp'
  },
  {
    id: '3',
    name: '박** 고객님',
    category: '개인회생',
    caseType: '상담',
    content: '가족들한테도 차마 말 못 하고 속만 끓였는데, 상담 받으면서 처음으로 제 얘기를 다 털어놨어요. 앞이 막막했는데 "새로 시작할 수 있는 기회"라는 변호사님의 말에 눈물이 나더라고요. 큰 위로가 됐습니다.',
    profileImage: '/images/main/review/main_review_1.webp'
  },
  {
    id: '4',
    name: '최** 고객님',
    category: '개인회생',
    caseType: '개시결정',
    content: '은행 빚이랑 카드빚 때문에 밤마다 잠을 설쳤는데, 친절한 상담을 받고 안심했고 사건 진행도 신속하게 해주셨어요. 개시결정 받고 나니 이제 편하게 잠들 수 있어요. 세상이 달라보이네요.',
    profileImage: '/images/main/review/main_review_1.webp'
  },
  {
    id: '5',
    name: '정** 고객님',
    category: '개인회생',
    caseType: '개시결정',
    content: '세번째 재진행이어서 진행이 잘 될까? 매일 불안했는데, 개시결정 소식 듣는 순간 안심했어요. 사건진행 도와주신 변호사님, 팀장님, 대리님들 모두 감사합니다.',
    profileImage: '/images/main/review/main_review_1.webp'
  },
  {
    id: '6',
    name: '한** 고객님',
    category: '개인파산',
    caseType: '면책',
    content: '복잡한 절차들을 하나하나 친절하게 설명해주셔서 사건 진행하기 쉬웠어요. 덕분에 안심하고 진행할 수 있었습니다. 모르는것도 물어보면 바로바로 답해주셔서 든든해요.',
    profileImage: '/images/main/review/main_review_1.webp'
  }
];

export default function DevPage() {
  // 랜덤 테스트 진행자 수 상태 (1~15 사이)
  const [currentTestUsers, setCurrentTestUsers] = useState<number>(0);

  // 컴포넌트 마운트 시 랜덤 숫자 생성
  useEffect(() => {
    const randomNumber = Math.floor(Math.random() * 15) + 1; // 1~15 사이 랜덤 숫자
    setCurrentTestUsers(randomNumber);
  }, []);

  return (
    <div>
      {/* 섹션 1: 메인 히어로 */}
      <section className="relative py-14 md:py-28 overflow-hidden">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/main/hero/main_hero_bg.webp"
            alt="메인 히어로 배경"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
        
        <Container className="relative z-10">
          {/* 768px 이하: 세로 배치, 769px 이상: 좌우 배치 */}
          <div className="flex flex-col gap-8 items-center text-center md:hidden">
            {/* 모바일 전용: 세로 배치 */}
            {/* 1단: 로고 박스 */}
            <div>
              <Image
                src="/images/logo.svg"
                alt="회생터치 로고"
                width={74}
                height={18}
                className="w-[74px] h-[18px] object-contain"
              />
            </div>
            
            {/* 2단: 텍스트 */}
            <div className="flex flex-col gap-2 -mt-4">
              <h1 className="text-foreground font-title font-bold text-[32px] leading-[44px]">
                {FEATURE_FLAGS.USE_TEMP_COPY
                  ? <>5번의 터치로 찾는<br />나만의 채무 해결책</>
                  : <>7번의 터치로 찾는<br />나만의 채무 해결책</>
                }
              </h1>
              <p className="text-heading-md text-foreground">
                {FEATURE_FLAGS.USE_TEMP_COPY
                  ? <>13년 이상의 회생파산 경력으로<br />고객님의 상황에 딱 맞춘 해결책을 찾아드릴게요!</>
                  : <>2,000건 이상의 실제 사례를 분석해<br />고객님의 상황과 유사한 사례를 찾아드릴게요!</>
                }
              </p>
            </div>
            
            {/* 3단: 이미지 */}
            <div className="relative w-full flex justify-center">
              <div className="relative">
                <Image
                  src="/images/main/hero/main_hero_1.webp"
                  alt="메인 히어로 이미지"
                  width={240}
                  height={211}
                  className="w-[240px] h-auto object-contain rounded-lg"
                  sizes="240px"
                />
              </div>
            </div>
            
            {/* 4단: 버튼 */}
            <div className="w-full">
              <Link href="/diagnosis">
                <Button 
                  colorVariant="default"
                  styleVariant="fill"
                  size="l"
                  fullWidth={true}
                  rightIcon={<ArrowRight className="w-6 h-6" />}
                >
                  회생터치 시작하기
                </Button>
              </Link>
            </div>
          </div>

          {/* 769px 이상: 기존 디자인 복원 */}
          <div className="hidden md:grid md:grid-cols-2 md:gap-6 md:items-center">
            <div className="flex flex-col gap-6">
              {/* 1단: 로고 박스 */}
              <div>
                 <Image
                   src="/images/logo.svg"
                   alt="회생터치 로고"
                   width={112}
                   height={28}
                   className="w-28 h-7 object-contain"
                 />
              </div>
              
              {/* 2단: 텍스트 */}
              <div className="flex flex-col gap-4">
                <h1 className="text-title-lg-css text-foreground" style={{ lineHeight: '64px' }}>
                  {FEATURE_FLAGS.USE_TEMP_COPY
                    ? <>5번의 터치로 찾는<br />나만의 채무 해결책</>
                    : <>7번의 터치로 찾는<br />나만의 채무 해결책</>
                  }
                </h1>
                <p className="text-display-xs-css text-foreground">
                  {FEATURE_FLAGS.USE_TEMP_COPY
                    ? <>13년 이상의 회생파산 경력으로<br />고객님의 상황에 딱 맞춘 해결책을 찾아드릴게요!</>
                    : <>2,000건 이상의 실제 사례를 분석해<br />고객님의 상황과 유사한 사례를 찾아드릴게요!</>
                  }
                </p>
              </div>
              
              {/* 3단: 버튼 */}
              <div>
                <Link href="/diagnosis">
                  <Button 
                    colorVariant="default"
                    styleVariant="fill"
                    size="l"
                    rightIcon={<ArrowRight className="w-6 h-6" />}
                  >
                    회생터치 시작하기
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative w-full h-auto flex justify-center">
              <Image
                src="/images/main/hero/main_hero_1.webp"
                alt="메인 히어로 이미지"
                width={588}
                height={512}
                className="max-w-full h-auto object-contain rounded-lg"
                sizes="50vw"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 섹션 순서 컨테이너: 모바일에서는 3→2 순서, 데스크탑에서는 2→3 순서 */}
      <div className="flex flex-col">
      {/* 섹션 2: 서비스 소개 */}
        <section className="bg-background-1 py-14 md:py-14 lg:py-28 order-2 md:order-1">
        <Container>
            {/* 768px 이하: 세로 배치 */}
            <div className="flex flex-col gap-8 md:hidden">
              {/* 1단: 텍스트 */}
              <div className="text-center">
                <div className="flex flex-col gap-4">
                  {/* 첫번째 텍스트 */}
                  <div>
                    <h2 className="font-title font-black text-[32px] leading-[44px] tracking-[-0.02em]">
                      <span className="text-foreground">회생터치</span><br />
                      <span className="text-primary">핵심 서비스</span>
            </h2>
                  </div>
                  
                  {/* 두번째 텍스트 */}
                  <div>
                    <p className="text-foreground text-heading-md-css">
                      복잡한 절차,<br />
                      이제 터치만으로 해결하세요.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 2단: 서비스 카드들 (세로 배치) */}
              <div className="flex flex-col gap-4">
                {/* 카드 1 */}
                <div className="w-full">
                  <div className="w-full p-7 bg-card rounded-3xl shadow-2xl-custom">
                    {/* 세로 2단 구성 */}
                    <div className="flex flex-col">
                      {/* 1단: 상하 텍스트 두 가지 */}
                      <div className="flex flex-col gap-2 text-left">
                        {/* 1단 첫번째 텍스트 */}
                        <div>
                          <h3 className="text-heading-xl-css text-card-foreground">
                            {FEATURE_FLAGS.USE_TEMP_COPY
                              ? "간단한 테스트로 찾는 채무해결책"
                              : "AI 기반 유사 사례 매칭"
                            }
                          </h3>
                        </div>
                        
                        {/* 1단 두번째 텍스트 */}
                        <div>
                          <p className="text-body-sm-css text-card-foreground">
                            {FEATURE_FLAGS.USE_TEMP_COPY
                              ? <>고객님의 상황을 분석하고<br />딱맞는 해결책을 제공해요.</>
                              : <>비슷한 사례를 자동 분석해<br />상황을 예측해드려요.</>
                            }
                          </p>
                        </div>
          </div>
          
                      {/* 2단: 이미지 */}
                      <div className="mt-4">
                        <div className="w-[64px] h-[64px] ml-auto overflow-hidden rounded-xl">
                <Image
                  src="/images/main/service/main_service_1.webp"
                            alt="AI 기반 유사 사례 매칭"
                            width={64}
                            height={64}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 카드 2 */}
                <div className="w-full">
                  <div className="w-full p-7 bg-card rounded-3xl shadow-2xl-custom">
                    {/* 세로 2단 구성 */}
                    <div className="flex flex-col">
                      {/* 1단: 상하 텍스트 두 가지 */}
                      <div className="flex flex-col gap-2 text-left">
                        {/* 1단 첫번째 텍스트 */}
                        <div>
                          <h3 className="text-heading-xl-css text-card-foreground">고객별 최적의 맞춤 해결책 제공</h3>
                        </div>
                        
                        {/* 1단 두번째 텍스트 */}
                        <div>
                          <p className="text-body-sm-css text-card-foreground">
                            회생파산 경력 13년 이상,<br />
                            전문가의 솔루션을 드려요.
                          </p>
                        </div>
                      </div>
                      
                      {/* 2단: 이미지 */}
                      <div className="mt-4">
                        <div className="w-[64px] h-[64px] ml-auto overflow-hidden rounded-xl">
                          <Image
                            src="/images/main/service/main_service_2.webp"
                            alt="고객별 최적의 맞춤 해결책 제공"
                            width={64}
                            height={64}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 카드 3 */}
                <div className="w-full">
                  <div className="w-full p-7 bg-card rounded-3xl shadow-2xl-custom">
                    {/* 세로 2단 구성 */}
                    <div className="flex flex-col">
                      {/* 1단: 상하 텍스트 두 가지 */}
                      <div className="flex flex-col gap-2 text-left">
                        {/* 1단 첫번째 텍스트 */}
                        <div>
                          <h3 className="text-heading-xl-css text-card-foreground">전문가 연결 원스톱 프로세스</h3>
                        </div>
                        
                        {/* 1단 두번째 텍스트 */}
                        <div>
                          <p className="text-body-sm-css text-card-foreground">
                            터치만으로 전문 상담까지,<br />
                            연결이 간편해요.
                          </p>
                        </div>
                      </div>
                      
                      {/* 2단: 이미지 */}
                      <div className="mt-4">
                        <div className="w-[64px] h-[64px] ml-auto overflow-hidden rounded-xl">
                          <Image
                            src="/images/main/service/main_service_3.webp"
                            alt="전문가 연결 원스톱 프로세스"
                            width={64}
                            height={64}
                            className="w-full h-full object-contain"
                />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 769px 이상: 가로 2단 구성 */}
            <div className="hidden md:flex gap-6">
              {/* 1단: 텍스트 (점진적으로 384px에서 304px로 변화) */}
              <div className="w-96 md:w-[clamp(304px,30vw,384px)]">
                <div className="flex flex-col gap-6 text-left">
                  {/* 첫번째 텍스트 */}
                  <div>
                    <h2 className="font-title font-black text-[48px] leading-[64px] tracking-[-0.02em]">
                      <span className="text-foreground">회생터치</span><br />
                      <span className="text-primary">핵심 서비스</span>
                    </h2>
                  </div>
                  
                  {/* 두번째 텍스트 */}
                  <div>
                    <p className="text-foreground text-display-xs-css">
                      복잡한 절차,<br />
                      이제 터치만으로 해결하세요.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 2단: 서비스 카드들 (나머지 공간) */}
              <div className="flex-1 flex items-center justify-center gap-10">
                {/* 좌측: 카드 1개 */}
                <div className="flex-1 flex justify-center">
                  <div className="w-full max-w-md p-12 bg-card rounded-4xl shadow-2xl-custom transform transition-all duration-300 ease-out hover:-translate-y-3 ">
                    {/* 세로 2단 구성 */}
                    <div className="flex flex-col">
                      {/* 1단: 상하 텍스트 두 가지 */}
                      <div className="flex flex-col gap-2 text-left">
                        {/* 1단 첫번째 텍스트 */}
                        <div>
                          <h3 className="text-display-xs-css text-card-foreground">
                            {FEATURE_FLAGS.USE_TEMP_COPY
                              ? <>간단한 테스트로<br />찾는 채무해결책</>
                              : <>AI 기반<br />유사 사례 매칭</>
                            }
                          </h3>
                        </div>
                        
                        {/* 1단 두번째 텍스트 */}
                        <div>
                          <p className="text-body-md-css text-card-foreground">
                            {FEATURE_FLAGS.USE_TEMP_COPY
                              ? <>고객님의 상황을 분석하고<br />딱맞는 해결책을 제공해요.</>
                              : <>비슷한 사례를 자동 분석해<br />상황을 예측해드려요.</>
                            }
                          </p>
                        </div>
                      </div>
                      
                      {/* 2단: 이미지 */}
                      <div className="mt-6">
                        <div className="w-[120px] h-[120px] ml-auto overflow-hidden rounded-xl">
                          <Image
                            src="/images/main/service/main_service_1.webp"
                            alt="AI 기반 유사 사례 매칭"
                            width={120}
                            height={120}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 우측: 상하 카드 2개 */}
                <div className="flex-1 flex justify-center">
                  <div className="w-full max-w-md flex flex-col gap-10">
                    {/* 상단 카드 */}
                    <div className="p-12 bg-card rounded-4xl shadow-2xl-custom transform transition-all duration-300 ease-out hover:-translate-y-3 ">
                      {/* 세로 2단 구성 */}
                      <div className="flex flex-col">
                        {/* 1단: 상하 텍스트 두 가지 */}
                        <div className="flex flex-col gap-2 text-left">
                          {/* 1단 첫번째 텍스트 */}
                          <div>
                            <h3 className="text-display-xs-css text-card-foreground">고객별 최적의<br />맞춤형 해결책 제공</h3>
                          </div>
                          
                          {/* 1단 두번째 텍스트 */}
                          <div>
                            <p className="text-body-md-css text-card-foreground">
                              회생신청 경력 13년 이상,<br />
                              전문가의 솔루션을 드려요.
                            </p>
                          </div>
                        </div>
                        
                        {/* 2단: 이미지 */}
                        <div className="mt-6">
                          <div className="w-[120px] h-[120px] ml-auto overflow-hidden rounded-xl">
                <Image
                  src="/images/main/service/main_service_2.webp"
                              alt="고객별 최적의 맞춤형 해결책 제공"
                              width={120}
                              height={120}
                              className="w-full h-full object-contain"
                />
              </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 하단 카드 */}
                    <div className="p-12 bg-card rounded-4xl shadow-2xl-custom transform transition-all duration-300 ease-out hover:-translate-y-3 ">
                      {/* 세로 2단 구성 */}
                      <div className="flex flex-col">
                        {/* 1단: 상하 텍스트 두 가지 */}
                        <div className="flex flex-col gap-2 text-left">
                          {/* 1단 첫번째 텍스트 */}
                          <div>
                            <h3 className="text-display-xs-css text-card-foreground">전문가 연결<br />원스톱 프로세스</h3>
                          </div>
                          
                          {/* 1단 두번째 텍스트 */}
                          <div>
                            <p className="text-body-md-css text-card-foreground">
                              터치만으로 전문 상담까지,<br />
                              연결이 간편해요.
              </p>
                          </div>
            </div>
            
                        {/* 2단: 이미지 */}
                        <div className="mt-6">
                          <div className="w-[120px] h-[120px] ml-auto overflow-hidden rounded-xl">
                <Image
                  src="/images/main/service/main_service_3.webp"
                              alt="전문가 연결 원스톱 프로세스"
                              width={120}
                              height={120}
                              className="w-full h-full object-contain"
                />
              </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </Container>
      </section>

        {/* 섹션 3: 진단테스트 */}
        <section className="py-14 md:py-28 bg-emerald-900 order-1 md:order-2">
        <Container>
            {/* 768px 이하: 세로 2단 구성 */}
            <div className="flex flex-col gap-8 items-center md:hidden">
              {/* 1단: 텍스트 (첫번째 텍스트만 노출) */}
              <div className="text-center">
                <h2 className="font-title font-black text-[32px] leading-[44px] tracking-[-0.02em]">
                  <span className="text-white">단 </span>
                  <span className="text-emerald-300">
                    {FEATURE_FLAGS.USE_TEMP_COPY ? "5번의 터치" : "7번의 터치"}
                  </span>
                  <span className="text-white">로<br />채무 해결책 제공</span>
            </h2>
              </div>
              
              {/* 2단: 진단테스트 카드 (꽉채움) */}
              <div className="w-full relative">
                <div className="w-full bg-white rounded-4xl shadow-lg">
                  {/* 카드 내용 - 세로 3단 구성 */}
                  <div className="py-10 px-6 flex flex-col gap-8">
                    {/* 1단: 이미지 */}
                    <div className="flex justify-center">
                      <div className="w-[112px] h-[112px] overflow-hidden rounded-xl">
                        <Image
                          src="/images/main/test/main_test_1.webp"
                          alt="진단테스트 이미지"
                          width={112}
                          height={112}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    
                    {/* 2단: 텍스트 */}
                    <div className="text-center flex flex-col gap-3">
                      <h3 className="font-title font-black text-[20px] leading-[28px] text-gray-900">
                        {FEATURE_FLAGS.USE_TEMP_COPY
                          ? <>나와 같은 상황은<br />어떻게 해결될까?</>
                          : <>나와 같은 상황은<br />어떠게 해결됐을까?</>
                        }
                      </h3>
                      <p className="text-body-sm-css" style={{ color: '#4B5563' }}>
                        {FEATURE_FLAGS.USE_TEMP_COPY
                          ? <>간단한 테스트로 내 채무가<br />어떻게 해결될지 예측할 수 있어요.</>
                          : <>간단한 테스트로 나와 비슷한 상황을<br />어떻게 해결되었는지 자세히 알아볼 수 있어요.</>
                        }
            </p>
          </div>
          
                    {/* 3단: 버튼 */}
                    <div className="w-full">
                      <Button 
                        colorVariant="default"
                        styleVariant="fill"
                        size="xl"
                        fullWidth={true}
                        rightIcon={<ArrowRight className="w-6 h-6" />}
                      >
                        회생터치 테스트 해볼게요
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 769px 이상: 가로 2단 구성 */}
            <div className="hidden md:flex gap-6">
              {/* 1단: 텍스트, 버튼 세로 2단 구성 (1280px: 486px, 1024px: 386px) */}
              <div className="flex flex-col gap-6 w-[486px] md:w-[clamp(386px,calc(39.0625vw-14px),486px)]">
                {/* 텍스트 */}
                <div className="flex flex-col gap-6">
                  {/* 첫번째 텍스트 */}
                  <div>
                    <h2 className="font-title font-black text-[48px] leading-[64px] tracking-[-0.02em]">
                      <span className="text-white">단 </span>
                      <span className="text-emerald-300">
                        {FEATURE_FLAGS.USE_TEMP_COPY ? "5번의 터치" : "7번의 터치"}
                      </span>
                      <span className="text-white">로<br />채무 해결책 제공</span>
                    </h2>
                  </div>
                  
                  {/* 두번째 텍스트 */}
                  <div>
                    <p className="text-white text-display-xs-css">
                      간단한 질문에 터치만 해주세요.<br />
                      해결은 저희가 이어받을게요.
                    </p>
                  </div>
                </div>
                
                {/* 버튼 */}
                <div>
                  <Link href="/diagnosis">
                    <Button 
                      colorVariant="white"
                      styleVariant="fill"
                      size="l"
                      rightIcon={<ArrowRight className="w-6 h-6" />}
                    >
                      회생터치 시작하기
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* 2단: 진단테스트 카드 (1280px에서 588px 고정) */}
              <div className="flex-1 relative">
                {/* 카드 */}
                <div className="flex justify-start">
                  <div className="w-[588px] md:w-[clamp(468px,46vw,588px)] bg-white rounded-4xl shadow-lg">
                    {/* 카드 내용 - 세로 3단 구성 */}
                    <div className="pt-14 pr-12 pb-12 pl-12 flex flex-col gap-8">
                      {/* 1단: 이미지 */}
                      <div className="flex justify-center">
                        <div className="w-[144px] h-[144px] overflow-hidden rounded-xl">
                          <Image
                            src="/images/main/test/main_test_1.webp"
                            alt="진단테스트 이미지"
                            width={144}
                            height={144}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                      
                      {/* 2단: 텍스트 */}
                      <div className="text-center flex flex-col gap-3">
                        <h3 className="font-title font-black text-[24px] md:text-[clamp(20px,1.875vw,24px)] leading-[32px] text-gray-900">
                          {FEATURE_FLAGS.USE_TEMP_COPY
                            ? "나와 같은 상황은 어떻게 해결될까?"
                            : "나와 같은 상황은 어떻게 해결했을까?"
                          }
                        </h3>
                        <p className="text-body-md-css" style={{ color: '#4B5563' }}>
                          {FEATURE_FLAGS.USE_TEMP_COPY
                            ? <>간단한 테스트로 내 채무가<br />어떻게 해결될지 예측할 수 있어요.</>
                            : <>간단한 테스트로 나와 비슷한 상황을<br />어떻게 해결되었는지 자세히 알아볼 수 있어요.</>
                          }
              </p>
            </div>
            
                      {/* 3단: 버튼 */}
                      <div className="w-full">
                        <Button 
                          colorVariant="default"
                          styleVariant="fill"
                          size="xl"
                          fullWidth={true}
                          rightIcon={<ArrowRight className="w-6 h-6" />}
                        >
                          회생터치 테스트 해볼게요
                        </Button>
              </div>
                    </div>
                  </div>
                </div>
                
                {/* 우측상단 라벨 - 카드 상단에서 space-10 아래, 컨테이너 끝에 우측 정렬 */}
                <div className="absolute top-10 right-0 bg-secondary text-secondary-foreground px-6 py-3 rounded-xl shadow-xl text-label-md-css z-10">
                  현재 {currentTestUsers}명이 테스트 진행중입니다.
                </div>
            </div>
          </div>
        </Container>
      </section>
      </div>

      {/* 섹션 4: 성공사례 */}
      {FEATURE_FLAGS.SHOW_SUCCESS_CASES && (
      <section className="bg-gray-100 py-14 md:py-28">
        <Container>
          {/* 세로 2단 구성 */}
          <div className="flex flex-col gap-8 md:gap-24">
            {/* 1단: 가로 2단 구성 */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* 768px 이하: 텍스트만 가운데 정렬 노출 */}
              <div className="text-center md:text-left flex-1">
                <h2 className="font-title font-black text-[32px] leading-[44px] md:mb-4 md:text-section-title-css">
                  <span className="text-foreground">쉽고 간편한<br />
                  회생터치 </span>
                  <span className="text-primary">진행과정</span>
            </h2>
                <p className="text-display-xs-css text-foreground hidden md:block">
                  터치 몇 번으로 채무 문제 해결까지!
            </p>
          </div>
          
              {/* 우측 2단: 이미지박스(임시) - 769px 이상에서만 노출 */}
              <div className="flex-1 hidden md:flex">
                <div className="bg-white rounded-lg h-full w-full flex items-center justify-center">
                  <span className="text-gray-400">이미지 영역</span>
                </div>
              </div>
            </div>
            
            {/* 2단: 성공사례 (세로 2단) */}
            <div className="flex flex-col gap-8">
              {/* 1단: 타이틀 (가로 2단) */}
              <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-center gap-4">
                {/* 좌측 1단: 텍스트 */}
                <div className="flex-1 flex flex-col gap-2 text-center md:text-left">
                  <p className="text-heading-xl-css md:text-display-xs-css text-foreground">
                    회생터치를 통해 해결된 실제 사례
                  </p>
                  <p className="text-body-sm-css md:text-body-md-css text-muted-foreground">
                    총 0,000건의 성공사례가 축적되어 있어요.
                  </p>
                </div>
                
                {/* 우측 2단: 버튼 2개 - 769px 이상에서만 노출 */}
                <div className="hidden md:flex gap-4">
                  <Button
                    colorVariant="alternative"
                    styleVariant="fill"
                    size="l"
                    iconOnly={true}
                    leftIcon={<ArrowLeft className="w-6 h-6 text-card-foreground" />}
                    className="!bg-card !border-card hover:!bg-gray-50"
                  >
                    이전
                  </Button>
                  <Button
                    colorVariant="alternative"
                    styleVariant="fill"
                    size="l"
                    iconOnly={true}
                    leftIcon={<ArrowRight className="w-6 h-6 text-primary-foreground" />}
                    className="!bg-gray-500 !border-gray-500 hover:!bg-gray-600"
                  >
                    다음
                  </Button>
                </div>
            </div>
            </div>
          </div>
        </Container>
        
        {/* 2단: 사례카드들 */}
        <div className="mt-8">
          {/* 768px 이하: 세로 배치, 컨테이너 내부 */}
          <div className="md:hidden">
            <Container>
              <div className="flex flex-col gap-4">
                {mockCaseData.slice(0, 3).map((caseData) => (
                  <div key={caseData.id} className="w-full">
                    <CaseCard caseData={caseData} showButton={false} />
                  </div>
                ))}
              </div>
              
              {/* 성공사례 더 보기 버튼 */}
              <div className="mt-8">
                <Button 
                  variant="primary"
                  size="l"
                  fullWidth={true}
                  rightIcon={<ArrowRight className="w-6 h-6" />}
                >
                  성공사례 더 보기
                </Button>
              </div>
            </Container>
          </div>
          
          {/* 769px 이상: 기존 가로 스크롤 */}
          <div className="hidden md:block">
          <div className="pl-4 sm:pl-6 md:pl-8 lg:pl-[max(2.5rem,calc((100vw-1280px)/2+2.5rem))]">
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {mockCaseData.map((caseData) => (
                <div key={caseData.id} className="flex-shrink-0 w-[280px] md:w-[300px]">
                  <CaseCard caseData={caseData} />
                </div>
              ))}
              {/* 추가 카드들을 보여주기 위한 더미 데이터 */}
              {[1, 2, 3].map((i) => (
                <div key={`extra-${i}`} className="flex-shrink-0 w-[280px] md:w-[300px]">
                  <CaseCard caseData={{
                    id: `extra-${i}`,
                    category: '개인회생',
                    reductionRate: '65% 탕감',
                    title: `추가 성공사례 ${i}`,
                    court: '인천지방법원',
                    totalDebt: '85,000,000 원',
                    monthlyIncome: '2,800,000 원',
                    monthlyPayment: '750,000 원'
                  }} />
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 섹션 5: 회생터치 장점 */}
      {FEATURE_FLAGS.SHOW_ADVANTAGES && (
      <section className="py-14 md:py-28 bg-background-1">
        <Container>
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-title font-black text-[32px] leading-[44px] md:text-[48px] md:leading-[64px] text-foreground">
              왜 <span className="text-primary">회생터치</span>를<br className="md:hidden" />
              선택했을까?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-50 rounded-3xl py-6 pl-6 md:py-8 md:pl-8 pr-28 space-y-8 md:space-y-10 relative overflow-hidden transition-transform duration-300 ease-out hover:-translate-y-2">
              <p className="text-heading-md text-card-foreground">
                사업실패로 빚이 쌓여서 회생진행을 고민했어요. 서류 준비가 복잡했는데 회생터치가 꼼꼼하게 챙겨주니 마음이 놓였어요.
              </p>
              <p className="text-primary text-label-lg">
                36세 사업자 윤지씨
              </p>
              <div className="absolute right-2 top-[90%] md:top-[80%] transform -translate-y-1/2">
                <Image 
                  src="/images/main/strength/main_strength_1.webp" 
                  alt="사업자 윤지씨 이미지" 
                  width={96} 
                  height={96} 
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-3xl py-6 pl-6 md:py-8 md:pl-8 pr-28 space-y-8 md:space-y-10 relative overflow-hidden transition-transform duration-300 ease-out hover:-translate-y-2">
              <p className="text-heading-md text-card-foreground">
                직장 다니면서 회생파산을 진행하려니 찾아보기 힘든데 테스트 한번으로 전문가 상담까지 연결되니 매우 간편해요.
              </p>
              <p className="text-tertiary text-label-lg">
                31세 직장인 동근씨
              </p>
              <div className="absolute right-2 top-[60%] transform -translate-y-1/2">
                <Image 
                  src="/images/main/strength/main_strength_2.webp" 
                  alt="직장인 동근씨 이미지" 
                  width={96} 
                  height={96} 
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
            
            <div className="bg-amber-50 rounded-3xl py-6 pl-6 md:py-8 md:pl-8 pr-28 space-y-8 md:space-y-10 relative overflow-hidden transition-transform duration-300 ease-out hover:-translate-y-2">
              <p className="text-heading-md text-card-foreground">
                채권자 전화에 시달려서 매일이 전쟁 같았어요. 회생터치 진행하면서 추심 응대도 알아서 해결 해주시니 평화로워요.
              </p>
              <p className="text-secondary text-label-lg">
                42세 주부 미경씨
              </p>
              <div className="absolute right-2 top-[60%] transform -translate-y-1/2">
                <Image 
                  src="/images/main/strength/main_strength_3.webp" 
                  alt="주부 미경씨 이미지" 
                  width={120} 
                  height={120} 
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
      )}

      {/* 섹션 6: 고객후기 */}
      {FEATURE_FLAGS.SHOW_REVIEWS && (
      <section className="bg-gray-100 overflow-hidden">
        <Container>
          {/* 768px 이하: 세로 배치 */}
          <div className="flex flex-col gap-6 md:hidden py-14">
            {/* 텍스트 영역 */}
            <div className="text-center flex flex-col gap-6">
              <h2 className="font-title font-extrabold text-[32px] leading-[44px] text-foreground">
                수많은 <span className="text-primary">'경험'</span>에서<br />
                만들어진 <span className="text-primary">'신뢰'</span>
              </h2>
              <p className="text-heading-xl-css text-foreground">
                13년 이상 전문로펌에서 제공하는<br />
                회생터치의 증명된 실력을 경험해보세요.
              </p>
            </div>
            
            {/* 버튼 */}
            <div>
              <Link href="/diagnosis" className="block w-full">
                <Button 
                  colorVariant="default"
                  styleVariant="fill"
                  size="l"
                  fullWidth={true}
                  rightIcon={<ArrowRight className="w-6 h-6" />}
                >
                  회생터치 시작하기
                </Button>
              </Link>
                </div>
            
            {/* 고객후기 카드들 - 모바일 */}
            <div className="flex flex-col gap-5">
              {mockReviewData.map((reviewData) => (
                <ReviewCard key={reviewData.id} reviewData={reviewData} />
              ))}
                </div>
              </div>
          
          {/* 769px 이상: 가로 2단 배치 */}
          <div className="hidden md:flex gap-12 min-h-0">
            {/* 좌측: 텍스트 영역 */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="max-w-md flex flex-col gap-6">
                <h2 className="font-title font-extrabold text-[40px] leading-[56px] text-foreground">
                  수많은 <span className="text-primary">'경험'</span>에서<br />
                  만들어진 <span className="text-primary">'신뢰'</span>
            </h2>
                <p className="text-display-xs-css text-foreground">
                  13년 이상 전문로펌에서 제공하는<br />
                  회생터치의 증명된 실력을 경험해보세요.
            </p>
            
                <Link href="/diagnosis" className="inline-flex w-fit">
                  <Button 
                    colorVariant="default"
                    styleVariant="fill"
                    size="l"
                    rightIcon={<ArrowRight className="w-6 h-6" />}
                  >
                    회생터치 시작하기
                  </Button>
              </Link>
              </div>
            </div>
            
            {/* 우측: 고객후기 카드들 */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                {mockReviewData.map((reviewData, index) => (
                  <div 
                    key={reviewData.id} 
                    className={`transform ${index % 2 === 0 ? '-translate-y-5' : 'translate-y-5'}`}
                  >
                    <ReviewCard reviewData={reviewData} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
      )}

      {/* 스크롤 팝업 */}
      <ScrollPopup triggerPercentage={70} />
    </div>
  );
} 