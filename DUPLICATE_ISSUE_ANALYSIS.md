# 회생터치3 중복 문제 분석 보고서

## 📌 문제 요약

- **발생 시점**: 20분 간격으로 두 개의 상담 신청
- **증상**: 회생터치3이 중복으로 등록됨
- **정상 순서**: 회생터치2 → 회생터치3 → 회생터치4
- **실제 순서**: 회생터치2 → 회생터치3 → 회생터치3 → 회생터치4
- **데이터 불일치**: 
  - 홈페이지 API: 회생터치3이 2개
  - Supabase/대시보드: 회생터치3이 1개 (또는 0개)

---

## 🔍 원인 분석

### 시간 흐름

```
시간 T0 (예: 14:00) - 첫 번째 상담 신청
├─ Step 1: Supabase 조회 → 최대값 2 (회생터치2까지 존재)
├─ Step 2: 회생터치3 생성
├─ Step 3: ✅ 홈페이지 API 등록 성공
├─ Step 4: ❌ Supabase 저장 실패 (여기서 문제 발생!)
└─ Step 5: ✅ localStorage 저장 성공

시간 T0+20분 (예: 14:20) - 두 번째 상담 신청
├─ Step 1: Supabase 조회 → 최대값 여전히 2 (첫 번째가 저장 안됨)
├─ Step 2: 회생터치3 생성 (중복!)
├─ Step 3: ✅ 홈페이지 API 등록 성공 (중복 등록!)
├─ Step 4: ✅ Supabase 저장 성공
└─ Step 5: ✅ localStorage 저장 성공
```

### 근본 원인

**코드상의 문제점:**

1. **회생터치 번호 생성 로직** (`src/lib/diagnosis/database.ts:878-906`)
   ```typescript
   private static async getNextConsultationNumberFromSupabase() {
     // 문제: Supabase에 저장된 것만 기준으로 번호를 생성
     const allRecords = await SupabaseDiagnosisService.getAllRecords();
     const maxNumber = Math.max(...existingNumbers);
     return `회생터치${maxNumber + 1}`;
   }
   ```
   - Supabase에 저장 안된 레코드는 카운트하지 않음
   - localStorage는 확인하지 않음

2. **오류 처리의 문제** (`src/lib/diagnosis/database.ts:323-349`)
   ```typescript
   try {
     const response = await fetch('/api/supabase/saveRecord', ...);
   } catch (error) {
     console.error('❌ Supabase 저장 중 오류:', error);
     // ⚠️ 오류를 로그만 찍고 계속 진행
     // 홈페이지 API는 이미 성공한 상태!
   }
   ```
   - 홈페이지 API 성공 후 Supabase 저장 실패해도 사용자에게 성공 메시지
   - 데이터 불일치 발생

3. **저장 순서의 문제**
   ```
   현재: 홈페이지 API 저장 → Supabase 저장 → localStorage 저장
   문제: 홈페이지 API 성공 후 Supabase 실패 시 데이터 불일치
   ```

---

## 🛠️ 해결 방법

### 1. 즉시 조치 (현재 중복 데이터 처리)

#### A. 홈페이지 API에서 중복 제거

```javascript
// 홈페이지 관리자 페이지에서 실행
// 1. 전화번호로 케이스 검색
// 2. 회생터치3이 두 개 있는지 확인
// 3. 생성일시가 이른 것 또는 늦은 것 중 하나 삭제
```

#### B. Supabase 확인 및 보정

```sql
-- Supabase SQL 에디터에서 실행
-- 회생터치3 확인
SELECT * FROM consultation_records 
WHERE customer_name LIKE '%회생터치3%'
ORDER BY created_at DESC;

-- 없다면 홈페이지 API에서 가져와서 수동 추가
-- (또는 다음 상담 신청 시 자동으로 회생터치5 생성됨)
```

### 2. 근본적 해결책

#### ✅ 해결책 1: Supabase 시퀀스 사용 (강력 추천)

**장점:**
- 원자적 연산으로 중복 불가능
- 동시 요청에도 안전
- 데이터베이스 레벨에서 보장

**구현:**

1. Supabase에 카운터 테이블 생성:

```sql
-- Supabase SQL 에디터에서 실행
CREATE TABLE IF NOT EXISTS consultation_counter (
  id TEXT PRIMARY KEY DEFAULT 'main',
  counter INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 현재 최대값으로 초기화 (회생터치3까지 있다면)
INSERT INTO consultation_counter (id, counter) 
VALUES ('main', 3)
ON CONFLICT (id) DO NOTHING;

-- 번호 생성 함수 (원자적)
CREATE OR REPLACE FUNCTION get_next_consultation_number()
RETURNS INTEGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  UPDATE consultation_counter 
  SET counter = counter + 1, updated_at = NOW()
  WHERE id = 'main'
  RETURNING counter INTO next_num;
  RETURN next_num;
END;
$$ LANGUAGE plpgsql;

-- 함수 테스트
SELECT get_next_consultation_number(); -- 4 반환
SELECT get_next_consultation_number(); -- 5 반환
SELECT get_next_consultation_number(); -- 6 반환 (절대 중복 없음!)
```

