# 회생터치 중복 문제 해결 - 구현 가이드

## 📋 구현 개요

1. **Supabase 카운터 테이블** - 번호 중복 원천 차단
2. **에러 로그 시스템** - 문제 발생 시 관리자가 원인 파악
3. **재시도 로직** - 일시적 오류 자동 복구
4. **Slack 알림** - 심각한 오류 실시간 알림

---

## 🚀 구현 순서

### **Step 1: Supabase 설정 (5분)**

#### 1-1. Supabase 대시보드 접속
```
https://app.supabase.com
→ 프로젝트 선택
→ SQL Editor 클릭
```

#### 1-2. SQL 실행
```
supabase_setup.sql 파일 열기
→ 전체 내용 복사
→ Supabase SQL Editor에 붙여넣기
→ Run 버튼 클릭
```

#### 1-3. 확인
```sql
-- 카운터 확인
SELECT * FROM consultation_counter;

-- 번호 생성 테스트
SELECT get_next_consultation_number();  -- 다음 번호 반환
SELECT get_next_consultation_number();  -- 그 다음 번호 (절대 중복 없음!)

-- 에러 로그 테이블 확인
SELECT * FROM consultation_error_logs;
```

**예상 결과:**
```
consultation_counter:
id   | counter | updated_at
-----|---------|------------------
main | 5       | 2024-11-24 15:30

get_next_consultation_number():
6
7  (다시 실행하면 8, 9, ...)
```

---

### **Step 2: 코드 수정 (20분)**

#### 2-1. supabase client import 확인

파일: `src/lib/supabase/client.ts`

이미 있으면 패스, 없으면:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

#### 2-2. database.ts 수정

파일: `src/lib/diagnosis/database.ts`

**방법 A: 자동 패치 적용 (추천)**
```bash
# 프로젝트 루트에서
cd /Applications/sun/0.lawn_bankweb/bankweb

# 백업
cp src/lib/diagnosis/database.ts src/lib/diagnosis/database.ts.backup

# database.ts.patch 파일 내용을 참고하여 수동 수정
```

**방법 B: 수동 수정**

1. **파일 상단에 import 추가**
```typescript
import { supabase } from '@/lib/supabase/client';
```

2. **getNextConsultationNumberFromSupabase 함수 교체** (878-906줄)
   - `database.ts.patch` 파일의 내용으로 교체

3. **saveRecord 함수의 Supabase 저장 부분 교체** (323-349줄)
   - `database.ts.patch` 파일의 재시도 로직으로 교체

4. **logError 함수 추가** (파일 끝부분)
   - `database.ts.patch` 파일의 함수 추가

---

### **Step 3: 테스트 (10분)**

#### 3-1. 로컬 테스트

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 테스트
# 1. 상담 신청 페이지 접속
# 2. 간편 상담 신청 (여러 번)
# 3. 개발자 도구 Console 확인
```

**확인할 로그:**
```
🔢 회생터치 번호 생성 시작 (시퀀스 기반)
✅ 회생터치 번호 생성 성공: 회생터치6
🔄 Supabase 저장 시도 1/3...
✅ Supabase 저장 성공! (1번째 시도) ID: abc-123-def
```

#### 3-2. Supabase 확인

```sql
-- 번호가 순차적으로 증가하는지 확인
SELECT customer_name, created_at 
FROM consultation_records 
ORDER BY created_at DESC 
LIMIT 10;

-- 카운터 값 확인
SELECT * FROM consultation_counter;

-- 에러 로그 확인
SELECT * FROM consultation_error_logs;
```

#### 3-3. 중복 테스트

```javascript
// 브라우저 콘솔에서 동시 요청 테스트
Promise.all([
  fetch('/api/homepage/createCase', { method: 'POST', ... }),
  fetch('/api/homepage/createCase', { method: 'POST', ... }),
  fetch('/api/homepage/createCase', { method: 'POST', ... })
]);

// Supabase 확인 → 중복 없어야 함!
```

---

### **Step 4: 배포 (10분)**

#### 4-1. Git commit

```bash
git add .
git commit -m "feat: 회생터치 중복 방지 및 에러 로깅 시스템 추가

- Supabase 카운터 테이블로 번호 중복 원천 차단
- 에러 로그 시스템 추가
- Supabase 저장 실패 시 재시도 3회
- Slack 알림 추가
"
```

#### 4-2. EC2 배포

```bash
# 배포 스크립트 실행
./deploy-to-ec2.sh
```

#### 4-3. 배포 후 확인

```bash
# EC2 접속
ssh your-ec2

