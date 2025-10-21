# 진단테스트 결과 로직

진단테스트에서 사용자가 선택한 값들을 바탕으로 회생파산 제도 적합성, 월 변제금, 탕감률 등을 계산하는 로직입니다.

## 파일 구조

```
src/lib/diagnosis/
├── types.ts          # 타입 정의
├── mapper.ts          # 답변 코드화 매퍼
├── calculator.ts      # 결과 계산 로직
├── service.ts         # 메인 서비스 클래스
├── example.ts         # 테스트 예제
├── index.ts           # 메인 export
└── README.md          # 이 파일
```

## 주요 기능

### 1. 답변 코드화
- 문자열 답변을 숫자/불린 값으로 변환
- 계산에 용이한 형태로 데이터 정규화

### 2. 결과 계산
- **회생파산 적합성**: 개인회생/파산면책 가능 여부 판단
- **월 변제금**: 36개월/60개월 변제 시 예상 월 변제금
- **탕감 결과**: 현재 채무 대비 탕감 후 채무 계산
- **탕감률**: 개인 탕감률 및 다른 사람들과의 비교

### 3. 데이터 관리
- 로컬 스토리지 저장/불러오기
- 데이터 유효성 검증
- 결과 재계산 기능

## 사용법

### 기본 사용법

```typescript
import { DiagnosisService, type DiagnosisAnswers, type ContactInfo } from '@/lib/diagnosis';

// 테스트 답변 데이터
const answers: DiagnosisAnswers = {
  1: '혼인',
  2: '있다',
  '2_additional': '2명',
  3: '직장인(급여소득)',
  '3_additional': '200만~300만원',
  4: '네',
  5: ['예금/적금', '자동차/오토바이'],
  6: '5천만~1억원'
};

// 연락처 정보
const contactInfo: ContactInfo = {
  name: '홍길동',
  phone: '010-1234-5678',
  email: 'hong@example.com'
};

// 진단 결과 계산
const result = await DiagnosisService.processDiagnosis(answers, contactInfo);

console.log(result.summary.eligibilityText); // "개인회생 제도가 적합합니다"
console.log(result.result.reductionRate.percentage); // 85 (탕감률 85%)
```

### 결과 페이지에서 사용

```typescript
// 저장된 결과 불러오기
const savedResult = DiagnosisService.loadDiagnosisResult();

if (savedResult) {
  // 결과 표시
  console.log('적합 제도:', savedResult.summary.eligibilityText);
  console.log('월 변제금 (36개월):', savedResult.result.monthlyPayment.period36);
  console.log('탕감률:', savedResult.result.reductionRate.percentage + '%');
}
```

### 테스트 실행

```typescript
import { runAllTestCases, runSingleTestCase } from '@/lib/diagnosis/example';

// 모든 테스트 케이스 실행
await runAllTestCases();

// 특정 케이스만 테스트
const result = await runSingleTestCase('case1');
```

## 계산 로직 상세

### 회생파산 적합성 판단

**개인회생 적합 조건:**
- 채무 1천만원 이상 ~ 15억원 이하
- 월 소득이 있어야 함
- 4대보험 가입 (안정적 소득 증명)

**파산면책 적합 조건:**
- 채무 500만원 이상
- 소득이 없거나 매우 적음 (월 150만원 미만)
- 부동산 미보유

### 월 변제금 계산

**2025년 기준중위소득 60% 적용 (최저생계비)**
- 1인가구: 1,435,208원 (기준중위소득: 2,392,013원)
- 2인가구: 2,359,595원 (기준중위소득: 3,932,658원)
- 3인가구: 3,015,212원 (기준중위소득: 5,025,353원)
- 4인가구: 3,658,664원 (기준중위소득: 6,097,773원)
- 5인가구: 4,264,915원 (기준중위소득: 7,108,192원)
- 6인가구: 4,264,915원 (5인가구와 동일 적용)

```
가족구성원수 = 본인 + 배우자(기혼시) + 자녀수
기본생계비 = 기준중위소득표[가족구성원수]
변제가능금액 = (월소득 - 기본생계비) × 80%
월변제금 = min(변제가능금액, 총채무 × 20% ÷ 변제기간)
```

### 탕감률 계산

**기본 탕감률:** 80%

**조정 요소:**
- 소득 수준: 무소득(100% - 파산면책), 저소득(85%), 고소득(70%)
- 재산 보유: 부동산(-20%), 차량(-5%), 예금(-5%)
- 가족 부양: 기혼(+5%), 자녀당(+2%)

**최종 범위:** 20% ~ 100%

## 데이터 구조

### DiagnosisAnswers (원본 답변)
```typescript
{
  1: '혼인' | '미혼' | '이혼',
  2: '있다' | '없다',
  '2_additional'?: '1명' | '2명' | '3명' | '4명' | '5명 이상',
  3: '소득이 없다' | '직장인(급여소득)' | '자영업(사업소득)' | '기타소득',
  '3_additional'?: '100만원 미만' | '100만~200만원' | '200만~300만원' | '300만 이상',
  4: '네' | '아니요',
  5: string[], // 재산 목록
  6: '1천만원 이하' | '1천만~5천만원' | ... // 채무 구간
}
```

### DiagnosisResult (계산 결과)
```typescript
{
  eligibility: {
    personalRecovery: boolean,
    bankruptcy: boolean,
    recommendation: 'recovery' | 'bankruptcy' | 'both' | 'none'
  },
  monthlyPayment: {
    period36: number,
    period60: number
  },
  reductionRate: {
    currentDebt: number,
    reducedDebt: number,
    reductionAmount: number,
    percentage: number,
    comparison: 'high' | 'average' | 'low',
    distributionData: { ... }
  }
}
```

## 브라우저 콘솔에서 테스트

개발자 도구 콘솔에서 다음과 같이 테스트할 수 있습니다:

```javascript
// 테스트 함수 로드 (example.ts에서 testInBrowser() 호출 후)
window.diagnosisTest.runAll(); // 모든 케이스 테스트
window.diagnosisTest.runSingle('case1'); // 특정 케이스 테스트
window.diagnosisTest.createSample(); // 샘플 데이터 생성
```

## 향후 개선 사항

1. **실제 법적 기준 반영**: 현재는 추정값 기반, 실제 법원 기준 적용 필요
2. **지역별 차이**: 지방법원별 인가 기준 차이 반영
3. **시간에 따른 변화**: 법령 개정에 따른 기준 업데이트
4. **더 정확한 재산 평가**: 재산 종류별 세부 평가 기준
5. **통계 데이터 업데이트**: 실제 통계청 데이터 기반 분포 정보