2. 코드 수정:

```typescript
// src/lib/diagnosis/database.ts 수정
private static async getNextConsultationNumberFromSupabase(): Promise<string> {
  try {
    const { data, error } = await supabase.rpc('get_next_consultation_number');
    
    if (error) throw error;
    
    const nextNumber = data;
    console.log('🔢 회생터치 번호 생성 (시퀀스):', `회생터치${nextNumber}`);
    return `회생터치${nextNumber}`;
  } catch (error) {
    console.error('❌ 회생터치 번호 생성 실패:', error);
    // 백업: 현재 시간 기반 임시 번호
    return `회생터치-임시-${Date.now()}`;
  }
}
```

#### ✅ 해결책 2: 저장 순서 변경 + 트랜잭션

**핵심 아이디어:**
1. Supabase에 먼저 저장 (번호 확보)
2. 홈페이지 API 전송
3. 홈페이지 API 실패 시 Supabase에서 삭제 (롤백)

```typescript
// src/lib/diagnosis/database.ts 수정
static async saveSimpleConsultation(data: SimpleConsultationData, acquisitionSource: string) {
  // 1. 회생터치 번호 생성
  const consultationName = await this.getNextConsultationNumberFromSupabase();
  
  // 2. Supabase에 먼저 저장 (번호 확보)
  const supabaseResult = await fetch('/api/supabase/saveRecord', {
    method: 'POST',
    body: JSON.stringify(record)
  });
  
  if (!supabaseResult.success) {
    throw new Error('Supabase 저장 실패');
  }
  
  const supabaseId = supabaseResult.data.id;
  
  // 3. 홈페이지 API 전송
  try {
    await fetch('/api/homepage/createCase', {
      method: 'POST',
      body: JSON.stringify(consultationData)
    });
  } catch (error) {
    // 홈페이지 API 실패 시 Supabase에서 삭제 (롤백)
    console.error('❌ 홈페이지 API 실패, Supabase 레코드 삭제:', supabaseId);
    await fetch('/api/supabase/deleteRecord', {
      method: 'POST',
      body: JSON.stringify({ id: supabaseId })
    });
    throw error;
  }
  
  // 4. localStorage 저장
  // ...
}
```

#### 해결책 3: UUID 사용 (가장 간단)

**장점:**
- 구현 간단
- 절대 중복 불가능

**단점:**
- 순차적이지 않음
- 사용자에게 익숙하지 않을 수 있음

```typescript
// src/lib/diagnosis/database.ts 수정
import { v4 as uuidv4 } from 'uuid';

private static async getNextConsultationNumber(): Promise<string> {
  const shortId = uuidv4().split('-')[0]; // abc123de
  return `회생터치-${shortId}`;
}

// 결과: 회생터치-abc123de, 회생터치-def456gh, ...
```

---

## 🔍 재발 방지 체크리스트

### 코드 레벨
- [ ] Supabase 시퀀스 구현
- [ ] 저장 순서 변경 (Supabase 먼저)
- [ ] 트랜잭션 및 롤백 로직 추가
- [ ] 오류 발생 시 사용자에게 정확한 메시지 표시

### 모니터링
- [ ] Supabase 저장 실패 시 알림 (Slack/이메일)
- [ ] 중복 번호 감지 알림
- [ ] 홈페이지 API vs Supabase 데이터 일치 여부 주기적 확인

### 테스트
- [ ] 20분 간격 연속 신청 테스트
- [ ] Supabase 저장 실패 시나리오 테스트
- [ ] 홈페이지 API 실패 시나리오 테스트
- [ ] 네트워크 불안정 환경 테스트

---

## 📊 현재 상태 확인 방법

### 1. 브라우저 콘솔에서 확인

```javascript
// 브라우저 개발자 도구 콘솔에서 실행
// (check_duplicate.js 파일 참고)
```

### 2. 관리자 대시보드 확인

```
URL: /consultation/dashboard-7um5212n
- 회생터치3 검색
- 중복 여부 확인
- 전화번호, 생성일시 비교
```

### 3. Supabase 직접 확인

```sql
-- 회생터치3 검색
SELECT * FROM consultation_records 
WHERE customer_name LIKE '%회생터치3%'
ORDER BY created_at DESC;

-- 모든 회생터치 번호 확인
SELECT customer_name, created_at, phone, acquisition_source
FROM consultation_records 
WHERE customer_name LIKE '회생터치%'
ORDER BY created_at DESC;
```

### 4. 홈페이지 API 확인

```
홈페이지 관리자 페이지 접속
→ 케이스 관리
→ 전화번호로 검색
→ 회생터치3이 몇 개인지 확인
```

---

## 🚨 긴급 연락처

문제 발생 시:
1. 개발팀에 즉시 알림
2. Supabase 로그 확인
3. 홈페이지 API 로그 확인
4. 필요시 수동으로 중복 데이터 정리

---

**작성일**: 2025-11-24
**작성자**: AI Assistant
**버전**: 1.0




