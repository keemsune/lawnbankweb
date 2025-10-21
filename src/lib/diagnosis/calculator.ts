// 진단 결과 계산 로직

import { CodedAnswers, DiagnosisResult } from './types';

/**
 * 진단 결과를 계산하는 메인 함수
 */
export function calculateDiagnosisResult(codedAnswers: CodedAnswers): DiagnosisResult {
  // 1. 회생파산 제도 적합성 판단
  const eligibility = calculateEligibility(codedAnswers);
  
  // 2. 월 변제금 계산
  const monthlyPayment = calculateMonthlyPayment(codedAnswers);
  
  // 3. 탕감률 및 채무 정보 계산
  const reductionRate = calculateReductionRate(codedAnswers);
  
  return {
    eligibility,
    monthlyPayment,
    reductionRate
  };
}

/**
 * 회생파산 제도 적합성 판단
 */
function calculateEligibility(answers: CodedAnswers): DiagnosisResult['eligibility'] {
  const { totalDebt, monthlyIncome, assets } = answers;
  
  // 개인회생 적합성 판단 기준
  const personalRecoveryEligible = 
    totalDebt >= 1000 && // 최소 1천만원 이상 채무
    totalDebt <= 150000 && // 15억원 이하 (무담보채무 10억 + 담보채무 5억)
    monthlyIncome > 0; // 소득이 있어야 함 (4대보험 조건 제거)
  
  // 파산면책 적합성 판단 기준 (재산 조건 제거)
  const bankruptcyEligible = 
    totalDebt >= 500 && // 최소 500만원 이상 채무
    (monthlyIncome === 0 || monthlyIncome < 150); // 소득이 없거나 매우 적음 (재산 조건 제거)
  
  // 추천 제도 결정
  let recommendation: DiagnosisResult['eligibility']['recommendation'];
  
  if (personalRecoveryEligible && bankruptcyEligible) {
    // 둘 다 가능한 경우, 소득과 채무 규모를 고려하여 결정
    recommendation = monthlyIncome > 100 ? 'recovery' : 'bankruptcy';
  } else if (personalRecoveryEligible) {
    recommendation = 'recovery';
  } else if (bankruptcyEligible) {
    recommendation = 'bankruptcy';
  } else {
    recommendation = 'none';
  }
  
  return {
    personalRecovery: personalRecoveryEligible,
    bankruptcy: bankruptcyEligible,
    recommendation
  };
}

/**
 * 월 변제금 계산
 */
function calculateMonthlyPayment(answers: CodedAnswers): DiagnosisResult['monthlyPayment'] {
  const { totalDebt, monthlyIncome, numberOfChildren, maritalStatus } = answers;
  
  // 가족 구성원 수에 따른 기본 생계비 (2025년 기준중위소득 60%)
  const familySize = calculateFamilySize(maritalStatus, numberOfChildren);
  const basicLivingCost = BASIC_LIVING_COST_TABLE[familySize];
  
  // 변제 가능 금액 = 월소득 - 기본생계비
  const availableAmount = Math.max(0, (monthlyIncome * 10000) - basicLivingCost);
  
  // 실제 변제금은 가용금액의 80% (여유분 고려)
  const actualPayment = Math.floor(availableAmount * 0.8);
  
  // 36개월 변제 시 월 변제금
  const period36 = Math.min(actualPayment, Math.floor(totalDebt * 10000 * 0.2 / 36));
  
  // 60개월 변제 시 월 변제금
  const period60 = Math.min(actualPayment, Math.floor(totalDebt * 10000 * 0.2 / 60));
  
  return {
    period36: Math.max(0, period36),
    period60: Math.max(0, period60)
  };
}

/**
 * 2025년도 기준중위소득표 60% (최저생계비) - 공통 상수
 */
const BASIC_LIVING_COST_TABLE = {
  1: 1435208,  // 1인가구 (2,392,013 * 0.6)
  2: 2359595,  // 2인가구 (3,932,658 * 0.6)
  3: 3015212,  // 3인가구 (5,025,353 * 0.6)
  4: 3658664,  // 4인가구 (6,097,773 * 0.6)
  5: 4264915,  // 5인가구 (7,108,192 * 0.6)
  6: 4264915   // 6인가구 (5인가구와 동일 적용)
};

/**
 * 가족 구성원 수 계산 헬퍼 함수
 * Q2 미성년 자녀 여부에 따라: 있다(+1) = 2인가구, 없다 = 1인가구
 */
function calculateFamilySize(maritalStatus: number, numberOfChildren: number): keyof typeof BASIC_LIVING_COST_TABLE {
  let familySize = 1; // 본인 (기본)
  
  // 미성년 자녀가 있으면 +1 (2인가구)
  if (numberOfChildren > 0) {
    familySize = 2;
  }
  // 자녀가 없으면 1인가구 유지 (혼인 상태 무관)
  
  // 6인 이상은 6인가구 기준 적용 (실제로는 최대 2인가구)
  return Math.min(familySize, 6) as keyof typeof BASIC_LIVING_COST_TABLE;
}


/**
 * 탕감률 및 채무 정보 계산
 */
