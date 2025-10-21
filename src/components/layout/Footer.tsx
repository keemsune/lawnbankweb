import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="w-full mx-auto max-w-content px-container-xs sm:px-container-sm md:px-container-md lg:px-container-lg">
        <div className="py-12 sm:py-16">
          {/* 상단 1단 - 법무법인 로앤 */}
          <div className="mb-6">
            <h3 className="text-heading-md text-white">
              법무법인 로앤
            </h3>
          </div>

          {/* 하단 2단 - 가로 4단 구조 */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* 법무법인 정보 - 고정 너비 384px */}
            <div className="w-full md:w-96 space-y-4">
              <div className="space-y-2 text-body-sm text-white">
                <p className="break-words">대표변호사: 김충환</p>
                <p className="break-words">법인등록번호: 110146-0091058</p>
                <p className="break-words">영업시간: 평일 08:00 ~ 19:00 (주말 및 공휴일 휴무)</p>
                <p className="break-words">대표전화: 1800-5495</p>
              </div>
            </div>

            {/* 나머지 3개 분사무소 */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* 서울 주사무소 */}
              <div className="space-y-3">
                <h4 className="text-label-sm text-white">서울 주사무소</h4>
                <div className="space-y-2 text-body-sm text-white">
                  <p className="break-words">서울특별시 강남구 논현로87길 25, HB타워 3,4층</p>
                </div>
              </div>

              {/* 대전 분사무소 */}
              <div className="space-y-3">
                <h4 className="text-label-sm text-white">대전 분사무소</h4>
                <div className="space-y-2 text-body-sm text-white">
                  <p className="break-words">대전광역시 서구 둔산중로78번길 26, 민석타워 14층</p>
                </div>
              </div>

              {/* 부산 분사무소 */}
              <div className="space-y-3">
                <h4 className="text-label-sm text-white">부산 분사무소</h4>
                <div className="space-y-2 text-body-sm text-white">
                  <p className="break-words">부산광역시 연제구 법원로 38 로펌빌딩 401호</p>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 저작권 및 링크 */}
          <div className="mt-8 sm:mt-12 pt-6 border-t border-gray-600">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <p className="text-caption-md text-muted-foreground">
                Copyright © 2025 Lawandfirm all Rights Reserved.
              </p>
              <Link 
                href="/privacy" 
                className="text-label-xs text-muted-foreground hover:text-white hover:underline transition-colors"
              >
                개인정보처리방침
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 