# 회생터치3 중복 원인 확인 가이드

## 📍 현재 위치 확인
지금 이 파일을 보고 있다면 프로젝트 루트입니다: `/Applications/sun/0.lawn_bankweb/bankweb/`

---

## ✅ 확인 방법 1: 브라우저 콘솔에서 localStorage 확인

### 단계:

#### 1. 웹사이트 접속
```
아무 페이지나 열기 (메인, 관리자 페이지 등)
```

#### 2. 개발자 도구 열기
```
Windows/Linux: F12 또는 Ctrl + Shift + I
Mac: Cmd + Option + I
```

#### 3. Console 탭으로 이동

#### 4. 다음 코드 복사 → 붙여넣기 → Enter

```javascript
// 회생터치3 찾기
(function() {
  const records = JSON.parse(localStorage.getItem('diagnosis_records') || '[]');
  const recovery3 = records.filter(r => {
    const name = r.contactInfo?.name || r.customerName || '';
    return name.includes('회생터치3');
  });
  
  console.log(`총 레코드: ${records.length}개`);
  console.log(`회생터치3: ${recovery3.length}개\n`);
  
  if (recovery3.length === 0) {
    console.log('❌ 회생터치3이 localStorage에 없습니다.');
    console.log('→ 관리자 대시보드나 Supabase에서 확인하세요.');
    return;
  }
  
  recovery3.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  
  recovery3.forEach((r, i) => {
    const time = new Date(r.createdAt).toLocaleString('ko-KR');
    const phone = r.contactInfo?.phone || r.phone || 'N/A';
    const supabaseId = r.supabaseId;
    
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`[${i + 1}번째 회생터치3]`);
    console.log(`시간: ${time}`);
    console.log(`전화번호: ${phone}`);
    console.log(`거주지: ${r.contactInfo?.residence || r.residence || 'N/A'}`);
    console.log(`유입경로: ${r.acquisitionSource}`);
    console.log(`Supabase ID: ${supabaseId ? '✅ ' + supabaseId : '❌ 없음 (저장 실패!)'}`);
    
    if (!supabaseId) {
      console.log(`\n🚨🚨🚨 이것이 문제입니다! 🚨🚨🚨`);
      console.log(`이 상담은 Supabase에 저장되지 않았습니다.`);
      console.log(`따라서 다음 상담 시 같은 번호가 다시 생성되었습니다.`);
    }
    console.log('');
  });
  
  if (recovery3.length >= 2) {
    const time1 = new Date(recovery3[0].createdAt);
    const time2 = new Date(recovery3[1].createdAt);
    const diffMin = Math.round((time2 - time1) / 1000 / 60);
    console.log(`⏰ 두 상담 간격: ${diffMin}분`);
  }
})();
```

#### 5. 결과 확인

**Case A: Supabase ID가 없는 것이 있다면**
```
[1번째 회생터치3]
시간: 2024-11-24 14:00:15
전화번호: 010-1111-1234
Supabase ID: ❌ 없음 (저장 실패!)

🚨 이것이 문제입니다!
→ 첫 번째 상담이 Supabase에 저장되지 않았습니다.
```
✅ **원인 확정!** → 아래 "해결 방법" 섹션으로

**Case B: 모두 Supabase ID가 있다면**
```
[1번째 회생터치3]
Supabase ID: ✅ abc-123-def

[2번째 회생터치3]
Supabase ID: ✅ xyz-456-hij

→ localStorage에는 둘 다 저장됨
```
⚠️ Supabase에서 직접 확인 필요 (방법 2로)

---

## ✅ 확인 방법 2: Supabase 직접 확인

### 단계:

#### 1. Supabase 대시보드 접속
```
https://app.supabase.com
→ 로그인
→ 프로젝트 선택
```

#### 2. SQL Editor 사용
```
좌측 메뉴: SQL Editor 클릭
→ New query 버튼 클릭
```

#### 3. SQL 실행
```sql
-- 회생터치3 찾기
SELECT 
  id,
  customer_name,
  phone,
  residence,
  TO_CHAR(created_at AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD HH24:MI:SS') as 시간,
  acquisition_source as 유입경로
FROM consultation_records 
WHERE customer_name LIKE '%회생터치3%'
ORDER BY created_at DESC;
```

#### 4. 결과 확인

**Case A: 1개만 나옴**
```
id                | customer_name | phone          | 시간
------------------|---------------|----------------|------------------
xyz-456-hij       | 회생터치3     | 010-2222-5678  | 2024-11-24 14:20:30
```
✅ **원인 확정!** 
- 첫 번째 상담(14:00)이 Supabase에 없음
- 두 번째 상담(14:20)만 저장됨

**Case B: 2개 나옴**
```
id                | customer_name | phone          | 시간
------------------|---------------|----------------|------------------
xyz-456-hij       | 회생터치3     | 010-2222-5678  | 2024-11-24 14:20:30
abc-123-def       | 회생터치3     | 010-1111-1234  | 2024-11-24 14:00:15
```
⚠️ 둘 다 저장되어 있음 → 다른 원인 (동시성 문제 가능성)