function calculateReductionRate(answers: CodedAnswers): DiagnosisResult['reductionRate'] {
  const { totalDebt, monthlyIncome, assets, numberOfChildren, maritalStatus } = answers;
  
  const currentDebt = totalDebt * 10000; // 만원을 원 단위로 변환
  
  // 기본 탕감률 계산 (개인회생 기준)
  let baseReductionRate = 0.8; // 기본 80% 탕감
  
  // 소득 수준에 따른 조정
  if (monthlyIncome === 0) {
    baseReductionRate = 1.0; // 무소득자는 100% 탕감 (파산면책)
  } else if (monthlyIncome < 150) {
    baseReductionRate = 0.85; // 저소득자는 85% 탕감
  } else if (monthlyIncome > 250) {
    baseReductionRate = 0.7; // 고소득자는 70% 탕감
  }
  
  // 재산 보유에 따른 조정 (비활성화 - UI 출력용으로만 사용)
  // if (assets.realEstate) {
  //   baseReductionRate -= 0.2; // 부동산 보유 시 탕감률 감소
  // }
  // if (assets.vehicle) {
  //   baseReductionRate -= 0.05; // 차량 보유 시 탕감률 감소
  // }
  // if (assets.savings) {
  //   baseReductionRate -= 0.05; // 예금 보유 시 탕감률 감소
  // }
  
  // 가족 부양 의무에 따른 조정 (Q2 미성년 자녀 여부 기준)
  if (numberOfChildren > 0) {
    baseReductionRate += 0.05; // 미성년 자녀 있을 시 탕감률 5% 추가 (2인가구)
  }
  // 혼인 상태는 가구원수 계산에 영향 없음 (Q2 자녀 여부만 고려)
  
  // 최종 탕감률 범위 제한 (20% ~ 100%)
  const finalReductionRate = Math.max(0.2, Math.min(1.0, baseReductionRate));
  
  const reductionAmount = Math.floor(currentDebt * finalReductionRate);
  const reducedDebt = currentDebt - reductionAmount;
  const percentage = Math.round((reductionAmount / currentDebt) * 100);
  
  // 다른 사람들과의 비교 (통계 데이터 기반)
  let comparison: 'high' | 'average' | 'low';
  if (percentage >= 85) {
    comparison = 'high';
  } else if (percentage >= 70) {
    comparison = 'average';
  } else {
    comparison = 'low';
  }
  
  // 탕감률 분포 데이터 (가상의 통계 데이터)
  const distributionData = {
    ranges: [
      { min: 0, max: 50, percentage: 15 },   // 0-50%: 15%의 사람들
      { min: 50, max: 70, percentage: 25 },  // 50-70%: 25%의 사람들
      { min: 70, max: 85, percentage: 35 },  // 70-85%: 35%의 사람들
      { min: 85, max: 95, percentage: 20 },  // 85-95%: 20%의 사람들
      { min: 95, max: 100, percentage: 5 }   // 95-100%: 5%의 사람들
    ],
    userPosition: percentage
  };
  
  return {
    currentDebt,
    reducedDebt,
    reductionAmount,
    percentage,
    comparison,
    distributionData
  };
}

/**
 * 결과 요약 텍스트 생성
 */
export function generateResultSummary(result: DiagnosisResult): {
  eligibilityText: string;
  paymentText: string;
  reductionText: string;
  comparisonText: string;
} {
  const { eligibility, monthlyPayment, reductionRate } = result;
  
  // 1. 적합성 텍스트
  let eligibilityText = '';
  if (eligibility.recommendation === 'recovery') {
    eligibilityText = '개인회생 제도가 적합합니다';
  } else if (eligibility.recommendation === 'bankruptcy') {
    eligibilityText = '파산면책 제도가 적합합니다';
  } else if (eligibility.recommendation === 'both') {
    eligibilityText = '개인회생 또는 파산면책 모두 가능합니다';
  } else {
    eligibilityText = '현재 상황으로는 회생파산 제도 진행이 어려울 수 있습니다';
  }
  
  // 2. 변제금 텍스트
  const paymentText = `36개월 변제 시: 월 ${monthlyPayment.period36.toLocaleString()}원\n60개월 변제 시: 월 ${monthlyPayment.period60.toLocaleString()}원`;
  
  // 3. 탕감 결과 텍스트
  const reductionText = `현재 채무 ${reductionRate.currentDebt.toLocaleString()}원 → 탕감 후 채무 ${reductionRate.reducedDebt.toLocaleString()}원`;
  
  // 4. 비교 텍스트
  let comparisonText = `내 탕감률은 ${reductionRate.percentage}%입니다.\n`;
  if (reductionRate.comparison === 'high') {
    comparisonText += '다른 사람들에 비해 탕감률이 높은 편이에요.';
  } else if (reductionRate.comparison === 'average') {
    comparisonText += '다른 사람들에 비해 탕감률이 비슷한 편이에요.';
  } else {
    comparisonText += '다른 사람들에 비해 탕감률이 낮은 편이에요.';
  }
  
  return {
    eligibilityText,
    paymentText,
    reductionText,
    comparisonText
  };
}
