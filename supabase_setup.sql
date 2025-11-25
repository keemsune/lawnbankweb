-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 회생터치 중복 문제 해결 - Supabase 설정
-- Supabase SQL Editor에서 실행
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 1. 카운터 테이블 생성 (중복 방지)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE IF NOT EXISTS consultation_counter (
  id TEXT PRIMARY KEY DEFAULT 'main',
  counter INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 현재 최대값으로 초기화
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

-- 확인
SELECT * FROM consultation_counter;


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 2. 원자적 번호 생성 함수
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE OR REPLACE FUNCTION get_next_consultation_number()
RETURNS INTEGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  -- 원자적으로 1 증가 및 반환
  UPDATE consultation_counter 
  SET counter = counter + 1, updated_at = NOW()
  WHERE id = 'main'
  RETURNING counter INTO next_num;
  
  RETURN next_num;
END;
$$ LANGUAGE plpgsql;

-- 테스트
SELECT get_next_consultation_number();  -- 다음 번호 반환
SELECT get_next_consultation_number();  -- 그 다음 번호 반환 (절대 중복 없음!)


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 3. 에러 로그 테이블 생성 (관리자용)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE IF NOT EXISTS consultation_error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type TEXT NOT NULL,  -- 'supabase_save_failed', 'homepage_api_failed' 등
  consultation_number TEXT,  -- 회생터치3
  customer_phone TEXT,
  customer_residence TEXT,
  acquisition_source TEXT,
  error_message TEXT,
  error_details JSONB,  -- 상세 에러 정보
  retry_count INTEGER DEFAULT 0,
  resolved BOOLEAN DEFAULT FALSE,  -- 해결 여부
  created_at TIMESTAMPTZ DEFAULT (NOW() AT TIME ZONE 'Asia/Seoul')
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON consultation_error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved ON consultation_error_logs(resolved);
CREATE INDEX IF NOT EXISTS idx_error_logs_type ON consultation_error_logs(error_type);

-- 확인
SELECT * FROM consultation_error_logs ORDER BY created_at DESC LIMIT 10;


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 4. 에러 조회용 뷰 (관리자 대시보드용)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE OR REPLACE VIEW v_recent_errors AS
SELECT 
  id,
  error_type,
  consultation_number,
  customer_phone,
  error_message,
  retry_count,
  resolved,
  TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as error_time,
  CASE 
    WHEN created_at > NOW() - INTERVAL '1 hour' THEN '🔴 최근'
    WHEN created_at > NOW() - INTERVAL '24 hours' THEN '🟡 오늘'
    ELSE '⚪ 이전'
  END as urgency
FROM consultation_error_logs
WHERE resolved = FALSE
ORDER BY created_at DESC;

-- 확인
SELECT * FROM v_recent_errors;


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 5. 에러 통계 조회 함수
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE OR REPLACE FUNCTION get_error_statistics(days INTEGER DEFAULT 7)
RETURNS TABLE (
  error_type TEXT,
  count BIGINT,
  resolved_count BIGINT,
  unresolved_count BIGINT,
  latest_error TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cel.error_type,
    COUNT(*) as count,
    COUNT(*) FILTER (WHERE cel.resolved = TRUE) as resolved_count,
    COUNT(*) FILTER (WHERE cel.resolved = FALSE) as unresolved_count,
    MAX(cel.created_at) as latest_error
  FROM consultation_error_logs cel
  WHERE cel.created_at > NOW() - (days || ' days')::INTERVAL
  GROUP BY cel.error_type
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql;

-- 사용법
SELECT * FROM get_error_statistics(7);  -- 최근 7일


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 6. 에러 해결 처리 함수
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE OR REPLACE FUNCTION mark_error_resolved(error_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE consultation_error_logs
  SET resolved = TRUE
  WHERE id = error_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- 사용법
-- SELECT mark_error_resolved('error-uuid-here');


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 완료! 
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- 확인용 쿼리들
SELECT '✅ 카운터 테이블:', * FROM consultation_counter;
SELECT '✅ 다음 번호:', get_next_consultation_number();
SELECT '✅ 에러 로그:', COUNT(*) FROM consultation_error_logs;
SELECT '✅ 미해결 에러:', COUNT(*) FROM v_recent_errors;


