import { NextResponse } from 'next/server';
import { HomepageApiService, ConsultationData } from '@/lib/services/homepageApi';

export async function POST(request: Request) {
  console.log('🔍 서버사이드 홈페이지 API 호출');
  
  try {
    const consultationData: ConsultationData = await request.json();
    console.log('📥 받은 상담 데이터:', consultationData);

    // 서버에서 홈페이지 API 호출
    const result = await HomepageApiService.createCase(consultationData);
    
    return NextResponse.json({ 
      success: true, 
      data: result
    });
    
  } catch (error: any) {
    console.error('❌ 서버사이드 홈페이지 API 호출 중 오류 발생:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || '알 수 없는 오류' 
    }, { status: 500 });
  }
}

