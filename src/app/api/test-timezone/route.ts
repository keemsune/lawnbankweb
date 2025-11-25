import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    // 현재 서버 시간
    const now = new Date();
    const serverTime = now.toISOString();
    const serverLocalTime = now.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    
    // 간단한 테스트 데이터 삽입
    const testData = {
      customer_name: 'TIMEZONE_TEST_' + Date.now(),
      phone: '010-0000-0000',
      residence: 'seoul',
      acquisition_source: 'test',
      test_answers: null,
      debt_info: null,
      is_duplicate: false,
      duplicate_count: 0,
    };
    
    console.log('🕐 서버 시간:', serverTime);
    console.log('🕐 서버 로컬 시간:', serverLocalTime);
    console.log('📤 전송 데이터:', testData);
    
    const { data, error } = await supabase
      .from('consultation_records')
      .insert([testData])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    console.log('📥 저장된 데이터:', data);
    
    // PostgreSQL timezone 설정 확인
    const { data: tzData, error: tzError } = await supabase.rpc('get_timezone');
    
    return NextResponse.json({
      success: true,
      serverTime,
      serverLocalTime,
      savedData: data,
      postgresqlTimezone: tzData,
      comparison: {
        serverTime: serverTime,
        savedCreatedAt: data?.created_at,
        difference: data?.created_at ? new Date(data.created_at).getTime() - now.getTime() : null
      }
    });
    
  } catch (error: any) {
    console.error('❌ 테스트 실패:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

