'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { HomepageApiService } from '@/lib/services/homepageApi';
import { updateApiConfig } from '@/lib/config/api';

export default function ApiTestPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testHomepageApi = async () => {
    setIsLoading(true);
         setTestResult('🚀 리트라이 시스템 테스트 중...\n최대 3회 시도합니다.\n슬랙 알림: 성공 시 일반 알림, 최종 실패 시 오류 알림 전송');
    
    try {
      const testData = {
        consultationType: 'phone' as const,
        contact: '010-1234-5678',
        residence: 'seoul',
        acquisitionSource: 'API_테스트'
      };
      
      console.log('🔄 리트라이 시스템 API 테스트 시작:', testData);
      console.log('📝 개발자 도구 콘솔에서 리트라이 과정을 실시간으로 확인하세요.');
      
      const result = await HomepageApiService.createCase(testData);
      
           setTestResult(`✅ API 테스트 성공! (리트라이 시스템 적용)\n\n📊 응답 데이터:\n${JSON.stringify(result, null, 2)}\n\n🔍 상세 로그:\n- 개발자 도구 콘솔에서 리트라이 과정 확인\n- 성공 시 슬랙 성공 알림 전송 ✅\n- 성공까지의 시도 횟수 확인`);
    } catch (error) {
      console.error('API 테스트 실패:', error);
      setTestResult(`❌ API 테스트 실패! (리트라이 시스템 적용)\n\n🚨 오류 내용:\n${error instanceof Error ? error.message : String(error)}\n\n🔍 상세 정보:\n- 총 3회 시도 후 실패\n- 개발자 도구 콘솔에서 각 시도별 로그 확인\n- 슬랙 오류 알림 전송 여부 확인`);
    } finally {
      setIsLoading(false);
    }
  };

  const testConnectionOnly = async () => {
    setIsLoading(true);
    setTestResult('연결 테스트 중...');
    
    try {
      const isConnected = await HomepageApiService.testConnection();
      setTestResult(isConnected ? '✅ 연결 테스트 성공!' : '❌ 연결 테스트 실패!');
    } catch (error) {
      setTestResult(`❌ 연결 테스트 실패!\n오류: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testRetrySystem = async () => {
    setIsLoading(true);
    setTestResult('🔄 리트라이 시스템 강제 실패 테스트 중...\n잘못된 토큰으로 3회 시도합니다.');
    
    try {
      // 원본 토큰 백업
      const originalToken = updateApiConfig;
      
      // 잘못된 토큰으로 임시 변경
      updateApiConfig.setHomepageToken('invalid_token_for_retry_test');
      
      console.log('🚨 리트라이 시스템 강제 실패 테스트 시작');
      console.log('📝 개발자 도구 콘솔에서 3회 시도 과정을 확인하세요.');
      
      const testData = {
        consultationType: 'phone' as const,
        contact: '010-1234-5678',
        residence: 'seoul',
        acquisitionSource: 'RETRY_테스트'
      };
      
      await HomepageApiService.createCase(testData);
      
      setTestResult('❓ 예상치 못한 성공 - 이 메시지가 나오면 안됩니다.');
      
    } catch (error) {
      console.log('✅ 리트라이 시스템 테스트 완료 - 예상된 실패');
      setTestResult(`✅ 리트라이 시스템 정상 작동!\n\n🔍 테스트 결과:\n- 총 3회 시도 후 실패 (정상)\n- 각 시도별 로그 콘솔에서 확인\n- 슬랙 오류 알림 전송됨 (설정된 경우)\n\n🚨 실패 내용:\n${error instanceof Error ? error.message : String(error)}\n\n💡 이제 토큰을 원래대로 복구하고 정상 테스트를 해보세요.`);
    } finally {
      // 토큰 원복 (실제 토큰으로)
      updateApiConfig.setHomepageToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjIxNzgsImlkIjoibGF3YW5kZmlybV9zMjAwIiwidmVyIjo2MjcwNzQsImF1ZCI6ImxmdyIsImV4cCI6NDg5Mjc3NTgyOSwiaXNzIjoibGVnYWxmbG93In0.Y7MOGguajJaLdxFLgfPs_I8iOmhzysjYIX1xIQJTr9o');
      setIsLoading(false);
    }
  };

  const testSlackNotification = async () => {
    setIsLoading(true);
    setTestResult('📢 슬랙 알림 테스트 중...');
    
    try {
      const { SlackNotificationService } = await import('@/lib/services/slackNotification');
      
      // 테스트 오류 알림 전송
      await SlackNotificationService.sendErrorNotification({
        customerName: '테스트고객',
        consultationType: '전화상담',
        acquisitionSource: '슬랙_테스트',
        error: 'HTTP Error: 401 Unauthorized - 테스트용 오류입니다',
        attempts: 3
      });
      
      setTestResult(`✅ 슬랙 알림 테스트 성공!\n\n📢 전송된 내용:\n- 오류 유형: 🔐 AUTH\n- 심각도: 🟠 HIGH\n- 고객명: 테스트고객\n- 상담유형: 전화상담\n- 유입경로: 슬랙_테스트\n\n💡 슬랙 채널에서 알림을 확인해보세요!`);
      
    } catch (error) {
      console.error('슬랙 알림 테스트 실패:', error);
      setTestResult(`❌ 슬랙 알림 테스트 실패!\n\n🔍 확인사항:\n1. .env.local 파일에 NEXT_PUBLIC_SLACK_WEBHOOK_URL 설정 확인\n2. 웹훅 URL이 올바른지 확인\n3. 슬랙 앱 권한 설정 확인\n\n🚨 오류 내용:\n${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testSlackServerSide = async () => {
    setIsLoading(true);
    setTestResult('🔄 서버사이드 슬랙 알림 테스트 중...');
    
    try {
      const response = await fetch('/api/slack/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        setTestResult(`✅ 서버사이드 슬랙 알림 테스트 성공!\n\n📢 결과:\n${result.message}\n\n💡 슬랙 채널에서 알림을 확인해보세요!\n\n🔍 서버 콘솔에서 상세 로그를 확인할 수 있습니다.`);
      } else {
        setTestResult(`❌ 서버사이드 슬랙 알림 테스트 실패!\n\n🚨 오류:\n${result.error}\n\n🔍 서버 콘솔에서 상세 로그를 확인해보세요.`);
      }
    } catch (error) {
      console.error('서버사이드 슬랙 테스트 실패:', error);
      setTestResult(`❌ 서버사이드 슬랙 알림 테스트 실패!\n\n🚨 네트워크 오류:\n${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <div className="py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">API 연동 테스트</h1>
          <p className="text-gray-600">홈페이지 API 연동 상태를 테스트할 수 있습니다.</p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Button
              onClick={testConnectionOnly}
              disabled={isLoading}
              variant="secondary"
            >
              {isLoading ? '테스트 중...' : '연결 테스트'}
            </Button>

            <Button
              onClick={testHomepageApi}
              disabled={isLoading}
              variant="primary"
            >
              {isLoading ? '테스트 중...' : '전체 API 테스트'}
            </Button>

            <Button
              onClick={testRetrySystem}
              disabled={isLoading}
              variant="destructive"
            >
              {isLoading ? '테스트 중...' : '🔄 리트라이 시스템 테스트'}
            </Button>

            <Button
              onClick={testSlackNotification}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? '테스트 중...' : '📢 슬랙 알림 테스트 (클라이언트)'}
            </Button>

            <Button
              onClick={testSlackServerSide}
              disabled={isLoading}
              variant="secondary"
            >
              {isLoading ? '테스트 중...' : '🔧 슬랙 알림 테스트 (서버)'}
            </Button>
          </div>

          {testResult && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">테스트 결과</h2>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm whitespace-pre-wrap overflow-auto">
                {testResult}
              </pre>
            </div>
          )}
        </div>

        <div className="border-t pt-8">
          <h2 className="text-xl font-semibold mb-4">API 정보 및 리트라이 시스템</h2>
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="font-semibold text-yellow-800 mb-2">🧪 리트라이 시스템 테스트 방법</div>
            <div className="text-sm text-yellow-700">
              <div><strong>"🔄 리트라이 시스템 테스트" 버튼:</strong> 잘못된 토큰으로 의도적 실패 유발</div>
              <div><strong>확인사항:</strong> 개발자 도구 콘솔에서 "1/3", "2/3", "3/3" 시도 로그 확인</div>
              <div><strong>예상결과:</strong> 3회 시도 후 실패, 슬랙 상세 오류 알림 전송</div>
            </div>
          </div>
          
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="font-semibold text-blue-800 mb-2">🔍 슬랙 오류 알림 상세 정보</div>
            <div className="text-sm text-blue-700 space-y-1">
              <div><strong>오류 분류:</strong> AUTH(인증), NETWORK(네트워크), SERVER(서버), VALIDATION(유효성), TIMEOUT(시간초과)</div>
              <div><strong>심각도:</strong> 🔴 CRITICAL, 🟠 HIGH, 🟡 MEDIUM, 🟢 LOW</div>
              <div><strong>포함 정보:</strong> 고객정보, 오류분석, 해결방안, 시도정보, 원본오류</div>
            </div>
          </div>
          
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="font-semibold text-green-800 mb-2">📢 슬랙 알림 설정 방법</div>
            <div className="text-sm text-green-700 space-y-1">
              <div><strong>1단계:</strong> 슬랙 앱 생성 (https://api.slack.com/apps)</div>
              <div><strong>2단계:</strong> Incoming Webhooks 활성화</div>
              <div><strong>3단계:</strong> .env.local에 NEXT_PUBLIC_SLACK_WEBHOOK_URL 설정</div>
              <div><strong>4단계:</strong> "📢 슬랙 알림 테스트" 버튼으로 테스트</div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div><strong>엔드포인트:</strong> POST https://www.legalfriends.co.kr/api/bankruptcy/case/createForLawn</div>
            <div><strong>인증:</strong> Bearer Token 방식</div>
            <div><strong>Content-Type:</strong> application/json</div>
                   <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                     <div className="font-semibold text-blue-800 mb-2">🔄 리트라이 시스템</div>
                     <div><strong>최대 시도 횟수:</strong> 3회 (원시도 + 2회 리트라이)</div>
                     <div><strong>재시도 간격:</strong> 1초</div>
                     <div><strong>슬랙 알림:</strong> 성공 시 일반 알림, 최종 실패 시 오류 알림</div>
                     <div><strong>프로세스:</strong> 원시도 → 1차 리트라이 → 2차 리트라이</div>
                   </div>
          </div>
        </div>

        <div className="border-t pt-8">
          <h2 className="text-xl font-semibold mb-4">전송 데이터 예시</h2>
        <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
{JSON.stringify({
  case_type: 1,
  name: "회생터치1",
  phone: "010-1234-5678",
  living_place: "서울특별시",
  memo: "신청시간: 2024-09-25 14:30:00\\n고객이름: 회생터치1\\n거주지역: 서울특별시\\n상담유형: 전화상담"
}, null, 2)}
        </pre>
        </div>
      </div>
    </Container>
  );
}
