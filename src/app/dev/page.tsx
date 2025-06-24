import Link from 'next/link';

export default function DevPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                <span className="text-blue-600">채무해결</span> 상담센터
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-500 hover:text-gray-900">서비스 소개</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">성공 사례</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">상담 문의</a>
            </nav>
          </div>
        </div>
      </header>

      {/* 메인 히어로 섹션 */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-blue-600">3분 테스트</span>로 찾는<br />
            나만의 채무 해결책
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            간단한 질문 몇 가지로 당신에게 맞는<br />
            <span className="font-semibold text-blue-600">개인회생·파산 해결방안</span>을 찾아보세요
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/dev/diagnosis" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              무료 자가진단 시작하기
            </Link>
            
            <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white border-2 border-blue-600 hover:bg-blue-50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              전화 상담 신청
            </button>
          </div>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">성공률</div>
              <div className="text-sm text-gray-500 mt-2">1,000건 이상의 성공 사례</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">24시간</div>
              <div className="text-gray-600">신속 상담</div>
              <div className="text-sm text-gray-500 mt-2">언제든지 상담 가능</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">10년</div>
              <div className="text-gray-600">전문 경력</div>
              <div className="text-sm text-gray-500 mt-2">풍부한 실무 경험</div>
            </div>
          </div>
        </div>
      </section>

      {/* 서비스 프로세스 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              간단한 3단계로 해결하세요
            </h2>
            <p className="text-lg text-gray-600">
              복잡한 절차 없이 빠르고 정확한 해결책을 제시합니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">자가진단 테스트</h3>
              <p className="text-gray-600">
                간단한 질문으로 현재 상황을 정확히 파악합니다
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">맞춤 솔루션 제시</h3>
              <p className="text-gray-600">
                비슷한 사례를 바탕으로 최적의 해결책을 제안합니다
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">전문가 상담</h3>
              <p className="text-gray-600">
                전문 상담사가 실시간으로 상세한 상담을 진행합니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            무료 진단으로 당신만의 해결책을 찾아보세요
          </p>
          <Link 
            href="/dev/diagnosis" 
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white hover:bg-gray-100 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            3분 자가진단 시작하기
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">채무해결 상담센터</h3>
              <p className="text-gray-400">
                개인회생, 파산 전문 상담으로<br />
                새로운 시작을 도와드립니다.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">빠른 링크</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">서비스 소개</a></li>
                <li><a href="#" className="hover:text-white">성공 사례</a></li>
                <li><a href="#" className="hover:text-white">자주 묻는 질문</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">연락처</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📞 1588-0000</li>
                <li>📧 info@debthelp.co.kr</li>
                <li>🕒 24시간 상담 가능</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 채무해결 상담센터. All rights reserved.</p>
            <div className="mt-4 space-x-4">
              <Link href="/" className="text-blue-400 hover:text-blue-300">
                ← 개발자 홈으로
              </Link>
              <Link href="/dev/colors" className="text-emerald-400 hover:text-emerald-300">
                컬러 시스템
              </Link>
              <Link href="/dev/typography" className="text-amber-400 hover:text-amber-300">
                타이포그래피
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 