# 회생터치 중복 방지 - 빠른 설정 (5분)

## ✅ 완료된 것
- [x] 슬랙 웹훅 설정 (에러 알림만)
- [x] 코드 수정 완료 (database.ts)

## ⏳ 남은 것: Supabase SQL 실행

### 단계 1: Supabase 접속
```
https://app.supabase.com
→ 프로젝트 선택
→ SQL Editor 클릭
```

### 단계 2: SQL 실행

아래 SQL을 복사해서 실행:

```sql
-- 1. 카운터 테이블
CREATE TABLE IF NOT EXISTS consultation_counter (
  id TEXT PRIMARY KEY DEFAULT 'main',
  counter INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 현재 최대값으로 초기화
INSERT INTO consultation_counter (id, counter) 
SELECT 
  'main',
  COALESCE(
    MAX(CAST(SUBSTRING(customer_name FROM '회생터치(\d+)') AS INTEGER)),
    0
  )
FROM consultation_records
WHERE customer_name ~ '^회생터치\d+$'
ON CONFLICT (id) DO UPDATE 
SET counter = EXCLUDED.counter,
    updated_at = NOW();

-- 3. 번호 생성 함수 (중복 방지!)
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

-- 4. 에러 로그 테이블
CREATE TABLE IF NOT EXISTS consultation_error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type TEXT NOT NULL,
  consultation_number TEXT,
  customer_phone TEXT,
  customer_residence TEXT,
  acquisition_source TEXT,
  error_message TEXT,
  error_details JSONB,
  retry_count INTEGER DEFAULT 0,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT (NOW() AT TIME ZONE 'Asia/Seoul')
);

-- 5. 인덱스
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON consultation_error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved ON consultation_error_logs(resolved);
CREATE INDEX IF NOT EXISTS idx_error_logs_type ON consultation_error_logs(error_type);

-- 확인
SELECT * FROM consultation_counter;
SELECT get_next_consultation_number();
```

### 단계 3: 확인

```sql
-- 카운터 확인
SELECT * FROM consultation_counter;

-- 테스트
SELECT get_next_consultation_number();  -- 다음 번호
SELECT get_next_consultation_number();  -- 그 다음 번호 (중복 없음!)
```

### 단계 4: 배포

```bash
cd /Applications/sun/0.lawn_bankweb/bankweb
git add .
git commit -m "fix: 회생터치 중복 방지 및 에러 로깅 추가"
./deploy-to-ec2.sh
```

---

## 🎯 이제 뭐가 되나요?

### ✅ 중복 방지
- 번호 생성 즉시 Supabase에 예약
- 저장 실패해도 다음 사람은 다른 번호 받음
- 100% 중복 불가능!

### ✅ 에러 추적
```sql
-- 에러 확인
SELECT * FROM consultation_error_logs
WHERE resolved = FALSE
ORDER BY created_at DESC;
```

### ✅ 슬랙 알림
- Supabase 저장 3회 실패 시 슬랙 알림
- 에러 내용, 전화번호, 원인 포함

---

## 📞 문제 발생 시

**에러 로그 확인:**
```sql
SELECT 
  error_type,
  consultation_number,
  error_message,
  created_at
FROM consultation_error_logs
ORDER BY created_at DESC
LIMIT 10;
```

**슬랙 채널 확인:**
- 에러 발생 시 자동으로 알림 감

---

**작성일**: 2024-11-24
**소요 시간**: 5분

