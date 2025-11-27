-- 회생터치3 중복 문제 확인 SQL
-- Supabase SQL Editor에서 실행

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 1단계: 회생터치3이 몇 개인지 확인
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT 
  id,
  customer_name,
  phone,
  residence,
  TO_CHAR(created_at AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD HH24:MI:SS') as 생성시간,
  acquisition_source as 유입경로
FROM consultation_records 
WHERE customer_name LIKE '%회생터치3%'
ORDER BY created_at;

-- 예상 결과:
-- - 1개만 나오면: 첫 번째 상담 저장 실패 (문제!)
-- - 2개 나오면: 둘 다 저장됨 (동시성 문제 가능성)


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 2단계: 전체 회생터치 번호 순서 확인
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT 
  customer_name,
  phone,
  TO_CHAR(created_at AT TIME ZONE 'Asia/Seoul', 'MM-DD HH24:MI:SS') as 시간,
  acquisition_source as 유입경로
FROM consultation_records 
WHERE customer_name LIKE '회생터치%'
ORDER BY created_at DESC
LIMIT 20;

-- 예상 결과:
-- 회생터치5, 4, 3, 2, 1 순서로 나와야 함
-- 회생터치3이 한 번만 나오는지 확인


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 3단계: 중복 번호 찾기 (전체 체크)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT 
  customer_name,
  COUNT(*) as 개수,
  STRING_AGG(phone, ' | ') as 전화번호들,
  STRING_AGG(
    TO_CHAR(created_at AT TIME ZONE 'Asia/Seoul', 'MM-DD HH24:MI:SS'), 
    ' | '
  ) as 시간들
FROM consultation_records 
WHERE customer_name LIKE '회생터치%'
GROUP BY customer_name
HAVING COUNT(*) > 1
ORDER BY customer_name DESC;

-- 예상 결과:
-- - 결과 없음: 중복 없음 (정상)
-- - 결과 있음: 회생터치3이 2개 이상 (문제!)


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 4단계: 오늘 등록된 상담 전체 보기
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT 
  customer_name,
  phone,
  residence,
  TO_CHAR(created_at AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD HH24:MI:SS') as 생성시간,
  acquisition_source as 유입경로,
  is_duplicate as 중복여부
FROM consultation_records 
WHERE DATE(created_at AT TIME ZONE 'Asia/Seoul') = CURRENT_DATE
ORDER BY created_at DESC;


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 5단계: 회생터치 번호 생성 로직 검증
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- 현재 최대 번호 확인
SELECT 
  SUBSTRING(customer_name FROM '회생터치(\d+)')::INTEGER as 번호,
  customer_name,
  TO_CHAR(created_at AT TIME ZONE 'Asia/Seoul', 'MM-DD HH24:MI:SS') as 시간
FROM consultation_records 
WHERE customer_name ~ '^회생터치\d+$'
ORDER BY 
  SUBSTRING(customer_name FROM '회생터치(\d+)')::INTEGER DESC
LIMIT 10;

-- 예상: 회생터치5, 4, 3, 3 (중복!), 2, 1... 


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 보너스: 저장 실패 가능성이 있는 레코드 찾기
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- 회생터치 번호 사이에 빠진 것 찾기
WITH numbered AS (
  SELECT 
    SUBSTRING(customer_name FROM '회생터치(\d+)')::INTEGER as num,
    customer_name,
    created_at
  FROM consultation_records 
  WHERE customer_name ~ '^회생터치\d+$'
),
expected AS (
  SELECT generate_series(
    (SELECT MIN(num) FROM numbered),
    (SELECT MAX(num) FROM numbered)
  ) as expected_num
)
SELECT 
  expected_num as 빠진번호
FROM expected
WHERE expected_num NOT IN (SELECT num FROM numbered)
ORDER BY expected_num;

-- 결과가 나오면: 그 번호가 저장 안된 것
-- 결과 없으면: 모두 연속적으로 저장됨




