'use client'

import { Container } from '@/components/layout/Container'

export default function BorderDemo() {
  const borderWidthValues = [
    { name: '0', value: '0px', class: 'border-0' },
    { name: 'DEFAULT', value: '1px', class: 'border' },
    { name: '2', value: '2px', class: 'border-2' },
    { name: '4', value: '4px', class: 'border-4' },
    { name: '8', value: '8px', class: 'border-8' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="space-y-12">
          {/* 헤더 */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Border Width 시스템 데모
            </h1>
            <p className="text-lg text-gray-600">
              일관된 테두리 두께 토큰 시스템
            </p>
          </div>

          {/* Border Width 시스템 데모 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Border Width 토큰
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {borderWidthValues.map((border) => (
                <div key={border.name} className="text-center">
                  <div className="space-y-4">
                    {/* 정사각형 예시 */}
                    <div className="flex justify-center">
                      <div 
                        className={`w-20 h-20 bg-emerald-100 border-emerald-600 rounded-lg ${border.class}`}
                      />
                    </div>
                    
                    {/* 정보 */}
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-900">
                        {border.name === 'DEFAULT' ? 'default' : border.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {border.value}
                      </div>
                      <div className="text-xs font-mono text-gray-500">
                        {border.class}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 방향별 Border 데모 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              방향별 Border Width
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 전체 */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-amber-100 border-4 border-amber-600 rounded-lg" />
                </div>
                <div>
                  <div className="font-medium">전체</div>
                  <div className="text-sm text-gray-600">border-4</div>
                </div>
              </div>

              {/* 상단 */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-red-100 border-t-4 border-red-600 rounded-lg" />
                </div>
                <div>
                  <div className="font-medium">상단</div>
                  <div className="text-sm text-gray-600">border-t-4</div>
                </div>
              </div>

              {/* 우측 */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-violet-100 border-r-4 border-violet-600 rounded-lg" />
                </div>
                <div>
                  <div className="font-medium">우측</div>
                  <div className="text-sm text-gray-600">border-r-4</div>
                </div>
              </div>

              {/* 하단 */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-pink-100 border-b-4 border-pink-600 rounded-lg" />
                </div>
                <div>
                  <div className="font-medium">하단</div>
                  <div className="text-sm text-gray-600">border-b-4</div>
                </div>
              </div>

              {/* 좌측 */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-indigo-100 border-l-4 border-indigo-600 rounded-lg" />
                </div>
                <div>
                  <div className="font-medium">좌측</div>
                  <div className="text-sm text-gray-600">border-l-4</div>
                </div>
              </div>

              {/* 좌우 */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-emerald-100 border-x-4 border-emerald-600 rounded-lg" />
                </div>
                <div>
                  <div className="font-medium">좌우</div>
                  <div className="text-sm text-gray-600">border-x-4</div>
                </div>
              </div>

              {/* 상하 */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-blue-100 border-y-4 border-blue-600 rounded-lg" />
                </div>
                <div>
                  <div className="font-medium">상하</div>
                  <div className="text-sm text-gray-600">border-y-4</div>
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
                  <div className="p-6 bg-white border border-gray-200 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2">기본 카드 (border)</h4>
                    <p className="text-gray-600">1px 테두리를 사용한 기본 카드입니다.</p>
                  </div>
                  
                  <div className="p-6 bg-white border-2 border-emerald-200 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2">강조 카드 (border-2)</h4>
                    <p className="text-gray-600">2px 테두리를 사용한 강조 카드입니다.</p>
                  </div>
                  
                  <div className="p-6 bg-white border-4 border-blue-200 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2">굵은 테두리 카드 (border-4)</h4>
                    <p className="text-gray-600">4px 테두리를 사용한 굵은 테두리 카드입니다.</p>
                  </div>
                </div>
              </div>

              {/* 버튼 예시 */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-700">버튼 컴포넌트</h3>
                
                <div className="space-y-4">
                  <div className="space-y-3">
                    <button className="px-4 py-2 bg-white border border-emerald-600 text-emerald-600 rounded hover:bg-emerald-50 transition-colors">
                      Outline Button (border)
                    </button>
                    
                    <button className="px-4 py-2 bg-white border-2 border-emerald-600 text-emerald-600 rounded hover:bg-emerald-50 transition-colors">
                      Thick Outline (border-2)
                    </button>
                    
                    <button className="px-4 py-2 bg-white border-4 border-emerald-600 text-emerald-600 rounded hover:bg-emerald-50 transition-colors">
                      Extra Thick (border-4)
                    </button>
                    
                    <button className="px-4 py-2 bg-emerald-600 text-white border-0 rounded hover:bg-emerald-700 transition-colors">
                      No Border (border-0)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Border Width 가이드라인 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              사용 가이드라인
            </h2>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">권장 사용법</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li><strong>border-0 (0px)</strong>: 테두리 제거, 버튼 배경</li>
                    <li><strong>border (1px)</strong>: 카드, 입력 필드, 기본 테두리</li>
                    <li><strong>border-2 (2px)</strong>: 강조 요소, 중요한 카드</li>
                    <li><strong>border-4 (4px)</strong>: 매우 강조된 요소</li>
                    <li><strong>border-8 (8px)</strong>: 장식적 요소, 특별한 강조</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">상태별 활용</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li><strong>기본 상태</strong>: border + border-gray-300</li>
                    <li><strong>호버 상태</strong>: border-2 + 컬러 변경</li>
                    <li><strong>포커스 상태</strong>: border-2 + 브랜드 컬러</li>
                    <li><strong>에러 상태</strong>: border-2 + border-red-500</li>
                    <li><strong>성공 상태</strong>: border-2 + border-emerald-500</li>
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