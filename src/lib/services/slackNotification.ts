/**
 * 슬랙 알림 서비스
 */

import { API_CONFIG } from '@/lib/config/api';

export interface SlackNotificationData {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  details?: Record<string, any>;
  timestamp?: string;
}

// 오류 유형 분류 및 분석
interface ErrorAnalysis {
  type: 'AUTH' | 'NETWORK' | 'SERVER' | 'VALIDATION' | 'TIMEOUT' | 'UNKNOWN';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  solution: string;
  emoji: string;
}

export class SlackNotificationService {
  /**
   * 날짜를 YYYY-MM-DD HH:mm:ss 형식으로 변환
   */
  private static formatDateTime(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * 오류 분석 및 분류
   */
  private static analyzeError(error: string): ErrorAnalysis {
    const errorLower = error.toLowerCase();
    
    // 인증 오류
    if (errorLower.includes('401') || errorLower.includes('unauthorized') || errorLower.includes('token')) {
      return {
        type: 'AUTH',
        severity: 'HIGH',
        description: '인증 토큰 만료 또는 잘못된 토큰',
        solution: '새로운 토큰 발급 필요',
        emoji: '🔐'
      };
    }
    
    // 네트워크 오류
    if (errorLower.includes('network') || errorLower.includes('fetch') || errorLower.includes('connection')) {
      return {
        type: 'NETWORK',
        severity: 'MEDIUM',
        description: '네트워크 연결 문제',
        solution: '네트워크 상태 확인 또는 잠시 후 재시도',
        emoji: '🌐'
      };
    }
    
    // 서버 오류
    if (errorLower.includes('500') || errorLower.includes('502') || errorLower.includes('503') || errorLower.includes('504')) {
      return {
        type: 'SERVER',
        severity: 'HIGH',
        description: '홈페이지 서버 내부 오류',
        solution: '홈페이지 관리자에게 문의 필요',
        emoji: '🔥'
      };
    }
    
    // 타임아웃 오류
    if (errorLower.includes('timeout') || errorLower.includes('시간초과')) {
      return {
        type: 'TIMEOUT',
        severity: 'MEDIUM',
        description: '요청 시간 초과',
        solution: '서버 응답 속도 확인 필요',
        emoji: '⏰'
      };
    }
    
    // 유효성 검사 오류
    if (errorLower.includes('400') || errorLower.includes('bad request') || errorLower.includes('validation')) {
      return {
        type: 'VALIDATION',
        severity: 'MEDIUM',
        description: '요청 데이터 유효성 검사 실패',
        solution: '전송 데이터 형식 확인 필요',
        emoji: '📝'
      };
    }
    
    // 기타 알 수 없는 오류
    return {
      type: 'UNKNOWN',
      severity: 'MEDIUM',
      description: '알 수 없는 오류',
      solution: '개발팀 확인 필요',
      emoji: '❓'
    };
  }

  /**
   * 성공 알림 전송
   */
  static async sendSuccessNotification(data: {
    customerName: string;
    consultationType: string;
    acquisitionSource: string;
    attempts?: number;
    phone?: string;
    residence?: string;
    isDuplicate?: boolean;
    duplicateCount?: number;
    managerName?: string;
  }): Promise<void> {
    // 한국 시간(KST) 생성
    const kstTime = this.getKSTTime();
    let message: string;
    
    // 중복 등록인 경우 다른 형식의 메시지
    if (data.isDuplicate && data.managerName) {
      message = `:warning: 중복등록 :warning:\n등록일시 : ${kstTime}\n의뢰인 : ${data.customerName}\n전화번호 : ${data.phone || '정보 없음'}\n거주지 : ${data.residence || '정보 없음'}\n담당자 : ${data.managerName}`;
    } else if (data.isDuplicate) {
      // 담당자 정보를 못 가져온 경우
      message = `:warning: 중복등록 :warning:\n등록일시 : ${kstTime}\n의뢰인 : ${data.customerName}\n전화번호 : ${data.phone || '정보 없음'}\n거주지 : ${data.residence || '정보 없음'}\n담당자 : (조회 실패)`;
    } else {
      // 일반 등록
      message = `:bell: 신규 사건이 등록되었습니다 :bell:\n-----------------------------------------\n:date: 등록일시 : ${kstTime}\n:bust_in_silhouette: 의뢰인 : ${data.customerName}\n:telephone_receiver: 전화번호 : ${data.phone || '정보 없음'}\n:round_pushpin: 거주지 : ${data.residence || '정보 없음'}\n-----------------------------------------`;
    }

    try {
      const response = await fetch(API_CONFIG.SLACK_API.WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message
        }),
      });

      if (!response.ok) {
        throw new Error(`슬랙 알림 전송 실패: ${response.status} ${response.statusText}`);
      }

