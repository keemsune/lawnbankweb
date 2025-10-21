// 진단테스트 답변을 코드화하는 매퍼 함수들

import { DiagnosisAnswers, CodedAnswers } from './types';

/**
 * 문자열 답변을 숫자 코드로 변환하는 매퍼 함수
 */
export function mapAnswersToCode(answers: DiagnosisAnswers): CodedAnswers {
  return {
    // Q1: 혼인여부
    maritalStatus: mapMaritalStatus(answers[1]),
    
    // Q2: 미성년 자녀
    hasMinorChildren: answers[2] === '있다',
    numberOfChildren: mapNumberOfChildren(answers['2_additional']),
    
    // Q3: 소득활동
    incomeType: mapIncomeType(answers[3]),
    monthlyIncome: mapMonthlyIncome(answers['3_additional']),
    
    // Q4: 4대 보험 (삭제됨 - 기본값: true)
    hasInsurance: true,
    
    // Q5: 재산 (UI 출력용으로만 사용, 적합성 판단에 영향 없음)
    assets: {
      savings: false,
      insurance: false, 
      deposit: false,
      vehicle: false,
      realEstate: false, // 적합성 판단에 영향 주지 않도록 false 고정
      other: false
    }, // 실제 선택값: mapAssets(answers[5] || [])
    
    // Q6: 총 채무금액
    totalDebt: mapTotalDebt(answers[6])
  };
}

/**
 * 혼인여부 매핑
 */
function mapMaritalStatus(status: string): 1 | 2 | 3 {
  switch (status) {
    case '혼인': return 1;
    case '미혼': return 2;
    case '이혼': return 3;
    default: return 2; // 기본값: 미혼
  }
}

/**
 * 자녀 수 매핑
 */
function mapNumberOfChildren(children?: string): number {
  if (!children) return 0;
  
  switch (children) {
    case '1명': return 1;
    case '2명': return 2;
    case '3명': return 3;
    case '4명': return 4;
    case '5명 이상': return 5;
    default: return 0;
  }
}

/**
 * 소득 유형 매핑
 */
function mapIncomeType(incomeType: string): 1 | 2 | 3 | 4 {
  switch (incomeType) {
    case '소득이 없다': return 1;
    case '직장인(급여소득)': return 2;
    case '자영업(사업소득)': return 3;
    case '기타소득': return 4;
    default: return 1; // 기본값: 소득 없음
  }
}

/**
 * 월 소득 매핑 (만원 단위, 구간의 중간값 사용)
 */
function mapMonthlyIncome(income?: string): number {
  if (!income) return 0;
  
  switch (income) {
    case '200만원 미만': return 100; // 0~200만원의 중간값
    case '200만~300만원': return 250; // 200~300만원의 중간값
    case '300만~400만원': return 350; // 300~400만원의 중간값
    case '400만~500만원': return 450; // 400~500만원의 중간값
    case '500만원 이상': return 550; // 500만원 이상 (추정값)
    default: return 0;
  }
}

/**
 * 재산 매핑
 */
function mapAssets(assets: string[]) {
  return {
    savings: assets.includes('예금/적금'),
    insurance: assets.includes('보험'),
    deposit: assets.includes('임차보증금'),
    vehicle: assets.includes('자동차/오토바이'),
    realEstate: assets.includes('부동산'),
    other: assets.includes('기타')
  };
}

/**
 * 총 채무 매핑 (만원 단위, 구간의 중간값 사용)
 */
function mapTotalDebt(debt: string): number {
  switch (debt) {
    case '1천만원 이하': return 500; // 0~1천만원의 중간값
    case '1천만~5천만원': return 3000; // 1천~5천만원의 중간값
    case '5천만~1억원': return 7500; // 5천만~1억원의 중간값
    case '1억~3억원': return 20000; // 1억~3억원의 중간값
    case '3억~5억원': return 40000; // 3억~5억원의 중간값
    case '5억원 이상': return 60000; // 5억원 이상 (추정값)
    default: return 0;
  }
}

/**
 * 코드화된 답변을 다시 문자열로 변환하는 역매핑 함수들
 */
export function reverseMapCode(codedAnswers: CodedAnswers): Partial<DiagnosisAnswers> {
  return {
    1: reverseMapMaritalStatus(codedAnswers.maritalStatus) as DiagnosisAnswers[1],
    2: codedAnswers.hasMinorChildren ? '있다' : '없다',
    '2_additional': reverseMapNumberOfChildren(codedAnswers.numberOfChildren) as DiagnosisAnswers['2_additional'],
    3: reverseMapIncomeType(codedAnswers.incomeType) as DiagnosisAnswers[3],
    '3_additional': reverseMapMonthlyIncome(codedAnswers.monthlyIncome) as DiagnosisAnswers['3_additional'],
    // 4: Q4 삭제됨 (4대보험)
    5: reverseMapAssets(codedAnswers.assets),
    6: reverseMapTotalDebt(codedAnswers.totalDebt) as DiagnosisAnswers[6]
  };
}

function reverseMapMaritalStatus(code: number): string {
  switch (code) {
    case 1: return '혼인';
    case 2: return '미혼';
    case 3: return '이혼';
    default: return '미혼';
  }
}

function reverseMapNumberOfChildren(count: number): string | undefined {
  if (count === 0) return undefined;
  if (count >= 5) return '5명 이상';
  return `${count}명`;
}

function reverseMapIncomeType(code: number): string {
  switch (code) {
    case 1: return '소득이 없다';
    case 2: return '직장인(급여소득)';
    case 3: return '자영업(사업소득)';
    case 4: return '기타소득';
    default: return '소득이 없다';
  }
}

function reverseMapMonthlyIncome(income: number): string | undefined {
  if (income === 0) return undefined;
  if (income < 200) return '200만원 미만';
  if (income < 300) return '200만~300만원';
  if (income < 400) return '300만~400만원';
  if (income < 500) return '400만~500만원';
  return '500만원 이상';
}

function reverseMapAssets(assets: CodedAnswers['assets']): string[] {
  const result: string[] = [];
  if (assets.savings) result.push('예금/적금');
  if (assets.insurance) result.push('보험');
  if (assets.deposit) result.push('임차보증금');
  if (assets.vehicle) result.push('자동차/오토바이');
  if (assets.realEstate) result.push('부동산');
  if (assets.other) result.push('기타');
  return result;
}

function reverseMapTotalDebt(debt: number): string {
  if (debt <= 1000) return '1천만원 이하';
  if (debt <= 5000) return '1천만~5천만원';
  if (debt <= 10000) return '5천만~1억원';
  if (debt <= 30000) return '1억~3억원';
  if (debt <= 50000) return '3억~5억원';
  return '5억원 이상';
}
