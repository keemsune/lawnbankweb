'use client'

import { Container } from '@/components/layout/Container'

export default function RadiusDemo() {
  const radiusValues = [
    { name: 'none', value: '0px', class: 'rounded-none' },
    { name: 'sm', value: '2px', class: 'rounded-sm' },
    { name: 'DEFAULT', value: '4px', class: 'rounded' },
    { name: 'md', value: '6px', class: 'rounded-md' },
    { name: 'lg', value: '8px', class: 'rounded-lg' },
    { name: 'xl', value: '12px', class: 'rounded-xl' },
    { name: '2xl', value: '16px', class: 'rounded-2xl' },
    { name: '3xl', value: '24px', class: 'rounded-3xl' },
    { name: '4xl', value: '32px', class: 'rounded-4xl' },
    { name: 'full', value: '9999px', class: 'rounded-full' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="space-y-12">
          {/* 헤더 */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Border Radius 시스템 데모
            </h1>
            <p className="text-lg text-gray-600">
              일관된 모서리 둥글기 토큰 시스템
            </p>
          </div>

          {/* Border Radius 시스템 데모 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Border Radius 토큰
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {radiusValues.map((radius) => (
                <div key={radius.name} className="text-center">
                  <div className="space-y-4">
                    {/* 정사각형 예시 */}
                    <div className="flex justify-center">
                      <div 
                        className={`w-20 h-20 bg-emerald-200 border-2 border-emerald-400 ${radius.class}`}
                      />
                    </div>
                    
                    {/* 직사각형 예시 */}
                    <div className="flex justify-center">
                      <div 
                        className={`w-24 h-12 bg-blue-200 border-2 border-blue-400 ${radius.class}`}
                      />
                    </div>
                    
                    {/* 정보 */}
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-900">
                        {radius.name === 'DEFAULT' ? 'default' : radius.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {radius.value}
                      </div>
                      <div className="text-xs font-mono text-gray-500">
                        {radius.class}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 방향별 Radius 데모 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              방향별 Border Radius
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 전체 */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-amber-200 border-2 border-amber-400 rounded-lg" />
                </div>
                <div>
                  <div className="font-medium">전체</div>
                  <div className="text-sm text-gray-600">rounded-lg</div>
                </div>
              </div>

              {/* 상단 */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-red-200 border-2 border-red-400 rounded-t-lg" />
                </div>
                <div>
                  <div className="font-medium">상단</div>
                  <div className="text-sm text-gray-600">rounded-t-lg</div>
                </div>
              </div>

              {/* 우측 */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-violet-200 border-2 border-violet-400 rounded-r-lg" />
                </div>
                <div>
                  <div className="font-medium">우측</div>
                  <div className="text-sm text-gray-600">rounded-r-lg</div>
                </div>
              </div>

              {/* 하단 */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-pink-200 border-2 border-pink-400 rounded-b-lg" />
                </div>
                <div>
                  <div className="font-medium">하단</div>
                  <div className="text-sm text-gray-600">rounded-b-lg</div>
                </div>
              </div>

              {/* 좌측 */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-indigo-200 border-2 border-indigo-400 rounded-l-lg" />
                </div>
                <div>
                  <div className="font-medium">좌측</div>
                  <div className="text-sm text-gray-600">rounded-l-lg</div>
                </div>
              </div>

              {/* 좌상단 */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-emerald-200 border-2 border-emerald-400 rounded-tl-lg" />
                </div>
                <div>
                  <div className="font-medium">좌상단</div>
                  <div className="text-sm text-gray-600">rounded-tl-lg</div>
                </div>
              </div>

              {/* 우상단 */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-blue-200 border-2 border-blue-400 rounded-tr-lg" />
                </div>
                <div>
                  <div className="font-medium">우상단</div>
                  <div className="text-sm text-gray-600">rounded-tr-lg</div>
                </div>
              </div>

              {/* 우하단 */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-amber-200 border-2 border-amber-400 rounded-br-lg" />
                </div>
                <div>
                  <div className="font-medium">우하단</div>
                  <div className="text-sm text-gray-600">rounded-br-lg</div>
                </div>
              </div>
            </div>
          </section>

          {/* 실제 사용 예시 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              실제 사용 예시
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 카드 예시 */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-700">카드 컴포넌트</h3>
                
                <div className="space-y-4">
                  <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold mb-2">기본 카드 (rounded-lg)</h4>
                    <p className="text-gray-600">8px 모서리 둥글기를 사용한 기본 카드입니다.</p>
                  </div>
                  
                  <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <h4 className="text-lg font-semibold mb-2">둥근 카드 (rounded-xl)</h4>
                    <p className="text-gray-600">12px 모서리 둥글기를 사용한 더 둥근 카드입니다.</p>
                  </div>
                  
                  <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <h4 className="text-lg font-semibold mb-2">매우 둥근 카드 (rounded-2xl)</h4>
                    <p className="text-gray-600">16px 모서리 둥글기를 사용한 매우 둥근 카드입니다.</p>
                  </div>
                </div>
              </div>

              {/* 버튼 예시 */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-700">버튼 컴포넌트</h3>
                
                <div className="space-y-4">
                  <div className="space-y-3">
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-sm hover:bg-emerald-700 transition-colors">
                      Sharp Button (rounded-sm)
                    </button>
                    
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors">
                      Default Button (rounded)
                    </button>
                    
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
                      Medium Button (rounded-md)
                    </button>
                    
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                      Large Button (rounded-lg)
                    </button>
                    
                    <button className="px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors">
                      Pill Button (rounded-full)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Radius 가이드라인 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              사용 가이드라인
            </h2>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">권장 사용법</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li><strong>rounded-sm (2px)</strong>: 테이블 셀, 작은 태그</li>
                    <li><strong>rounded (4px)</strong>: 입력 필드, 작은 버튼</li>
                    <li><strong>rounded-md (6px)</strong>: 중간 버튼, 알림</li>
                    <li><strong>rounded-lg (8px)</strong>: 카드, 큰 버튼</li>
                    <li><strong>rounded-xl (12px)</strong>: 모달, 대화상자</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">특수 용도</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li><strong>rounded-2xl (16px)</strong>: 히어로 섹션, 큰 카드</li>
                    <li><strong>rounded-3xl (24px)</strong>: 장식적 요소</li>
                    <li><strong>rounded-4xl (32px)</strong>: 매우 큰 장식 요소</li>
                    <li><strong>rounded-full</strong>: 아바타, 원형 버튼</li>
                    <li><strong>rounded-none</strong>: 직각 모서리가 필요한 경우</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  )
} 