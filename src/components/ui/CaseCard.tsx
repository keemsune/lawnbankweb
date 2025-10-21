import { Button } from './Button';
import { ArrowRight } from 'lucide-react';

export interface CaseData {
  id: string;
  category: string;
  reductionRate: string;
  title: string;
  court: string;
  totalDebt: string;
  monthlyIncome: string;
  monthlyPayment: string;
}

interface CaseCardProps {
  caseData: CaseData;
  showButton?: boolean;
}

export function CaseCard({ caseData, showButton = true }: CaseCardProps) {
  return (
    <div className="bg-card border border-border px-7 py-8 rounded-2xl">
      {/* 세로 2단 구성 */}
      <div className="flex flex-col gap-6">
        {/* 1단: 사례내용 - 세로 3단 구성 */}
        <div className="flex-1 flex flex-col gap-4">
          {/* 첫번째: 분야구분 - 가로 2단 구성 */}
          <div className="flex items-center gap-2">
            {/* 1단: 분야 */}
            <div className="px-4 py-1 bg-primary rounded-full flex items-center justify-center">
              <span className="text-heading-xs-css text-primary-foreground">{caseData.category}</span>
            </div>
            {/* 2단: 탕감률 */}
            <span className="text-heading-xs-css text-primary">{caseData.reductionRate}</span>
          </div>
          
          {/* 두번째: 타이틀 */}
          <div className="md:h-14 flex items-start">
            <h3 className="text-heading-lg-css text-card-foreground">{caseData.title}</h3>
          </div>
          
          {/* 세번째: 컨텐츠 - 세로 4단 구성 */}
          <div className="flex flex-col gap-2">
            {/* 1단: 관할법원 */}
            <div className="flex items-center gap-2">
              <span className="text-heading-sm-css text-primary">관할법원</span>
              <span className="text-body-sm-css text-card-foreground">{caseData.court}</span>
            </div>
            
            {/* 2단: 총채무액 */}
            <div className="flex items-center gap-2">
              <span className="text-heading-sm-css text-primary">총채무액</span>
              <span className="text-body-sm-css text-card-foreground">{caseData.totalDebt}</span>
            </div>
            
            {/* 3단: 월소득액 */}
            <div className="flex items-center gap-2">
              <span className="text-heading-sm-css text-primary">월소득액</span>
              <span className="text-body-sm-css text-card-foreground">{caseData.monthlyIncome}</span>
            </div>
            
            {/* 4단: 월변제금 */}
            <div className="flex items-center gap-2">
              <span className="text-heading-sm-css text-primary">월변제금</span>
              <span className="text-body-sm-css text-card-foreground">{caseData.monthlyPayment}</span>
            </div>
          </div>
        </div>
        
        {/* 2단: 버튼 */}
        {showButton && (
        <div>
          <Button 
            colorVariant="default"
            styleVariant="outline"
            size="xs"
            fullWidth={true}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            성공사례 보러가기
          </Button>
        </div>
        )}
      </div>
    </div>
  );
} 