'use client';

import { Button } from '@/components/ui/Button';
import Container from '@/components/layout/Container';
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
  const variants = ['primary', 'secondary', 'tertiary', 'outline', 'ghost', 'destructive'] as const;

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
                <Button variant="ghost">
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