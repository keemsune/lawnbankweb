'use client'

import { Container, Grid, GridItem } from '@/components/layout/Container'

export default function GridDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="space-y-12">
          {/* 헤더 */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              그리드 시스템 & 스페이싱 데모
            </h1>
            <p className="text-lg text-gray-600">
              반응형 12단 그리드 시스템과 스페이싱 토큰 시스템
            </p>
          </div>

          {/* 그리드 시스템 데모 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              반응형 그리드 시스템
            </h2>
            
            <div className="space-y-8">
              {/* 기본 그리드 */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  기본 그리드 (모바일: 4컬럼, 태블릿: 8컬럼, 데스크탑: 12컬럼)
                </h3>
                <Grid>
                  {Array.from({ length: 12 }, (_, i) => (
                    <GridItem key={i}>
                      <div className="h-12 bg-emerald-100 border border-emerald-200 rounded flex items-center justify-center font-medium">
                        {i + 1}
                      </div>
                    </GridItem>
                  ))}
                </Grid>
              </div>

              {/* 컬럼 스팬 데모 */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  컬럼 스팬 예시
                </h3>
                <Grid>
                  <GridItem span={{ xs: 4, sm: 8, md: 12 }}>
                    <div className="h-12 bg-amber-100 border border-amber-200 rounded flex items-center justify-center font-medium text-sm">
                      풀 너비 (xs: 4/4, sm: 8/8, md: 12/12)
                    </div>
                  </GridItem>
                  <GridItem span={{ xs: 2, sm: 4, md: 6 }}>
                    <div className="h-12 bg-blue-100 border border-blue-200 rounded flex items-center justify-center font-medium text-sm">
                      절반 너비 (xs: 2/4, sm: 4/8, md: 6/12)
                    </div>
                  </GridItem>
                  <GridItem span={{ xs: 2, sm: 4, md: 6 }}>
                    <div className="h-12 bg-blue-100 border border-blue-200 rounded flex items-center justify-center font-medium text-sm">
                      절반 너비 (xs: 2/4, sm: 4/8, md: 6/12)
                    </div>
                  </GridItem>
                  <GridItem span={{ xs: 1, sm: 2, md: 3 }}>
                    <div className="h-12 bg-emerald-100 border border-emerald-200 rounded flex items-center justify-center font-medium text-sm">
                      1/4 (xs: 1/4, sm: 2/8, md: 3/12)
                    </div>
                  </GridItem>
                  <GridItem span={{ xs: 1, sm: 2, md: 3 }}>
                    <div className="h-12 bg-emerald-100 border border-emerald-200 rounded flex items-center justify-center font-medium text-sm">
                      1/4
                    </div>
                  </GridItem>
                  <GridItem span={{ xs: 1, sm: 2, md: 3 }}>
                    <div className="h-12 bg-emerald-100 border border-emerald-200 rounded flex items-center justify-center font-medium text-sm">
                      1/4
                    </div>
                  </GridItem>
                  <GridItem span={{ xs: 1, sm: 2, md: 3 }}>
                    <div className="h-12 bg-emerald-100 border border-emerald-200 rounded flex items-center justify-center font-medium text-sm">
                      1/4
                    </div>
                  </GridItem>
                </Grid>
              </div>
            </div>
          </section>

          {/* 스페이싱 시스템 데모 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              스페이싱 토큰 시스템
            </h2>
            
            <div className="space-y-8">
              {/* 기본 스페이싱 */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  기본 스페이싱 스케일
                </h3>
                <div className="space-y-4">
                  {[
                    { name: '0', value: '0px', class: 'p-0' },
                    { name: 'px', value: '1px', class: 'p-px' },
                    { name: '0.5', value: '2px', class: 'p-0.5' },
                    { name: '1', value: '4px', class: 'p-1' },
                    { name: '2', value: '8px', class: 'p-2' },
                    { name: '3', value: '12px', class: 'p-3' },
                    { name: '4', value: '16px', class: 'p-4' },
                    { name: '6', value: '24px', class: 'p-6' },
                    { name: '8', value: '32px', class: 'p-8' },
                    { name: '12', value: '48px', class: 'p-12' },
                    { name: '16', value: '64px', class: 'p-16' },
                    { name: '20', value: '80px', class: 'p-20' },
                    { name: '24', value: '96px', class: 'p-24' },
                  ].map((spacing) => (
                    <div key={spacing.name} className="flex items-center gap-4">
                      <div className="w-20 text-sm font-mono text-gray-600">
                        {spacing.name} ({spacing.value})
                      </div>
                      <div className="bg-gray-200 rounded">
                        <div className={`bg-blue-200 rounded ${spacing.class}`}>
                          <div className="bg-blue-400 w-8 h-8 rounded"></div>
                        </div>
                      </div>
                      <div className="text-sm font-mono text-gray-500">
                        {spacing.class}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 마진 예시 */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  마진 예시
                </h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="space-y-4">
                    <div className="bg-red-200 mx-4">mx-4 (좌우 마진)</div>
                    <div className="bg-green-200 my-6">my-6 (상하 마진)</div>
                    <div className="bg-blue-200 m-8">m-8 (전체 마진)</div>
                  </div>
                </div>
              </div>

              {/* 패딩 예시 */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  패딩 예시
                </h3>
                <div className="space-y-4">
                  <div className="bg-red-100 px-4 border border-red-200">px-4 (좌우 패딩)</div>
                  <div className="bg-green-100 py-6 border border-green-200">py-6 (상하 패딩)</div>
                  <div className="bg-blue-100 p-8 border border-blue-200">p-8 (전체 패딩)</div>
                </div>
              </div>
            </div>
          </section>

          {/* 컨테이너 시스템 데모 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              컨테이너 시스템
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  컨테이너 패딩 (반응형)
                </h3>
                <div className="bg-gray-100 rounded-lg">
                  <Container className="bg-white border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="h-16 bg-emerald-50 border border-emerald-200 rounded flex items-center justify-center">
                      <div className="text-center">
                        <div className="font-medium">반응형 컨테이너</div>
                        <div className="text-sm text-gray-600">
                          xs: 16px, sm: 16px, md: 32px, lg: 40px 패딩
                        </div>
                      </div>
                    </div>
                  </Container>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  최대 너비 1280px
                </h3>
                <div className="bg-gray-100 rounded-lg">
                  <Container size="content" className="bg-white border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="h-16 bg-amber-50 border border-amber-200 rounded flex items-center justify-center">
                      <div className="text-center">
                        <div className="font-medium">컨텐츠 컨테이너</div>
                        <div className="text-sm text-gray-600">
                          최대 너비 1280px, 중앙 정렬
                        </div>
                      </div>
                    </div>
                  </Container>
                </div>
              </div>
            </div>
          </section>

          {/* 브레이크포인트 정보 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              브레이크포인트 정보
            </h2>
            <div className="bg-gray-100 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'xs', size: '375px', cols: '4컬럼', gutter: '16px', margin: '16px' },
                  { name: 'sm', size: '768px', cols: '8컬럼', gutter: '24px', margin: '16px' },
                  { name: 'md', size: '1024px', cols: '12컬럼', gutter: '24px', margin: '32px' },
                  { name: 'lg', size: '1280px', cols: '12컬럼', gutter: '24px', margin: '40px' },
                  { name: 'xl', size: '1920px', cols: '12컬럼 (1280px 컨텐츠)', gutter: '24px', margin: '풀배경' },
                ].map((bp) => (
                  <div key={bp.name} className="bg-white p-4 rounded-lg border">
                    <div className="font-semibold text-lg mb-2">{bp.name}</div>
                    <div className="text-sm space-y-1">
                      <div>크기: {bp.size}</div>
                      <div>컬럼: {bp.cols}</div>
                      <div>거터: {bp.gutter}</div>
                      <div>마진: {bp.margin}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  )
} 