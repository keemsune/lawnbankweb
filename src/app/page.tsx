import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import DemoBox from '@/components/ui/DemoBox'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-background">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        {/* 헤더 컴포넌트 */}
        <Header />
        
        {/* 서비스 카드들 */}
        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <Card 
            href="#" 
            hover={true} 
            hoverColor="primary"
            className="mt-6 w-96"
          >
            <h3 className="text-2xl font-bold">계좌 조회 &rarr;</h3>
            <p className="mt-4 text-xl text-muted-foreground">
              계좌 잔액과 거래 내역을 확인하세요.
            </p>
          </Card>

          <Card 
            href="#" 
            hover={true} 
            hoverColor="secondary"
            className="mt-6 w-96"
          >
            <h3 className="text-2xl font-bold">송금 &rarr;</h3>
            <p className="mt-4 text-xl text-muted-foreground">
              다른 계좌로 안전하게 송금하세요.
            </p>
          </Card>
        </div>
        
        {/* 데모 박스들 */}
        <div className="mt-8">
          <DemoBox />
        </div>
        
        {/* 네비게이션 버튼들 */}
        <div className="mt-10 space-x-4">
          <Button href="/dev" variant="primary">
            개발 테스트 페이지
          </Button>
          
          <Button href="/dev/colors" variant="tertiary">
            컬러 시스템 확인
          </Button>
        </div>
      </main>

      {/* 푸터 컴포넌트 */}
      <Footer />
    </div>
  )
} 