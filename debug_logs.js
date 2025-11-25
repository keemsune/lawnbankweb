/**
 * 회생터치3 중복 문제 - 로그 분석 스크립트
 * 브라우저 콘솔에서 실행하여 localStorage의 상세 정보 확인
 */

(function analyzeDuplicateIssue() {
  console.log('🔍 회생터치3 중복 문제 - 상세 분석');
  console.log('='.repeat(80));
  
  // localStorage에서 데이터 가져오기
  const recordsJson = localStorage.getItem('diagnosis_records');
  if (!recordsJson) {
    console.log('❌ localStorage에 데이터가 없습니다.');
    return;
  }
  
  const records = JSON.parse(recordsJson);
  
  // 회생터치3 필터링
  const recovery3 = records.filter(r => {
    const name = r.contactInfo?.name || r.customerName || '';
    return name.includes('회생터치3');
  });
  
  console.log(`\n📊 전체 레코드 수: ${records.length}`);
  console.log(`📊 회생터치3 개수: ${recovery3.length}\n`);
  
  if (recovery3.length === 0) {
    console.log('❌ 회생터치3을 찾을 수 없습니다.');
    return;
  }
  
  // 시간순 정렬
  recovery3.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  
  console.log('📋 회생터치3 상세 정보:\n');
  
  recovery3.forEach((record, index) => {
    const num = index + 1;
    const time = new Date(record.createdAt);
    const name = record.contactInfo?.name || record.customerName;
    const phone = record.contactInfo?.phone || record.phone;
    const residence = record.contactInfo?.residence || record.residence;
    const source = record.acquisitionSource;
    const supabaseId = record.supabaseId;
    
    console.log(`${'='.repeat(80)}`);
    console.log(`[${num}번째 회생터치3]`);
    console.log(`${'='.repeat(80)}`);
    console.log(`생성일시:   ${time.toLocaleString('ko-KR')}`);
    console.log(`고객명:     ${name}`);
    console.log(`전화번호:   ${phone || 'N/A'}`);
    console.log(`거주지:     ${residence || 'N/A'}`);
    console.log(`유입경로:   ${source}`);
    console.log(`로컬 ID:    ${record.id}`);
    console.log(`Supabase:   ${supabaseId ? `✅ ${supabaseId}` : '❌ 없음 (저장 실패!)'}`);
    
    if (!supabaseId) {
      console.log(`\n⚠️⚠️⚠️ 문제 발견! ⚠️⚠️⚠️`);
      console.log(`이 레코드는 Supabase에 저장되지 않았습니다!`);
      console.log(`이것이 중복 발생의 원인입니다.`);
    }
    
    console.log('');
  });
  
  // 시간 차이 계산
  if (recovery3.length >= 2) {
    const time1 = new Date(recovery3[0].createdAt);
    const time2 = new Date(recovery3[1].createdAt);
    const diffMinutes = Math.round((time2 - time1) / 1000 / 60);
    
    console.log(`\n⏰ 시간 차이: 약 ${diffMinutes}분`);
  }
  
  // 결론
  console.log(`\n${'='.repeat(80)}`);
  console.log('🎯 결론');
  console.log(`${'='.repeat(80)}`);
  
  const hasNoSupabaseId = recovery3.some(r => !r.supabaseId);
  
  if (hasNoSupabaseId) {
    console.log(`
✅ 원인 확정: Supabase 저장 실패

첫 번째 회생터치3이 Supabase에 저장되지 않았습니다.
따라서 두 번째 사용자 신청 시 Supabase에서 최대값을 조회할 때
여전히 회생터치2까지만 보여서 회생터치3을 다시 생성했습니다.

다음 단계:
1. 브라우저 콘솔에서 14:00경의 로그 확인
2. "❌ Supabase 저장 실패" 메시지 찾기
3. 오류 메시지 확인하여 실패 원인 파악
4. 서버 로그 확인
5. Supabase 로그 확인
    `);
  } else {
    console.log(`
⚠️ 모든 레코드에 Supabase ID가 있습니다.

가능성:
1. 저장은 되었지만 타이밍 문제로 두 번째 조회 시 반영 안됨
2. 나중에 수동으로 저장됨
3. 다른 원인

추가 확인 필요:
1. Supabase에서 실제 created_at 타임스탬프 확인
2. 두 레코드가 정말 Supabase에 모두 있는지 확인
    `);
  }
  
  console.log(`\n💡 다음 명령어로 홈페이지 API 확인:`);
  recovery3.forEach((r, i) => {
    const phone = r.contactInfo?.phone || r.phone;
    if (phone) {
      console.log(`checkHomepageAPI("${phone}") // ${i + 1}번째`);
    }
  });
  
})();

// 홈페이지 API 확인 함수
window.checkHomepageAPI = async function(phone) {
  console.log(`\n🔍 홈페이지 API 확인: ${phone}`);
  console.log('-'.repeat(80));
  
  try {
    const response = await fetch('/api/homepage/checkDuplicate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phone.replace(/-/g, '') })
    });
    
    if (!response.ok) {
      console.error('❌ API 호출 실패:', response.status);
      return;
    }
    
    const result = await response.json();
    console.log('✅ 응답:', result);
    
    if (result.isDuplicate) {
      console.log(`⚠️ 중복 발견! ${result.duplicateCount}개의 상담이 홈페이지 API에 있습니다.`);
    } else {
      console.log('✅ 중복 없음 (1개만 있음)');
    }
  } catch (error) {
    console.error('❌ 오류:', error);
  }
};