#### 5. 전체 번호 순서 확인
```sql
-- 회생터치 번호 순서 확인
SELECT 
  customer_name,
  phone,
  TO_CHAR(created_at AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD HH24:MI:SS') as 시간
FROM consultation_records 
WHERE customer_name LIKE '회생터치%'
ORDER BY created_at DESC
LIMIT 10;
```

**정상 결과:**
```
회생터치4  | 010-3333-xxxx | 2024-11-24 14:40:00
회생터치3  | 010-2222-xxxx | 2024-11-24 14:20:00
회생터치2  | 010-1111-xxxx | 2024-11-24 14:00:00
회생터치1  | 010-0000-xxxx | 2024-11-24 13:40:00
```

**문제 있는 결과:**
```
회생터치4  | 010-3333-xxxx | 2024-11-24 14:40:00
회생터치3  | 010-2222-xxxx | 2024-11-24 14:20:00  ← 하나만
회생터치2  | 010-1111-xxxx | 2024-11-24 14:00:00
                          ↑ 회생터치3(14:00) 누락!
```

---

## ✅ 확인 방법 3: 관리자 대시보드 확인

### 단계:

#### 1. 관리자 페이지 접속
```
URL: https://your-domain.com/consultation/dashboard-7um5212n
```

#### 2. 필터/검색 사용
```
검색창에 "회생터치3" 입력
또는
날짜 필터: 2024-11-24
```

#### 3. 결과 확인
```
예상: 1개만 표시 (14:20 것만)
실제 홈페이지 API에는 2개지만 Supabase에 1개만 있으면 1개만 보임
```

---

## ✅ 확인 방법 4: 홈페이지 API 직접 확인

### 옵션 A: 브라우저 콘솔에서

```javascript
// 개발자 도구 → Console에서 실행
async function checkPhone(phone) {
  const response = await fetch('/api/homepage/checkDuplicate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: phone.replace(/-/g, '') })
  });
  const result = await response.json();
  console.log(`전화번호 ${phone}:`, result);
  if (result.isDuplicate) {
    console.log(`⚠️ ${result.duplicateCount}개의 상담이 홈페이지 API에 있습니다!`);
  }
}

// 사용법 (전화번호 넣기):
await checkPhone('010-1111-1234');  // 첫 번째 회생터치3
await checkPhone('010-2222-5678');  // 두 번째 회생터치3
```

### 옵션 B: 홈페이지 관리자 시스템

```
1. https://www.lawandfirm.com 관리자 페이지 접속
2. 케이스 관리 → 검색
3. 전화번호로 검색
4. "회생터치3"이 몇 개 나오는지 확인
```

---

## 📊 확인 결과 정리표

| 위치 | 회생터치3 개수 | 의미 |
|------|---------------|------|
| localStorage | 2개 | 브라우저에 2개 저장됨 |
| Supabase | 1개 | 첫 번째 저장 실패 ✅ |
| 관리자 대시보드 | 1개 | Supabase 기반이므로 1개 |
| 홈페이지 API | 2개 | 둘 다 전송 성공 (중복!) |

### 결론:
✅ **첫 번째 상담(14:00)이 Supabase에 저장 실패**
✅ **두 번째 상담(14:20)이 같은 번호로 생성됨**

---

## 🔍 추가 확인: 오류 로그 찾기

### A. 서버 로그 (EC2)

```bash
# EC2 접속
ssh your-ec2-server

# pm2 사용 시
pm2 logs --lines 500 | grep "Supabase"
pm2 logs --lines 500 | grep "회생터치3"

# 또는 특정 시간대 로그
journalctl -u your-app.service --since "2024-11-24 14:00:00" --until "2024-11-24 14:25:00"
```

### B. Supabase 로그

```
Supabase Dashboard
→ Logs
→ Postgres Logs
→ 시간 필터: 14:00 ~ 14:25
→ 검색: "INSERT" 또는 "ERROR"
```

---

## 💡 다음 단계

### 원인 확정 후:
1. **즉시 조치**: 홈페이지 API에서 중복된 회생터치3 하나 삭제
2. **근본 해결**: 코드 수정 (별도 문서 참고)

### 아직 원인 불명확:
1. 위 4가지 방법으로 모두 확인
2. 결과를 개발팀에 공유
3. 서버 로그 확인

---

## ❓ 문제 해결 FAQ

**Q: localStorage가 비어있어요**
→ 다른 브라우저나 시크릿 모드에서 신청했을 가능성
→ Supabase와 홈페이지 API에서 확인

**Q: Supabase 접속 권한이 없어요**
→ 관리자 대시보드로 확인
→ 또는 권한 있는 사람에게 SQL 실행 요청

**Q: 관리자 대시보드 비밀번호를 몰라요**
→ URL: /consultation/dashboard-7um5212n
→ 코드에서 비밀번호 확인 또는 관리자에게 문의

**Q: 모든 곳에서 2개씩 나와요**
→ 다른 원인 (동시성 문제)일 가능성
→ 생성 시간이 정확히 몇 초 차이인지 확인

---

**작성일**: 2024-11-24
**파일 위치**: `/Applications/sun/0.lawn_bankweb/bankweb/CHECK_DUPLICATE_GUIDE.md`

