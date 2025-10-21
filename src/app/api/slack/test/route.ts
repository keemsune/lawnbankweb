import { NextRequest, NextResponse } from 'next/server';
import { SlackNotificationService } from '@/lib/services/slackNotification';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 서버사이드 슬랙 테스트 API 호출');
    
    // 테스트 오류 알림 전송
    await SlackNotificationService.sendErrorNotification({
      customerName: '테스트고객',
      consultationType: '전화상담',
      acquisitionSource: '서버사이드_테스트',
      error: 'HTTP Error: 401 Unauthorized - 서버사이드 테스트용 오류입니다',
      attempts: 3
    });

    return NextResponse.json({ 
      success: true, 
      message: '슬랙 알림이 성공적으로 전송되었습니다!' 
    });

  } catch (error) {
    console.error('서버사이드 슬랙 테스트 실패:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
