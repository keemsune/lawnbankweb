/**
 * API 설정 관리
 */

export const API_CONFIG = {
  // 홈페이지 API 설정
  HOMEPAGE_API: {
    BASE_URL: 'http://dev.legalflow.co.kr',
    ENDPOINT: '/api/bankruptcy/case/createForLawn',
    TOKEN: process.env.NEXT_PUBLIC_HOMEPAGE_API_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjIxNzgsImlkIjoibGF3YW5kZmlybV9zMjAwIiwidmVyIjo2MjcwNzQsImF1ZCI6ImxmdyIsImV4cCI6NDg5Mjc3NTgyOSwiaXNzIjoibGVnYWxmbG93In0.Y7MOGguajJaLdxFLgfPs_I8iOmhzysjYIX1xIQJTr9o', // 개발 서버 토큰
  },
  
  // 슬랙 API 설정 (향후 사용)
  SLACK_API: {
    WEBHOOK_URL: process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL || '',
    ERROR_WEBHOOK_URL: process.env.NEXT_PUBLIC_SLACK_ERROR_WEBHOOK_URL || '',
  },
  
  // API 공통 설정
  COMMON: {
    TIMEOUT: 10000, // 10초 타임아웃
    RETRY_COUNT: 3, // 재시도 횟수
    RETRY_DELAY: 1000, // 재시도 간격 (ms)
  }
};

/**
 * API 설정 업데이트 (런타임에서 토큰 변경 등)
 */
export const updateApiConfig = {
  setHomepageToken: (token: string) => {
    API_CONFIG.HOMEPAGE_API.TOKEN = token;
  },
  
  setSlackWebhookUrl: (url: string) => {
    API_CONFIG.SLACK_API.WEBHOOK_URL = url;
  },
  
  setSlackErrorWebhookUrl: (url: string) => {
    API_CONFIG.SLACK_API.ERROR_WEBHOOK_URL = url;
  }
};
