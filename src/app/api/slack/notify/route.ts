import { NextResponse } from 'next/server';
import { SlackNotificationService } from '@/lib/services/slackNotification';
import { HomepageApiService } from '@/lib/services/homepageApi';

export async function POST(request: Request) {
  console.log('🔍 서버사이드 슬랙 알림 API 호출');
  
  try {
    const data = await request.json();
    console.log('📥 받은 데이터:', data);

    if (data.type === 'success') {
      // 중복인 경우 담당자 조회
      let managerName = '';
      if (data.isDuplicate && data.phone) {
        console.log('🔔 중복 감지 - 담당자 조회 시작 (전화번호:', data.phone, ')');
        try {
          managerName = await HomepageApiService.getDuplicateManagerName(data.phone);
          console.log('✅ 조회된 담당자:', managerName || '(없음)');
        } catch (error) {
          console.error('❌ 담당자 조회 실패:', error);
        }
      }

      await SlackNotificationService.sendSuccessNotification({
        customerName: data.customerName,
        consultationType: data.consultationType,
        acquisitionSource: data.acquisitionSource,
        attempts: data.attempts,
        phone: data.phone,
        residence: data.residence,
        isDuplicate: data.isDuplicate,
        duplicateCount: data.duplicateCount,
        managerName: managerName
      });
      
      return NextResponse.json({ 
        success: true, 
        message: `슬랙 성공 알림 전송 완료 (${data.customerName})` 
      });
      
    } else if (data.type === 'error') {
      await SlackNotificationService.sendErrorNotification({
        customerName: data.customerName,
        consultationType: data.consultationType,
        acquisitionSource: data.acquisitionSource,
        error: data.error,
        attempts: data.attempts,
        phone: data.phone,
        isDuplicate: data.isDuplicate,
        duplicateCount: data.duplicateCount
      });
      
      return NextResponse.json({ 
        success: true, 
        message: `슬랙 오류 알림 전송 완료 (${data.customerName})` 
      });
      
    } else {
      return NextResponse.json({ 
        success: false, 
        error: '지원하지 않는 알림 타입입니다.' 
      }, { status: 400 });
    }
    
  } catch (error: any) {
    console.error('❌ 서버사이드 슬랙 알림 중 오류 발생:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || '알 수 없는 오류' 
    }, { status: 500 });
  }
}
