// 진단 로직 테스트 예제

import { 
  DiagnosisService, 
  createSampleDiagnosisData, 
  formatDiagnosisDataForTable,
  type DiagnosisAnswers,
  type ContactInfo 
} from './index';

/**
 * 다양한 케이스별 테스트 데이터
 */
export const testCases = {
  // 케이스 1: 개인회생 적합 (기혼, 자녀 있음, 안정적 소득)
  case1: {
    answers: {
      1: '혼인',
      2: '있다',
      '2_additional': '2명',
      3: '직장인(급여소득)',
      '3_additional': '200만~300만원',
      4: '네',
      5: ['예금/적금', '자동차/오토바이'],
      6: '5천만~1억원'
    } as DiagnosisAnswers,
    contactInfo: {
      name: '김회생',
      phone: '010-1111-1111',
      email: 'recovery@example.com'
    } as ContactInfo,
    description: '개인회생 적합 케이스 (기혼, 자녀 2명, 안정적 소득)'
  },
  
  // 케이스 2: 파산면책 적합 (무소득, 미혼)
  case2: {
    answers: {
      1: '미혼',
      2: '없다',
      3: '소득이 없다',
      4: '아니요',
      5: ['예금/적금'],
      6: '1천만~5천만원'
    } as DiagnosisAnswers,
    contactInfo: {
      name: '이파산',
      phone: '010-2222-2222',
      email: 'bankruptcy@example.com'
    } as ContactInfo,
    description: '파산면책 적합 케이스 (무소득, 미혼, 낮은 채무)'
  },
  
  // 케이스 3: 고소득, 고채무 (탕감률 낮음)
  case3: {
    answers: {
      1: '혼인',
      2: '있다',
      '2_additional': '1명',
      3: '자영업(사업소득)',
      '3_additional': '300만 이상',
      4: '네',
      5: ['예금/적금', '부동산', '자동차/오토바이'],
      6: '3억~5억원'
    } as DiagnosisAnswers,
    contactInfo: {
      name: '박고소득',
      phone: '010-3333-3333',
      email: 'highincome@example.com'
    } as ContactInfo,
    description: '고소득, 고채무 케이스 (탕감률 낮음)'
  },
  
  // 케이스 4: 저소득, 다자녀 (탕감률 높음)
  case4: {
    answers: {
      1: '이혼',
      2: '있다',
      '2_additional': '3명',
      3: '직장인(급여소득)',
      '3_additional': '100만원 미만',
      4: '아니요',
      5: [],
      6: '1천만~5천만원'
    } as DiagnosisAnswers,
    contactInfo: {
      name: '최저소득',
      phone: '010-4444-4444',
      email: 'lowincome@example.com'
    } as ContactInfo,
    description: '저소득, 다자녀 케이스 (탕감률 높음)'
  }
};

/**
 * 모든 테스트 케이스 실행
 */
export async function runAllTestCases() {
  console.log('=== 진단 로직 테스트 시작 ===\n');
  
  for (const [caseId, testCase] of Object.entries(testCases)) {
    console.log(`--- ${caseId.toUpperCase()}: ${testCase.description} ---`);
    
    try {
      const result = await DiagnosisService.processDiagnosis(
        testCase.answers,
        testCase.contactInfo
      );
      
      const formatted = formatDiagnosisDataForTable(result);
      
      console.log('기본 정보:', formatted.basicInfo);
      console.log('테스트 답변:', formatted.testAnswers);
      console.log('진단 결과:', formatted.diagnosisResult);
      console.log('요약:', result.summary);
      console.log('');
      
    } catch (error) {
      console.error(`${caseId} 테스트 실패:`, error);
    }
  }
  
  console.log('=== 진단 로직 테스트 완료 ===');
}

/**
 * 특정 케이스만 테스트
 */
export async function runSingleTestCase(caseId: keyof typeof testCases) {
  const testCase = testCases[caseId];
  if (!testCase) {
    throw new Error(`테스트 케이스 '${caseId}'를 찾을 수 없습니다.`);
  }
  
  console.log(`=== ${caseId.toUpperCase()}: ${testCase.description} ===`);
  
  const result = await DiagnosisService.processDiagnosis(
    testCase.answers,
    testCase.contactInfo
  );
  
  return result;
}

/**
 * 브라우저 콘솔에서 테스트 실행하는 함수
 */
export function testInBrowser() {
  if (typeof window !== 'undefined') {
    // 전역 객체에 테스트 함수들 추가
    (window as any).diagnosisTest = {
      runAll: runAllTestCases,
      runSingle: runSingleTestCase,
      testCases,
      createSample: createSampleDiagnosisData
    };
    
    console.log('진단 테스트 함수들이 window.diagnosisTest에 추가되었습니다.');
    console.log('※ 2025년 기준중위소득표 60% 적용된 최신 로직');
    console.log('사용법:');
    console.log('- window.diagnosisTest.runAll() : 모든 케이스 테스트');
    console.log('- window.diagnosisTest.runSingle("case1") : 특정 케이스 테스트');
    console.log('- window.diagnosisTest.createSample() : 샘플 데이터 생성');
  }
}
