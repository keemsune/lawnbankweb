// 진단테스트 관련 타입 정의

// 테스트 답변 데이터 구조
export interface DiagnosisAnswers {
  // Q1: 혼인여부
  1: '혼인' | '미혼' | '이혼';
  
  // Q2: 미성년 자녀
  2: '있다' | '없다';
  '2_additional'?: '1명' | '2명' | '3명' | '4명' | '5명 이상';
  
  // Q3: 소득활동
  3: '소득이 없다' | '직장인(급여소득)' | '자영업(사업소득)' | '기타소득';
  '3_additional'?: '100만원 미만' | '100만~200만원' | '200만~300만원' | '300만 이상';
  
  // Q4: 삭제됨 (4대 보험)
  
  // Q5: 재산 (다중선택)
  5: string[]; // ['예금/적금', '보험', '임차보증금', '자동차/오토바이', '부동산', '기타']
  
  // Q6: 총 채무금액
  6: '1천만원 이하' | '1천만~5천만원' | '5천만~1억원' | '1억~3억원' | '3억~5억원' | '5억원 이상';
}

// 연락처 정보
export interface ContactInfo {
  name: string;
  phone: string;
  email?: string;
  consultationType?: 'phone' | 'visit';
  residence?: string;
  submittedAt?: string;
}

// 진단 결과 데이터 구조
export interface DiagnosisResult {
  // 1. 회생파산 제도 진행 가능 여부
  eligibility: {
    personalRecovery: boolean; // 개인회생 적합 여부
    bankruptcy: boolean; // 파산면책 적합 여부
    recommendation: 'recovery' | 'bankruptcy' | 'both' | 'none'; // 추천 제도
  };
  
  // 2. 월 변제금 예측
  monthlyPayment: {
    period36: number; // 36개월 변제 시 월 변제금
    period60: number; // 60개월 변제 시 월 변제금
  };
  
  // 3. 탕감률 및 채무 정보
  reductionRate: {
    currentDebt: number; // 현재 채무
    reducedDebt: number; // 탕감 후 채무
    reductionAmount: number; // 탕감 금액
    percentage: number; // 탕감률 (0-100)
    comparison: 'high' | 'average' | 'low'; // 다른 사람들 대비 수준
    distributionData: {
      ranges: Array<{
        min: number;
        max: number;
        percentage: number; // 해당 구간에 속하는 사람들의 비율
      }>;
      userPosition: number; // 사용자의 탕감률 위치
    };
  };
}

// 코드화된 답변 구조 (계산용)
export interface CodedAnswers {
  maritalStatus: 1 | 2 | 3; // 1: 혼인, 2: 미혼, 3: 이혼
  hasMinorChildren: boolean;
  numberOfChildren: number; // 0~5 (5명 이상은 5로 처리)
  incomeType: 1 | 2 | 3 | 4; // 1: 없음, 2: 급여, 3: 사업, 4: 기타
  monthlyIncome: number; // 만원 단위 (중간값 사용)
  hasInsurance: boolean;
  assets: {
    savings: boolean;
    insurance: boolean;
    deposit: boolean;
    vehicle: boolean;
    realEstate: boolean;
    other: boolean;
  };
  totalDebt: number; // 만원 단위 (중간값 사용)
}
