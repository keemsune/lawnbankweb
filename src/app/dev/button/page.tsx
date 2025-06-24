'use client';

import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { useState } from 'react';

// 아이콘 컴포넌트들
const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default function ButtonDemo() {
  const [isLoading, setIsLoading] = useState(false);

  const sizes = ['xs', 'sm', 'base', 'l', 'xl'] as const;
  const variants = ['primary', 'secondary', 'tertiary', 'outline', 'destructive'] as const;

  const handleLoadingTest = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <Container>
      <div className="py-8 space-y-12">
        <div className="text-center">
          <h1 className="text-display-lg-css mb-4">Button Component Demo</h1>
          <p className="text-body-lg-css text-muted-foreground">
            모든 사이즈와 variant를 확인할 수 있는 Button 컴포넌트 데모입니다.
          </p>
        </div>

        {/* Boolean Variants Section */}
        <section className="space-y-6">
          <h2 className="text-heading-xl-css">Boolean Variants</h2>
          
          {/* Icon Only Buttons */}
          <div className="space-y-4">
            <h3 className="text-label-lg-css font-medium">Icon Only (iconOnly=true)</h3>
            <div className="space-y-4">
              {/* 모든 사이즈 */}
              <div className="space-y-2">
                <h4 className="text-label-md-css text-muted-foreground">모든 사이즈:</h4>
                <div className="flex items-center gap-4 flex-wrap">
                  <Button iconOnly size="xs" leftIcon={<PlusIcon />}>Add</Button>
                  <Button iconOnly size="sm" leftIcon={<HeartIcon />}>Like</Button>
                  <Button iconOnly size="base" leftIcon={<TrashIcon />}>Delete</Button>
                  <Button iconOnly size="l" leftIcon={<ArrowRightIcon />}>Next</Button>
                  <Button iconOnly size="xl" leftIcon={<PlusIcon />}>Add</Button>
                </div>
              </div>
              
              {/* 다양한 variant */}
              <div className="space-y-2">
                <h4 className="text-label-md-css text-muted-foreground">다양한 variant:</h4>
                <div className="flex items-center gap-4 flex-wrap">
                  <Button iconOnly variant="primary" leftIcon={<PlusIcon />}>Add</Button>
                  <Button iconOnly variant="secondary" leftIcon={<HeartIcon />}>Like</Button>
                  <Button iconOnly variant="tertiary" leftIcon={<TrashIcon />}>Delete</Button>
                  <Button iconOnly variant="destructive" leftIcon={<ArrowRightIcon />}>Delete</Button>
                  <Button iconOnly variant="outline" leftIcon={<PlusIcon />}>Add</Button>
                </div>
              </div>
              
              {/* Color Variants */}
              <div className="space-y-2">
                <h4 className="text-label-md-css text-muted-foreground">Color variants:</h4>
                <div className="flex items-center gap-4 flex-wrap">
                  <Button iconOnly colorVariant="default" leftIcon={<PlusIcon />}>Add</Button>
                  <Button iconOnly colorVariant="white" leftIcon={<HeartIcon />}>Like</Button>
                  <Button iconOnly colorVariant="alternative" leftIcon={<TrashIcon />}>Delete</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Left Icon Control */}
          <div className="space-y-4">
            <h3 className="text-label-lg-css font-medium">Left Icon Control (showLeftIcon)</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-label-md-css text-muted-foreground">Show Left Icon (true):</h4>
                <div className="flex items-center gap-4 flex-wrap">
                  <Button showLeftIcon={true} leftIcon={<PlusIcon />}>Add Item</Button>
                  <Button showLeftIcon={true} leftIcon={<HeartIcon />} rightIcon={<ArrowRightIcon />}>Like & Share</Button>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-label-md-css text-muted-foreground">Hide Left Icon (false):</h4>
                <div className="flex items-center gap-4 flex-wrap">
                  <Button showLeftIcon={false} leftIcon={<PlusIcon />}>Add Item</Button>
                  <Button showLeftIcon={false} leftIcon={<HeartIcon />} rightIcon={<ArrowRightIcon />}>Like & Share</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Icon Control */}
          <div className="space-y-4">
            <h3 className="text-label-lg-css font-medium">Right Icon Control (showRightIcon)</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-label-md-css text-muted-foreground">Show Right Icon (true):</h4>
                <div className="flex items-center gap-4 flex-wrap">
                  <Button showRightIcon={true} rightIcon={<ArrowRightIcon />}>Continue</Button>
                  <Button showRightIcon={true} leftIcon={<HeartIcon />} rightIcon={<ArrowRightIcon />}>Like & Share</Button>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-label-md-css text-muted-foreground">Hide Right Icon (false):</h4>
                <div className="flex items-center gap-4 flex-wrap">
                  <Button showRightIcon={false} rightIcon={<ArrowRightIcon />}>Continue</Button>
                  <Button showRightIcon={false} leftIcon={<HeartIcon />} rightIcon={<ArrowRightIcon />}>Like & Share</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Combined Controls */}
          <div className="space-y-4">
            <h3 className="text-label-lg-css font-medium">Combined Icon Controls</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-label-md-css text-muted-foreground">Both Icons:</h4>
                <div className="flex items-center gap-4 flex-wrap">
                  <Button showLeftIcon={true} showRightIcon={true} leftIcon={<HeartIcon />} rightIcon={<ArrowRightIcon />}>Like & Continue</Button>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-label-md-css text-muted-foreground">Left Only:</h4>
                <div className="flex items-center gap-4 flex-wrap">
                  <Button showLeftIcon={true} showRightIcon={false} leftIcon={<HeartIcon />} rightIcon={<ArrowRightIcon />}>Like & Continue</Button>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-label-md-css text-muted-foreground">Right Only:</h4>
                <div className="flex items-center gap-4 flex-wrap">
                  <Button showLeftIcon={false} showRightIcon={true} leftIcon={<HeartIcon />} rightIcon={<ArrowRightIcon />}>Like & Continue</Button>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-label-md-css text-muted-foreground">No Icons:</h4>
                <div className="flex items-center gap-4 flex-wrap">
                  <Button showLeftIcon={false} showRightIcon={false} leftIcon={<HeartIcon />} rightIcon={<ArrowRightIcon />}>Like & Continue</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Icon Only with States */}
          <div className="space-y-4">
            <h3 className="text-label-lg-css font-medium">Icon Only with States</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-label-md-css text-muted-foreground">Loading:</h4>
                <div className="flex items-center gap-4 flex-wrap">
                  <Button iconOnly isLoading leftIcon={<PlusIcon />}>Add</Button>
                  <Button iconOnly isLoading size="l" leftIcon={<HeartIcon />}>Like</Button>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-label-md-css text-muted-foreground">Disabled:</h4>
                <div className="flex items-center gap-4 flex-wrap">
                  <Button iconOnly disabled leftIcon={<PlusIcon />}>Add</Button>
                  <Button iconOnly disabled size="l" leftIcon={<HeartIcon />}>Like</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 정확한 스펙 테스트 */}
        <section className="space-y-6">
          <h2 className="text-heading-xl-css">정확한 스펙 테스트</h2>
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <div className="space-y-2">
              <h3 className="text-label-md-css font-medium">Size xs (34px 높이, py-2 px-4, Label xs, 16x16 아이콘)</h3>
              <button className="inline-flex items-center justify-center py-2 px-4 text-label-xs-css min-h-[34px] gap-2 rounded-full border bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700">
                정확한 xs 버튼
              </button>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-label-md-css font-medium">Size sm (36px 높이, py-2 px-4, Label sm, 16x16 아이콘)</h3>
              <button className="inline-flex items-center justify-center py-2 px-4 text-label-sm-css min-h-[36px] gap-2 rounded-full border bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700">
                정확한 sm 버튼
              </button>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-label-md-css font-medium">Size base (40px 높이, py-2.5 px-5, Label sm, 20x20 아이콘)</h3>
              <button className="inline-flex items-center justify-center py-2.5 px-5 text-label-sm-css min-h-[40px] gap-2 rounded-full border bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700">
                정확한 base 버튼
              </button>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-label-md-css font-medium">Size l (48px 높이, py-3 px-5, Label md, 24x24 아이콘)</h3>
              <button className="inline-flex items-center justify-center py-3 px-5 text-label-md-css min-h-[48px] gap-2 rounded-full border bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700">
                정확한 l 버튼
              </button>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-label-md-css font-medium">Size xl (52px 높이, py-3.5 px-6, Label md, 24x24 아이콘)</h3>
              <button className="inline-flex items-center justify-center py-3.5 px-6 text-label-md-css min-h-[52px] gap-2 rounded-full border bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700">
                정확한 xl 버튼
              </button>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-label-md-css font-medium">아이콘 포함 테스트 (base 사이즈)</h3>
              <button className="inline-flex items-center justify-center py-2.5 px-5 text-label-sm-css min-h-[40px] gap-2 rounded-full border bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>아이콘 버튼</span>
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* 사이즈별 데모 */}
        <section className="space-y-6">
          <h2 className="text-heading-xl-css">사이즈별 버튼</h2>
          <div className="space-y-4">
            {sizes.map((size) => (
              <div key={size} className="space-y-2">
                <h3 className="text-label-md-css text-muted-foreground capitalize">Size: {size}</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button size={size}>기본 버튼</Button>
                  <Button size={size} leftIcon={<PlusIcon />}>
                    아이콘 버튼
                  </Button>
                  <Button size={size} rightIcon={<ArrowRightIcon />}>
                    오른쪽 아이콘
                  </Button>
                  <Button size={size} leftIcon={<PlusIcon />} rightIcon={<ArrowRightIcon />}>
                    양쪽 아이콘
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Variant별 데모 */}
        <section className="space-y-6">
          <h2 className="text-heading-xl-css">Variant별 버튼</h2>
          <div className="space-y-4">
            {variants.map((variant) => (
              <div key={variant} className="space-y-2">
                <h3 className="text-label-md-css text-muted-foreground capitalize">Variant: {variant}</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant={variant}>기본</Button>
                  <Button variant={variant} leftIcon={<HeartIcon />}>
                    아이콘
                  </Button>
                  <Button variant={variant} disabled>
                    비활성화
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 새로운 Color Variant 데모 */}
        <section className="space-y-6">
          <h2 className="text-heading-xl-css">새로운 Color Variant</h2>
          <div className="space-y-6">
            
            {/* White Color Variant */}
            <div className="space-y-3">
              <h3 className="text-label-lg-css font-medium">White Color Variant</h3>
              <div className="bg-gray-900 p-6 rounded-lg space-y-4">
                <div className="space-y-2">
                  <h4 className="text-label-md-css text-white">Fill Style</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button colorVariant="white" styleVariant="fill">White 버튼</Button>
                    <Button colorVariant="white" styleVariant="fill" leftIcon={<PlusIcon />}>
                      아이콘 포함
                    </Button>
                    <Button colorVariant="white" styleVariant="fill" disabled>
                      비활성화
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Alternative Color Variant */}
            <div className="space-y-3">
              <h3 className="text-label-lg-css font-medium">Alternative Color Variant</h3>
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div className="space-y-2">
                  <h4 className="text-label-md-css">Outline Style</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button colorVariant="alternative" styleVariant="outline">Alternative 버튼</Button>
                    <Button colorVariant="alternative" styleVariant="outline" leftIcon={<HeartIcon />}>
                      아이콘 포함
                    </Button>
                    <Button colorVariant="alternative" styleVariant="outline" disabled>
                      비활성화
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* 조합 예시 */}
            <div className="space-y-3">
              <h3 className="text-label-lg-css font-medium">모든 조합 예시</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Default 조합들 */}
                <div className="space-y-3">
                  <h4 className="text-label-md-css">Default Color Variants</h4>
                  <div className="space-y-2">
                    <Button colorVariant="default" styleVariant="fill" variant="primary">Primary Fill</Button>
                    <Button colorVariant="default" styleVariant="outline" variant="primary">Primary Outline</Button>
                    <Button colorVariant="default" styleVariant="fill" variant="secondary">Secondary Fill</Button>
                    <Button colorVariant="default" styleVariant="outline" variant="secondary">Secondary Outline</Button>
                  </div>
                </div>

                {/* 새로운 조합들 */}
                <div className="space-y-3">
                  <h4 className="text-label-md-css">새로운 조합들</h4>
                  <div className="space-y-2">
                    <Button colorVariant="white" styleVariant="fill">White Fill</Button>
                    <Button colorVariant="alternative" styleVariant="outline">Alternative Outline</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 상태별 데모 */}
        <section className="space-y-6">
          <h2 className="text-heading-xl-css">상태별 버튼</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 기본 상태 */}
            <div className="space-y-3">
              <h3 className="text-label-md-css">기본 상태</h3>
              <div className="space-y-2">
                <Button>기본 버튼</Button>
                <Button variant="secondary">보조 버튼</Button>
                <Button variant="outline">아웃라인 버튼</Button>
              </div>
            </div>

            {/* 비활성화 상태 */}
            <div className="space-y-3">
              <h3 className="text-label-md-css">비활성화 상태</h3>
              <div className="space-y-2">
                <Button disabled>비활성화</Button>
                <Button variant="secondary" disabled>보조 비활성화</Button>
                <Button variant="outline" disabled>아웃라인 비활성화</Button>
              </div>
            </div>

            {/* 로딩 상태 */}
            <div className="space-y-3">
              <h3 className="text-label-md-css">로딩 상태</h3>
              <div className="space-y-2">
                <Button isLoading={isLoading} onClick={handleLoadingTest}>
                  로딩 테스트
                </Button>
                <Button variant="secondary" isLoading>
                  로딩 중...
                </Button>
                <Button variant="outline" isLoading>
                  처리 중
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 특수 케이스 */}
        <section className="space-y-6">
          <h2 className="text-heading-xl-css">특수 케이스</h2>
          <div className="space-y-6">
            
            {/* 전체 너비 버튼 */}
            <div className="space-y-3">
              <h3 className="text-label-md-css">전체 너비 버튼</h3>
              <div className="space-y-2">
                <Button fullWidth>전체 너비 기본 버튼</Button>
                <Button variant="outline" fullWidth leftIcon={<PlusIcon />}>
                  전체 너비 아웃라인 버튼
                </Button>
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="space-y-3">
              <h3 className="text-label-md-css">액션 버튼 예시</h3>
              <div className="flex flex-wrap gap-3">
                <Button leftIcon={<PlusIcon />}>
                  새로 만들기
                </Button>
                <Button variant="secondary" rightIcon={<ArrowRightIcon />}>
                  다음 단계
                </Button>
                <Button variant="outline" leftIcon={<HeartIcon />}>
                  좋아요
                </Button>
                <Button variant="destructive" leftIcon={<TrashIcon />}>
                  삭제
                </Button>
                <Button variant="outline">
                  취소
                </Button>
              </div>
            </div>

            {/* 사이즈 조합 */}
            <div className="space-y-3">
              <h3 className="text-label-md-css">사이즈별 액션 버튼</h3>
              <div className="flex flex-wrap gap-3 items-center">
                <Button size="xs" leftIcon={<PlusIcon />}>
                  추가
                </Button>
                <Button size="sm" variant="secondary">
                  편집
                </Button>
                <Button size="base" variant="outline">
                  미리보기
                </Button>
                <Button size="l" variant="destructive">
                  삭제
                </Button>
                <Button size="xl" rightIcon={<ArrowRightIcon />}>
                  계속하기
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 사용법 안내 */}
        <section className="space-y-6">
          <h2 className="text-heading-xl-css">사용법</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <pre className="text-body-sm-css text-gray-700 overflow-x-auto">
{`// 기본 사용법
<Button>기본 버튼</Button>

// 사이즈 지정
<Button size="xl">큰 버튼</Button>

// Variant 지정
<Button variant="secondary">보조 버튼</Button>

// 아이콘 포함
<Button leftIcon={<PlusIcon />}>추가</Button>
<Button rightIcon={<ArrowIcon />}>다음</Button>

// 상태 관리
<Button disabled>비활성화</Button>
<Button isLoading>로딩 중</Button>

// 전체 너비
<Button fullWidth>전체 너비</Button>

// 조합 예시
<Button 
  size="l" 
  variant="primary" 
  leftIcon={<Icon />}
  onClick={handleClick}
  fullWidth
>
  완료
</Button>`}
            </pre>
          </div>
        </section>
      </div>
    </Container>
  );
} 