# 로그 확인
pm2 logs --lines 100 | grep "회생터치"

# Supabase 확인
# (위의 SQL 쿼리들 실행)
```

---

## 📊 관리자 모니터링

### **실시간 에러 확인**

```sql
-- 미해결 에러 조회
SELECT * FROM v_recent_errors;

-- 최근 7일 에러 통계
SELECT * FROM get_error_statistics(7);

-- 특정 유형 에러 상세
SELECT 
  consultation_number,
  customer_phone,
  error_message,
  created_at
FROM consultation_error_logs
WHERE error_type = 'supabase_save_failed'
  AND resolved = FALSE
ORDER BY created_at DESC;
```

### **에러 해결 처리**

```sql
-- 에러 해결 표시
SELECT mark_error_resolved('error-uuid-here');

-- 특정 시간대 에러 일괄 해결
UPDATE consultation_error_logs
SET resolved = TRUE
WHERE created_at BETWEEN '2024-11-24 14:00' AND '2024-11-24 15:00'
  AND error_type = 'supabase_save_failed';
```

### **Slack 알림**

Slack에서 받는 알림:
```
🚨 상담신청 등록 실패
----------------------------------
실패시간: 2024-11-24 14:00:15
고객명: 회생터치6
전화번호: 010-1234-5678
오류: Supabase 저장 실패 (3회 시도): Network timeout
----------------------------------
```

---

## 🔍 문제 발생 시 디버깅

### **시나리오 1: 번호 생성 실패**

**증상:**
- 상담 신청이 아예 안됨
- 콘솔에 "번호 생성 실패" 에러

**확인:**
```sql
-- 카운터 테이블 확인
SELECT * FROM consultation_counter;

-- 함수 테스트
SELECT get_next_consultation_number();
```

**해결:**
```sql
-- 카운터 재초기화
UPDATE consultation_counter 
SET counter = (
  SELECT MAX(CAST(SUBSTRING(customer_name FROM '회생터치(\d+)') AS INTEGER))
  FROM consultation_records
  WHERE customer_name ~ '^회생터치\d+$'
)
WHERE id = 'main';
```

---

### **시나리오 2: Supabase 저장 계속 실패**

**증상:**
- 상담은 접수되지만 Supabase에 안들어감
- 에러 로그에 계속 쌓임

**확인:**
```sql
-- 최근 에러 조회
SELECT * FROM consultation_error_logs 
WHERE error_type = 'supabase_save_failed'
ORDER BY created_at DESC 
LIMIT 10;

-- 에러 통계
SELECT error_message, COUNT(*) 
FROM consultation_error_logs
WHERE error_type = 'supabase_save_failed'
  AND created_at > NOW() - INTERVAL '1 hour'
GROUP BY error_message;
```

**일반적인 원인:**
1. **네트워크 타임아웃**
   - 해결: 서버 네트워크 상태 확인
   
2. **Supabase Rate Limit**
   - 해결: Supabase 플랜 확인, 필요시 업그레이드
   
3. **데이터 검증 실패**
   - 해결: 에러 메시지에서 어떤 필드가 문제인지 확인

---

### **시나리오 3: 여전히 중복 발생**

**거의 불가능하지만 만약 발생한다면:**

```sql
-- 중복 확인
SELECT 
  customer_name,
  COUNT(*) as count,
  STRING_AGG(phone, ', ') as phones
FROM consultation_records
WHERE customer_name LIKE '회생터치%'
GROUP BY customer_name
HAVING COUNT(*) > 1;

-- 카운터 함수 실행 로그 확인
-- (PostgreSQL 로그 확인 필요)
```

---

## ✅ 완료 체크리스트

- [ ] Supabase SQL 실행 완료
- [ ] 카운터 테이블 확인 (SELECT * FROM consultation_counter)
- [ ] 에러 로그 테이블 확인 (SELECT * FROM consultation_error_logs)
- [ ] 코드 수정 완료 (database.ts)
- [ ] 로컬 테스트 성공
- [ ] 중복 테스트 통과 (동시 요청)
- [ ] Git commit 및 push
- [ ] EC2 배포 완료
- [ ] 배포 후 테스트 성공
- [ ] 관리자에게 새 기능 공유
  - Supabase 에러 로그 테이블 사용법
  - Slack 알림 확인
  - 문제 발생 시 대응 방법

---

## 📞 문제 해결 연락처

- 개발팀: [연락처]
- Supabase 지원: https://supabase.com/support
- 긴급 상황: [긴급 연락처]

---

**작성일**: 2024-11-24
**버전**: 1.0
**구현 예상 시간**: 약 45분


