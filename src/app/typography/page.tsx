import { Container } from '@/components/layout/Container'

export default function TypographyPage() {
  return (
    <Container className="py-10">
      <div className="space-y-12">
        {/* 페이지 제목 */}
        <div className="text-center">
          <h1 className="text-display-md mb-4">타이포그래피 시스템</h1>
          <p className="text-body-lg text-muted-foreground">
            체계적으로 정의된 타이포그래피 스타일 가이드
          </p>
        </div>

        {/* Title Typography */}
        <section>
          <h2 className="text-heading-xl mb-6 pb-2 border-b">Title Typography</h2>

          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-4">font-title + text-title-3xl (96px/120px, ExtraBold 800, -0.03em)</p>
              <h1 className="font-title text-title-3xl text-emerald-700">Title 3XL</h1>
            </div>
            <div className="p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-4">font-title + text-title-2xl (80px/100px, ExtraBold 800, -0.02em)</p>
              <h1 className="font-title text-title-2xl text-emerald-700">Title 2XL - 롯데리아</h1>
            </div>
            <div className="p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-4">font-title + text-title-xl (64px/80px, ExtraBold 800, -0.02em)</p>
              <h1 className="font-title text-title-xl text-emerald-700">Title XL - 특별한 제목</h1>
            </div>
            <div className="p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-4">font-title + text-title-lg (48px/60px, ExtraBold 800, -0.02em)</p>
              <h1 className="font-title text-title-lg text-emerald-700">Title Large - 임팩트 있는 메시지</h1>
            </div>
            <div className="p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-4">font-title + text-title-md (36px/44px, ExtraBold 800, -0.01em)</p>
              <h1 className="font-title text-title-md text-emerald-700">Title Medium - 서브 타이틀</h1>
            </div>
            <div className="p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-4">font-title + text-title-sm (30px/38px, ExtraBold 800, -0.01em)</p>
              <h1 className="font-title text-title-sm text-emerald-700">Title Small - 작은 타이틀</h1>
            </div>
          </div>
          <div className="mt-6 p-4 bg-amber-50 rounded-lg">
            <h4 className="text-heading-sm mb-2 text-amber-800">Ria Sans ExtraBold 특징</h4>
            <ul className="text-body-sm text-amber-700 space-y-1">
              <li>• 롯데리아 브랜드에서 사용하는 임팩트 있는 폰트</li>
              <li>• ExtraBold(800) 웨이트로 강력한 시각적 임팩트</li>
              <li>• 히어로 섹션, 메인 타이틀, 섹션 제목, 강조 텍스트에 활용</li>
              <li>• font-title 클래스와 text-title-* 클래스로 사용</li>
              <li>• 폴백: Noto Sans KR → 시스템 폰트</li>
            </ul>
          </div>
        </section>

        {/* Display Typography */}
        <section>
          <h2 className="text-heading-xl mb-6 pb-2 border-b">Display Typography</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-display-2xl (72px/90px, Bold, -0.02em)</p>
              <h1 className="text-display-2xl">Display 2XL</h1>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-display-xl (60px/72px, Bold, -0.02em)</p>
              <h1 className="text-display-xl">Display XL</h1>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-display-lg (48px/60px, Bold, -0.02em)</p>
              <h1 className="text-display-lg">Display Large</h1>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-display-md (36px/44px, Bold, -0.02em)</p>
              <h1 className="text-display-md">Display Medium</h1>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-display-sm (30px/38px, Bold, -0.01em)</p>
              <h1 className="text-display-sm">Display Small</h1>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-display-xs (24px/32px, Bold, -0.01em)</p>
              <h1 className="text-display-xs">Display XSmall</h1>
            </div>
          </div>
        </section>

        {/* Heading Typography */}
        <section>
          <h2 className="text-heading-xl mb-6 pb-2 border-b">Heading Typography</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-heading-xl (20px/30px, Bold)</p>
              <h3 className="text-heading-xl">Heading XL - 섹션 제목용</h3>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-heading-lg (18px/28px, Bold)</p>
              <h4 className="text-heading-lg">Heading Large - 서브 섹션 제목</h4>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-heading-md (16px/24px, Bold)</p>
              <h5 className="text-heading-md">Heading Medium - 카드 제목</h5>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-heading-sm (14px/20px, Bold)</p>
              <h6 className="text-heading-sm">Heading Small - 작은 제목</h6>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-heading-xs (12px/18px, Bold, 0.05em)</p>
              <h6 className="text-heading-xs">HEADING XSMALL - 라벨 제목</h6>
            </div>
          </div>
        </section>

        {/* Body Typography */}
        <section>
          <h2 className="text-heading-xl mb-6 pb-2 border-b">Body Typography</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-body-xl (20px/30px, Regular)</p>
              <p className="text-body-xl">
                Body XL - 큰 본문 텍스트입니다. 중요한 설명이나 인트로 텍스트에 사용됩니다.
                가독성이 좋아 긴 글을 읽기에 적합합니다.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-body-lg (18px/28px, Regular)</p>
              <p className="text-body-lg">
                Body Large - 일반적인 본문 텍스트입니다. 대부분의 콘텐츠에서 
                기본적으로 사용되는 크기로 최적의 가독성을 제공합니다.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-body-md (16px/24px, Regular)</p>
              <p className="text-body-md">
                Body Medium - 표준 본문 텍스트입니다. 웹에서 가장 일반적으로 
                사용되는 크기로 모든 디바이스에서 읽기 편합니다.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-body-sm (14px/20px, Regular)</p>
              <p className="text-body-sm">
                Body Small - 작은 본문 텍스트입니다. 부가 설명이나 
                상세 정보를 표시할 때 사용됩니다.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-body-xs (12px/18px, Regular)</p>
              <p className="text-body-xs">
                Body XSmall - 가장 작은 본문 텍스트입니다. 
                법적 고지사항이나 저작권 정보에 사용됩니다.
              </p>
            </div>
          </div>
        </section>

        {/* Label Typography */}
        <section>
          <h2 className="text-heading-xl mb-6 pb-2 border-b">Label Typography</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-label-xl (20px/30px, Medium)</p>
              <span className="text-label-xl">Label XL - 큰 버튼 텍스트</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-label-lg (18px/28px, Medium)</p>
              <span className="text-label-lg">Label Large - 일반 버튼 텍스트</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-label-md (16px/24px, Medium)</p>
              <span className="text-label-md">Label Medium - 표준 라벨</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-label-sm (14px/20px, Medium)</p>
              <span className="text-label-sm">Label Small - 작은 버튼</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-label-xs (12px/18px, Medium, 0.05em)</p>
              <span className="text-label-xs">LABEL XSMALL - 태그</span>
            </div>
          </div>
        </section>

        {/* Caption Typography */}
        <section>
          <h2 className="text-heading-xl mb-6 pb-2 border-b">Caption Typography</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-caption-lg (14px/20px, Regular)</p>
              <p className="text-caption-lg">Caption Large - 이미지 캡션이나 부가 설명</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-caption-md (12px/18px, Regular)</p>
              <p className="text-caption-md">Caption Medium - 메타 정보나 시간 표시</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-caption-sm (11px/16px, Regular, 0.05em)</p>
              <p className="text-caption-sm">Caption Small - 작은 메타 정보</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-caption-md text-gray-600 mb-2">text-caption-xs (10px/14px, Regular, 0.05em)</p>
              <p className="text-caption-xs">Caption XSmall - 가장 작은 텍스트</p>
            </div>
          </div>
        </section>

        {/* Font Family & Weights Demo */}
        <section>
          <h2 className="text-heading-xl mb-6 pb-2 border-b">Font Family & Weights</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-heading-md mb-4">Noto Sans KR - 한국어 최적화 폰트</h3>
              <div className="space-y-2">
                <p className="text-body-md font-thin">Thin (100) - 매우 얇은 폰트 | 한글 타이포그래피</p>
                <p className="text-body-md font-light">Light (300) - 가벼운 폰트 | 한글 타이포그래피</p>
                <p className="text-body-md font-normal">Regular (400) - 일반 폰트 | 한글 타이포그래피</p>
                <p className="text-body-md font-medium">Medium (500) - 중간 두께 폰트 | 한글 타이포그래피</p>
                <p className="text-body-md font-bold">Bold (700) - 굵은 폰트 | 한글 타이포그래피</p>
                <p className="text-body-md font-black">Black (900) - 가장 굵은 폰트 | 한글 타이포그래피</p>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="text-heading-sm mb-2 text-blue-800">Noto Sans KR 특징</h4>
              <ul className="text-body-sm text-blue-700 space-y-1">
                <li>• Google Fonts에서 제공하는 한국어 전용 폰트</li>
                <li>• 한글, 영문, 숫자 모두 최적화된 가독성</li>
                <li>• 웹 환경에서 안정적인 렌더링</li>
                <li>• 6가지 폰트 웨이트 지원: Thin, Light, Regular, Medium, Bold, Black</li>
                <li>• 실제 지원: 100, 300, 400, 500, 700, 900</li>
                <li>• ExtraLight(200), SemiBold(600), ExtraBold(800)는 지원하지 않음</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CSS 변수 사용법 */}
        <section>
          <h2 className="text-heading-xl mb-6 pb-2 border-b">CSS 변수 사용법</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-heading-md mb-4">Tailwind 클래스 방식</h3>
              <pre className="text-caption-md bg-gray-800 text-white p-3 rounded overflow-x-auto">
{`<!-- 기본 타이포그래피 -->
<h1 className="text-display-lg">큰 제목</h1>
<p className="text-body-md">본문 텍스트</p>
<span className="text-label-sm">라벨 텍스트</span>

<!-- 타이틀 타이포그래피 -->
<h1 className="font-title text-title-2xl">임팩트 제목</h1>
<h2 className="font-title text-title-lg">서브 타이틀</h2>`}
              </pre>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-heading-md mb-4">CSS 변수 방식</h3>
              <pre className="text-caption-md bg-gray-800 text-white p-3 rounded overflow-x-auto">
{`/* 기본 폰트 */
.custom-title {
  font-family: var(--font-sans);
  font-size: var(--text-display-lg);
  font-weight: var(--font-weight-bold);
  line-height: 60px;
  letter-spacing: -0.02em;
}

/* 타이틀 폰트 */
.title-style {
  font-family: var(--font-title);
  font-size: var(--text-title-2xl);
  font-weight: 800;
  line-height: 100px;
  letter-spacing: -0.02em;
}`}
              </pre>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-heading-md mb-4">커스텀 유틸리티 클래스</h3>
              <pre className="text-caption-md bg-gray-800 text-white p-3 rounded overflow-x-auto">
{`<!-- 기본 타이포그래피 CSS 클래스 -->
<h1 className="text-display-lg-css">CSS 변수 기반 제목</h1>
<p className="text-body-md-css">CSS 변수 기반 본문</p>

<!-- 타이틀 타이포그래피 CSS 클래스 -->
<h1 className="text-title-2xl-css">임팩트 제목</h1>
<h2 className="text-title-lg-css">서브 타이틀</h2>`}
              </pre>
            </div>
          </div>
        </section>

        {/* 실제 사용 예시 */}
        <section>
          <h2 className="text-heading-xl mb-6 pb-2 border-b">실제 사용 예시</h2>
          <div className="space-y-6">
            {/* 히어로 섹션 예시 */}
            <div className="p-8 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg">
              <h1 className="font-title text-title-2xl mb-4">
                채무 해결의 시작
              </h1>
              <h2 className="font-title text-title-md mb-6 opacity-90">
                3분 진단으로 찾는 맞춤 솔루션
              </h2>
              <p className="text-body-lg mb-6 opacity-80 max-w-2xl">
                전문가와 함께하는 채무 해결 여정을 시작하세요. 
                당신만의 상황에 맞는 최적의 해결책을 제공합니다.
              </p>
              <button className="text-label-lg bg-white text-emerald-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                무료 진단 시작하기
              </button>
            </div>
            {/* 카드 예시 */}
            <div className="p-6 bg-white border rounded-lg shadow-sm">
              <h3 className="text-heading-lg mb-2">채무 해결 서비스</h3>
              <p className="text-body-md text-gray-600 mb-4">
                전문가와 함께하는 맞춤형 채무 해결 솔루션을 제공합니다. 
                3분 진단으로 나에게 맞는 해결책을 찾아보세요.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-caption-md text-gray-500">2024.01.15</span>
                <button className="text-label-sm bg-primary text-white px-4 py-2 rounded">
                  자세히 보기
                </button>
              </div>
            </div>

            {/* 폼 예시 */}
            <div className="p-6 bg-white border rounded-lg shadow-sm">
              <h3 className="text-heading-lg mb-4">연락처 정보</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-label-sm text-gray-700 block mb-1">이름</label>
                  <input 
                    type="text" 
                    className="text-body-md w-full p-2 border rounded"
                    placeholder="이름을 입력해주세요"
                  />
                </div>
                <div>
                  <label className="text-label-sm text-gray-700 block mb-1">전화번호</label>
                  <input 
                    type="tel" 
                    className="text-body-md w-full p-2 border rounded"
                    placeholder="010-0000-0000"
                  />
                  <p className="text-caption-sm text-gray-500 mt-1">
                    상담을 위해 연락처가 필요합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>


      </div>
    </Container>
  )
} 