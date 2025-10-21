import { NextResponse } from 'next/server';
import { SupabaseDiagnosisService } from '@/lib/supabase/diagnosisService';
import { DiagnosisRecord } from '@/lib/diagnosis/database';

export async function POST(request: Request) {
  console.log('🔍 서버사이드 Supabase 저장 API 호출');
  
  try {
    const record: DiagnosisRecord = await request.json();
    console.log('📥 받은 레코드:', record);

    // 서버에서 Supabase에 저장
    const result = await SupabaseDiagnosisService.saveRecord(record);
    
    if (result.success) {
      console.log('✅ Supabase 저장 성공');
      return NextResponse.json({ 
        success: true, 
        data: result.data
      });
    } else {
      console.error('❌ Supabase 저장 실패:', result.error);
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('❌ 서버사이드 Supabase 저장 중 오류 발생:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || '알 수 없는 오류' 
    }, { status: 500 });
  }
}