      console.log('✅ 슬랙 성공 알림 전송 완료');
    } catch (error) {
      console.error('❌ 슬랙 성공 알림 전송 오류:', error);
      throw error;
    }
  }

  /**
   * 오류 알림 전송 (간단한 형식)
   */
  static async sendErrorNotification(data: {
    customerName: string;
    consultationType: string;
    acquisitionSource: string;
    error: string;
    attempts: number;
    phone?: string;
    isDuplicate?: boolean;
    duplicateCount?: number;
  }): Promise<void> {
    const errorAnalysis = this.analyzeError(data.error);
    
    // 한국 시간(KST) 생성
    const kstTime = this.getKSTTime();
    
    // 중복 정보 표시
    const duplicateInfo = data.isDuplicate 
      ? `\n> :warning: 중복 신청 : ${data.duplicateCount}회차 신청` 
      : '';
    
    // 간단한 슬랙 메시지 형식으로 직접 전송 (blockquote 적용)
    const message = `:rotating_light: 상담신청 등록 실패 :rotating_light:\n> -----------------------------------------\n> :date: 실패시간 : ${kstTime}\n> -----------------------------------------\n> :clipboard: 고객 정보\n> 고객명 : ${data.customerName}\n> 상담유형 : ${data.consultationType}\n> 연락처 : ${data.phone || '정보 없음'}\n> 유입경로 : ${data.acquisitionSource}${duplicateInfo}\n> -----------------------------------------\n> :mag: 오류 분석\n> 오류유형 : ${errorAnalysis.emoji} ${errorAnalysis.type}\n> 심각도 : ${this.getSeverityEmoji(errorAnalysis.severity)} ${errorAnalysis.severity}\n> 오류설명 : ${errorAnalysis.description}\n> 해결방안 : ${errorAnalysis.solution}\n> -----------------------------------------\n> :rotating_light: 원본 오류\n> ${data.error}\n> -----------------------------------------`;

    try {
      const response = await fetch(API_CONFIG.SLACK_API.ERROR_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message
        }),
      });

      if (!response.ok) {
        throw new Error(`슬랙 오류 알림 전송 실패: ${response.status} ${response.statusText}`);
      }

      console.log('✅ 슬랙 오류 알림 전송 완료');
    } catch (error) {
      console.error('❌ 슬랙 오류 알림 전송 오류:', error);
      throw error;
    }
  }

  /**
   * 심각도별 이모지 반환
   */
  private static getSeverityEmoji(severity: string): string {
    switch (severity) {
      case 'CRITICAL': return '🔴';
      case 'HIGH': return '🟠';
      case 'MEDIUM': return '🟡';
      case 'LOW': return '🟢';
      default: return '⚪';
    }
  }

  /**
   * 한국 시간(KST) 문자열 생성
   */
  private static getKSTTime(): string {
    const now = new Date();
    const kstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000)); // UTC + 9시간
    
    const year = kstDate.getUTCFullYear();
    const month = String(kstDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(kstDate.getUTCDate()).padStart(2, '0');
    const hours = String(kstDate.getUTCHours()).padStart(2, '0');
    const minutes = String(kstDate.getUTCMinutes()).padStart(2, '0');
    const seconds = String(kstDate.getUTCSeconds()).padStart(2, '0');
    
    // 형식: 2025-10-30 13:22:45
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * 경고 알림 전송 (리트라이 중)
   */
  static async sendWarningNotification(data: {
    customerName: string;
    consultationType: string;
    acquisitionSource: string;
    error: string;
    currentAttempt: number;
    maxAttempts: number;
  }): Promise<void> {
    const notification: SlackNotificationData = {
      type: 'warning',
      title: '⚠️ 홈페이지 상담신청 등록 재시도 중',
      message: `상담신청 홈페이지 등록 중 오류가 발생하여 재시도 중입니다.`,
      details: {
        고객명: data.customerName,
        상담유형: data.consultationType,
        유입경로: data.acquisitionSource,
        오류내용: data.error,
        현재시도: `${data.currentAttempt}/${data.maxAttempts}`,
        재시도시간: this.formatDateTime()
      }
    };

    await this.sendToSlack(notification, API_CONFIG.SLACK_API.WEBHOOK_URL);
  }

  /**
   * 슬랙으로 메시지 전송
   */
  private static async sendToSlack(notification: SlackNotificationData, webhookUrl: string): Promise<void> {
    console.log('🔍 슬랙 알림 전송 시작:', { 
      type: notification.type, 
      title: notification.title,
      webhookUrl: webhookUrl ? `${webhookUrl.substring(0, 50)}...` : '없음' 
    });
    
    if (!webhookUrl) {
      console.warn('❌ 슬랙 웹훅 URL이 설정되지 않았습니다.');
      console.log('🔧 환경변수 확인:', {
        NEXT_PUBLIC_SLACK_WEBHOOK_URL: process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL ? '설정됨' : '없음',
        NEXT_PUBLIC_SLACK_ERROR_WEBHOOK_URL: process.env.NEXT_PUBLIC_SLACK_ERROR_WEBHOOK_URL ? '설정됨' : '없음'
      });
      return;
    }

    try {
      const color = this.getColorByType(notification.type);
      const emoji = this.getEmojiByType(notification.type);
      
      const slackMessage = {
        text: `${emoji} ${notification.title}`,
        attachments: [
          {
            color: color,
            title: notification.title,
            text: notification.message,
            fields: notification.details ? Object.entries(notification.details).map(([key, value]) => ({
              title: key,
              value: String(value),
              short: true
            })) : [],
            footer: '회생터치 시스템',
            ts: Math.floor(Date.now() / 1000)
          }
        ]
      };

      console.log('📤 슬랙 메시지 전송:', JSON.stringify(slackMessage, null, 2));

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slackMessage),
      });

      console.log('📨 슬랙 응답:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ 슬랙 응답 오류:', errorText);
        throw new Error(`슬랙 알림 전송 실패: ${response.status} ${response.statusText}`);
      }

      console.log('✅ 슬랙 알림 전송 성공:', notification.type);
      
    } catch (error) {
      console.error('❌ 슬랙 알림 전송 오류:', error);
      // 슬랙 알림 실패는 메인 프로세스에 영향을 주지 않음
    }
  }

  /**
   * 알림 타입별 색상 반환
   */
  private static getColorByType(type: SlackNotificationData['type']): string {
    switch (type) {
      case 'success': return 'good';
      case 'error': return 'danger';
      case 'warning': return 'warning';
      case 'info': return '#36a64f';
      default: return '#36a64f';
    }
  }

  /**
   * 알림 타입별 이모지 반환
   */
  private static getEmojiByType(type: SlackNotificationData['type']): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '🚨';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  }
}
