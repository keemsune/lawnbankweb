import { Button } from '@/components/ui/Button'
import DemoBox from '@/components/ui/DemoBox'
import { Container } from '@/components/layout/Container'
import Link from 'next/link'

export default function Home() {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center text-center space-y-8 py-8">
        {/* 서비스 카드들 */}
        <div className="flex flex-wrap items-center justify-around max-w-4xl gap-6">
          <div className="w-96 p-6 bg-card rounded-xl border border-border hover:shadow-lg hover:border-primary transition-all duration-200 cursor-pointer">
              <h3 className="text-2xl font-bold">계좌 조회 &rarr;</h3>
              <p className="mt-4 text-xl text-muted-foreground">
                계좌 잔액과 거래 내역을 확인하세요.
              </p>
          </div>

          <div className="w-96 p-6 bg-card rounded-xl border border-border hover:shadow-lg hover:border-secondary transition-all duration-200 cursor-pointer">
              <h3 className="text-2xl font-bold">송금 &rarr;</h3>
              <p className="mt-4 text-xl text-muted-foreground">
                다른 계좌로 안전하게 송금하세요.
              </p>
          </div>
        </div>
        
        {/* 데모 박스들 */}
        <div>
            <DemoBox title="컴포넌트 테스트">
              <div className="space-y-4">
                {/* CSS 변수를 직접 사용하는 예시 */}
                <div 
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-accent-foreground)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  <p className="font-medium">CSS 변수 직접 사용 예시</p>
                  <p className="text-sm opacity-90">var(--color-accent) 배경색 사용</p>
                </div>

                {/* 커스텀 유틸리티 클래스 사용 예시 */}
                <div className="p-4 rounded-lg bg-secondary text-secondary-foreground">
                  <p className="font-medium">커스텀 유틸리티 클래스 예시</p>
                  <p className="text-sm opacity-90">bg-secondary 클래스 사용</p>
                </div>
              </div>
            </DemoBox>
        </div>
        
        {/* 네비게이션 버튼들 */}
        <div className="flex gap-4">
          <Link href="/dev">
            <Button variant="primary">
              개발 테스트 페이지
            </Button>
          </Link>
            
          <Link href="/dev/colors">
            <Button variant="tertiary">  
              컬러 시스템 확인
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  )
} 