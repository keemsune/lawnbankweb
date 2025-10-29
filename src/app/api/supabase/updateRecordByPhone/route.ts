import { NextResponse } from 'next/server';
import { SupabaseDiagnosisService } from '@/lib/supabase/diagnosisService';

export async function POST(request: Request) {
  console.log('🔍 서버사이드 Supabase 업데이트 API 호출 (전화번호 기반)');
  
  try {
    const data = await request.json();
    console.log('📥 받은 업데이트 데이터:', data);

    const { phone, ...updateData } = data;

    if (!phone) {
      return NextResponse.json({ 
        success: false, 
        error: '전화번호가 필요합니다.' 
      }, { status: 400 });
    }

    // 전화번호로 가장 최근 레코드 찾기
    const allRecords = await SupabaseDiagnosisService.getAllRecords();
    const matchingRecords = allRecords
      .filter(record => record.phone === phone)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    if (matchingRecords.length === 0) {
      console.log('⚠️ 전화번호로 레코드를 찾을 수 없습니다:', phone);
      return NextResponse.json({ 
        success: false, 
        error: '레코드를 찾을 수 없습니다.' 
      }, { status: 404 });
    }

    const latestRecord = matchingRecords[0];
    console.log('✅ 찾은 레코드 ID:', latestRecord.id);

    // 서버에서 Supabase 업데이트
    const result = await SupabaseDiagnosisService.updateRecord(latestRecord.id, updateData);
    
    if (result.success) {
      console.log('✅ Supabase 업데이트 성공');
      return NextResponse.json({ 
        success: true
      });
    } else {
      console.error('❌ Supabase 업데이트 실패:', result.error);
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('❌ 서버사이드 Supabase 업데이트 중 오류 발생:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || '알 수 없는 오류' 
    }, { status: 500 });
  }
}

