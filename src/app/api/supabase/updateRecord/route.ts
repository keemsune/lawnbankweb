import { NextResponse } from 'next/server';
import { SupabaseDiagnosisService } from '@/lib/supabase/diagnosisService';

export async function POST(request: Request) {
  console.log('🔍 서버사이드 Supabase 업데이트 API 호출');
  
  try {
    const data = await request.json();
    console.log('📥 받은 업데이트 데이터:', data);

    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'ID가 필요합니다.' 
      }, { status: 400 });
    }

    // 서버에서 Supabase 업데이트
    const result = await SupabaseDiagnosisService.updateRecord(id, updateData);
    
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

