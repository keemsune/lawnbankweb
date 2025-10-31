import { NextResponse } from 'next/server';
import { HomepageApiService } from '@/lib/services/homepageApi';

export async function POST(request: Request) {
  console.log('🔍 서버사이드 중복 체크 API 호출');
  
  try {
    const { phone } = await request.json();
    console.log('📥 받은 전화번호:', phone);

    if (!phone) {
      return NextResponse.json({ 
        success: false, 
        error: '전화번호가 필요합니다.' 
      }, { status: 400 });
    }

    // 홈페이지 API에서 케이스 리스트 조회
    const caseListResponse = await HomepageApiService.getCaseList(phone);
    
    if (caseListResponse.code === 0 && caseListResponse.data) {
      const count = caseListResponse.data.total_cnt || 0;
      console.log('✅ 중복 체크 결과:', { phone, count, isDuplicate: count > 0 });
      
      return NextResponse.json({ 
        success: true,
        isDuplicate: count > 0,
        duplicateCount: count + 1 // 현재 신청 포함
      });
    } else {
      console.log('⚠️ 홈페이지 API 응답 오류');
      return NextResponse.json({ 
        success: true,
        isDuplicate: false,
        duplicateCount: 1
      });
    }
    
  } catch (error: any) {
    console.error('❌ 서버사이드 중복 체크 중 오류 발생:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || '알 수 없는 오류',
      isDuplicate: false,
      duplicateCount: 1
    }, { status: 500 });
  }
}

