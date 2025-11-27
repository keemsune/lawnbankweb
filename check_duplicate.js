/**
 * 회생터치3 중복 문제 확인 스크립트
 * 
 * 사용법:
 * 1. 브라우저 개발자 도구 열기 (F12)
 * 2. Console 탭으로 이동
 * 3. 이 파일의 내용을 복사해서 붙여넣기
 * 4. Enter 키 눌러서 실행
 */

(async function checkDuplicate() {
  console.log('🔍 회생터치3 중복 문제 확인 시작\n');
  console.log('='.repeat(60));
  
  // 1. localStorage 확인
  console.log('\n📦 1. localStorage 확인');
  console.log('-'.repeat(60));
  
  const localRecords = localStorage.getItem('diagnosis_records');
  if (!localRecords) {
    console.log('❌ localStorage에 데이터가 없습니다.');
  } else {
    const records = JSON.parse(localRecords);
    const recoveryTouch3 = records.filter(r => 
      r.contactInfo?.name?.includes('회생터치3') || 
      r.customerName?.includes('회생터치3')
    );
    
    console.log(`총 레코드 수: ${records.length}`);
    console.log(`회생터치3 개수: ${recoveryTouch3.length}`);
    
    if (recoveryTouch3.length > 0) {
      console.log('\n회생터치3 상세 정보:');
      recoveryTouch3.forEach((record, index) => {
        console.log(`\n[${index + 1}번째 회생터치3]`);
        console.log(`  - ID: ${record.id}`);
        console.log(`  - 생성일시: ${record.createdAt}`);
        console.log(`  - 전화번호: ${record.contactInfo?.phone || record.phone || 'N/A'}`);
        console.log(`  - 거주지: ${record.contactInfo?.residence || record.residence || 'N/A'}`);
        console.log(`  - 유입경로: ${record.acquisitionSource}`);
        console.log(`  - Supabase ID: ${record.supabaseId || 'N/A'}`);
      });
    }
  }
  
  // 2. Supabase 확인
  console.log('\n\n🗄️ 2. Supabase 확인');
  console.log('-'.repeat(60));
  
  try {
    const response = await fetch('/api/supabase/getAllRecords');
    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        const supabaseRecords = result.data;
        const recoveryTouch3Supabase = supabaseRecords.filter(r => 
          r.customer_name?.includes('회생터치3')
        );
        
        console.log(`총 Supabase 레코드 수: ${supabaseRecords.length}`);
        console.log(`회생터치3 개수: ${recoveryTouch3Supabase.length}`);
        
        if (recoveryTouch3Supabase.length > 0) {
          console.log('\n회생터치3 상세 정보:');
          recoveryTouch3Supabase.forEach((record, index) => {
            console.log(`\n[${index + 1}번째 회생터치3]`);
            console.log(`  - ID: ${record.id}`);
            console.log(`  - 생성일시: ${record.created_at}`);
            console.log(`  - 전화번호: ${record.phone || 'N/A'}`);
            console.log(`  - 거주지: ${record.residence || 'N/A'}`);
            console.log(`  - 유입경로: ${record.acquisition_source}`);
          });
        }
      } else {
        console.log('⚠️ Supabase API 호출 실패 또는 데이터 없음');
      }
    } else {
      console.log('❌ Supabase API 호출 실패 (API 라우트 없음)');
      console.log('💡 관리자 페이지에서 직접 확인하세요.');
    }
  } catch (error) {
    console.log('❌ Supabase 확인 중 오류:', error.message);
    console.log('💡 관리자 페이지(/consultation/dashboard-7um5212n)에서 직접 확인하세요.');
  }
  
  // 3. 홈페이지 API 확인 (전화번호 필요)
  console.log('\n\n🌐 3. 홈페이지 API 확인');
  console.log('-'.repeat(60));
  console.log('💡 전화번호를 알고 있다면 다음 명령어로 확인하세요:');
  console.log('');
  console.log('  await checkHomepageAPI("010-1234-5678")');
  console.log('');
  
  // 4. 요약 및 권장사항
  console.log('\n');
  console.log('='.repeat(60));
  console.log('📋 요약 및 권장사항');
  console.log('='.repeat(60));
  console.log('\n1. localStorage와 Supabase를 비교하세요');
  console.log('   - localStorage에만 있고 Supabase에 없다면: 첫 번째 신청이 저장 실패');
  console.log('   - 둘 다 있다면: 실제로 두 번 신청한 것일 수 있음');
  console.log('');
  console.log('2. 전화번호로 홈페이지 API 확인');
  console.log('   - 같은 전화번호로 회생터치3이 두 개 있는지 확인');
  console.log('   - 있다면 하나를 삭제해야 함');
  console.log('');
  console.log('3. 로그 확인');
  console.log('   - 서버 로그에서 "Supabase 저장 실패" 메시지 검색');
  console.log('   - 첫 번째 신청(00:00경)의 저장 실패 원인 확인');
  console.log('');
})();

// 홈페이지 API 확인 함수
window.checkHomepageAPI = async function(phone) {
  console.log(`\n🔍 홈페이지 API에서 ${phone} 검색 중...`);
  
  try {
    const response = await fetch('/api/homepage/checkDuplicate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phone.replace(/-/g, '') })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('결과:', result);
      
      if (result.isDuplicate) {
        console.log(`⚠️ 중복 발견! 총 ${result.duplicateCount}개의 상담이 있습니다.`);
        console.log('💡 홈페이지 관리자 페이지에서 케이스 목록을 확인하세요.');
      } else {
        console.log('✅ 중복 없음');
      }
    }
  } catch (error) {
    console.error('❌ 오류:', error);
  }
};

console.log('\n💡 사용 팁:');
console.log('  - 이 스크립트는 브라우저 콘솔에서만 실행됩니다.');
console.log('  - 관리자 대시보드 페이지에서 실행하는 것을 권장합니다.');
console.log('  - 전화번호를 알고 있다면: checkHomepageAPI("010-1234-5678")');




