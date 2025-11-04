/**
 * 홈페이지 API 연동 서비스
 * 상담신청 데이터를 자사 홈페이지에 글로 등록
 */

import { API_CONFIG } from '@/lib/config/api';

export interface HomepageApiRequest {
  case_type: 1 | 2 | 3;  // 1: 개인회생, 2: 개인파산, 3: 기타
  name: string;          // 고객 이름
  phone: string;         // 고객 전화번호
  living_place: string;  // 고객 거주 지역
  memo: string;          // 상담 관련 메모
}

export interface HomepageApiResponse {
  code: number;
  msg: string;
  data: any;
}

export interface ConsultationData {
  consultationType: 'phone' | 'visit';
  contact: string;
  residence: string;
  acquisitionSource?: string;
  isDuplicate?: boolean;
  duplicateCount?: number;
  consultationName?: string; // 미리 생성된 회생터치 번호
  diagnosisData?: {
    maritalStatus?: string;
    children?: string;
    income?: string;
    assets?: string;
    debt?: string;
    recommendation?: string;
    monthlyPayment36?: number;
    monthlyPayment60?: number;
    reductionRate?: number;
  };
}

export interface CaseListRequest {
  page_size: number;
  selected_page: number;
  search_key: string;
  search_opt: number;
  filter_casetype: number;
  filter_progress: number;
  filter_manager: string;
  filter_court_code: string;
  filter_sub_manager: string;
  filter_sub_manager2: string;
  filter_close_type: number;
  filter_nopay_3int: boolean;
}

export interface CaseItem {
  case_id: number;
  manager_idx: number;
  manager: string;
  client_name: string;
  client_phone: string;
  create_dt: string;
  update_dt: string;
}

export interface CaseListResponse {
  code: number;
  msg: string;
  data: {
    total_cnt: number;
    list: CaseItem[];
  };
}

export interface UserItem {
  idx: number;
  name: string;
  id: string;
}

export interface UserListResponse {
  code: number;
  msg: string;
  data: {
    list: UserItem[];
  };
}

export class HomepageApiService {
  private static get API_URL() {
    return `${API_CONFIG.HOMEPAGE_API.BASE_URL}${API_CONFIG.HOMEPAGE_API.ENDPOINT}`;
  }
  
  private static get TOKEN() {
    return API_CONFIG.HOMEPAGE_API.TOKEN;
  }
  
  /**
   * 상담신청 데이터를 홈페이지 API로 전송 (리트라이 시스템 포함)
   */
  static async createCase(consultationData: ConsultationData): Promise<HomepageApiResponse> {
    const maxRetries = API_CONFIG.COMMON.RETRY_COUNT;
    const retryDelay = API_CONFIG.COMMON.RETRY_DELAY;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`홈페이지 API 호출 시도 ${attempt}/${maxRetries}`);
        console.log('🔑 사용 중인 토큰:', this.TOKEN.substring(0, 50) + '...');
        
        // 상담 데이터를 홈페이지 API 형식으로 변환
        const apiRequest = await this.transformToApiRequest(consultationData);
        
        console.log('홈페이지 API 요청:', apiRequest);
        
        const response = await fetch(this.API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.TOKEN,
          },
          body: JSON.stringify(apiRequest),
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const result: HomepageApiResponse = await response.json();
        
        console.log('홈페이지 API 응답:', result);
        console.log('응답 상태:', response.status);
        console.log('응답 헤더:', Object.fromEntries(response.headers.entries()));
        
        if (result.code !== 0) {
          console.error('API 오류 상세:', {
            code: result.code,
            message: result.msg,
            data: result.data,
            requestData: apiRequest,
            attempt: attempt
          });
          throw new Error(`API Error: ${result.code} - ${result.msg}`);
        }
        
        // 성공 시 로그만 출력 (슬랙 알림 제거)
        console.log(`✅ 홈페이지 API 호출 성공 (${attempt}번째 시도)`);
        console.log('📝 등록된 고객:', apiRequest.name);
        console.log('📞 연락처:', apiRequest.phone);
        console.log('📍 거주지:', apiRequest.living_place);
        
        return result;
        
      } catch (error) {
        console.error(`홈페이지 API 호출 실패 (${attempt}번째 시도):`, error);
        
        const errorMessage = error instanceof Error ? error.message : String(error);
        const apiRequest = await this.transformToApiRequest(consultationData);
        
        // 마지막 시도인 경우 최종 실패 알림 및 에러 던지기
        if (attempt === maxRetries) {
          console.error(`홈페이지 API 호출 최종 실패 (총 ${maxRetries}회 시도)`);
          
          // 서버사이드 최종 실패 알림 전송 (CORS 우회)
          this.sendServerSideSlackNotification({
            type: 'error',
            customerName: apiRequest.name,
            consultationType: consultationData.consultationType === 'phone' ? '전화상담' : '방문상담',
            acquisitionSource: consultationData.acquisitionSource || '기타',
            error: errorMessage,
            attempts: maxRetries,
            phone: apiRequest.phone,
            residence: apiRequest.living_place,
            isDuplicate: consultationData.isDuplicate,
            duplicateCount: consultationData.duplicateCount
          }).catch(slackError => console.error('슬랙 오류 알림 전송 실패:', slackError));
          
          throw new Error(`홈페이지 API 호출 실패 (${maxRetries}회 시도 후): ${errorMessage}`);
        }
        
        // 다음 시도 전 대기 (재시도 경고 알림 없음)
        console.log(`${retryDelay}ms 후 재시도...`);
        await this.delay(retryDelay);
      }
    }
    
    // 이 코드는 실행되지 않지만 TypeScript를 위해 추가
    throw new Error('예상치 못한 오류가 발생했습니다.');
  }
  
  /**
   * 지연 함수 (리트라이 간격 조절용)
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 서버사이드 슬랙 알림 전송 (직접 호출)
   */
  private static async sendServerSideSlackNotification(data: {
    type: 'success' | 'error';
    customerName: string;
    consultationType: string;
    acquisitionSource: string;
    error?: string;
    attempts: number;
    phone?: string;
    residence?: string;
    isDuplicate?: boolean;
    duplicateCount?: number;
    managerName?: string;
  }): Promise<void> {
    try {
      // 서버사이드에서는 SlackNotificationService를 직접 호출
      const { SlackNotificationService } = await import('./slackNotification');
      
      if (data.type === 'success') {
        await SlackNotificationService.sendSuccessNotification({
          customerName: data.customerName,
          consultationType: data.consultationType,
          acquisitionSource: data.acquisitionSource,
          attempts: data.attempts,
          phone: data.phone,
          residence: data.residence,
          isDuplicate: data.isDuplicate,
          duplicateCount: data.duplicateCount,
          managerName: data.managerName
        });
      } else {
        await SlackNotificationService.sendErrorNotification({
          customerName: data.customerName,
          consultationType: data.consultationType,
          acquisitionSource: data.acquisitionSource,
          error: data.error || '알 수 없는 오류',
          attempts: data.attempts,
          phone: data.phone,
          isDuplicate: data.isDuplicate,
          duplicateCount: data.duplicateCount
        });
      }
      
      console.log('서버사이드 슬랙 알림 전송 성공');
    } catch (error) {
      console.error('서버사이드 슬랙 알림 전송 오류:', error);
      // 슬랙 알림 실패는 메인 프로세스에 영향을 주지 않음
    }
  }
  
  /**
   * 케이스 리스트 조회 (전화번호로 검색)
   */
  static async getCaseList(phone: string): Promise<CaseListResponse> {
    try {
      const requestBody: CaseListRequest = {
        page_size: 10,
        selected_page: 1,
        search_key: phone.replace(/-/g, ''), // 하이픈 제거
        search_opt: 1,
        filter_casetype: 0,
        filter_progress: 0,
        filter_manager: '',
        filter_court_code: '',
        filter_sub_manager: '',
        filter_sub_manager2: '',
        filter_close_type: 0,
        filter_nopay_3int: false
      };

      console.log('📋 케이스 리스트 조회 요청:', {
        url: `${API_CONFIG.HOMEPAGE_API.BASE_URL}/api/bankruptcy/case/list`,
        search_key: requestBody.search_key
      });

      const response = await fetch(`${API_CONFIG.HOMEPAGE_API.BASE_URL}/api/bankruptcy/case/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.TOKEN,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('케이스 리스트 조회 HTTP 오류:', response.status, errorText);
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const result: CaseListResponse = await response.json();
      console.log('✅ 케이스 리스트 응답:', {
        code: result.code,
        total_cnt: result.data?.total_cnt,
        list_length: result.data?.list?.length
      });

      return result;
    } catch (error) {
      console.error('❌ 케이스 리스트 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 담당자(관리자) 리스트 조회 (ftype=2)
   */
  static async getUserList(): Promise<UserListResponse> {
    try {
      console.log('👥 담당자 리스트 조회 요청:', {
        url: `${API_CONFIG.HOMEPAGE_API.BASE_URL}/api/comm/case/list_filter?ftype=2`
      });

      const response = await fetch(`${API_CONFIG.HOMEPAGE_API.BASE_URL}/api/comm/case/list_filter?ftype=2`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.TOKEN,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('담당자 리스트 조회 HTTP 오류:', response.status, errorText);
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const result: UserListResponse = await response.json();
      console.log('✅ 담당자 리스트 전체 응답:', result);
      console.log('📊 담당자 리스트 요약:', {
        code: result.code,
        msg: result.msg,
        data_exists: !!result.data,
        list_length: result.data?.list?.length
      });

      return result;
    } catch (error) {
      console.error('❌ 담당자 리스트 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 중복 케이스의 담당자 이름 조회
   */
  static async getDuplicateManagerName(phone: string): Promise<string> {
    try {
      console.log('🔍 중복 케이스 담당자 조회 시작:', phone);
      
      // 1. 케이스 리스트 조회
      const caseListResponse = await this.getCaseList(phone);
      
      if (caseListResponse.code !== 0) {
        console.log('❌ 케이스 리스트 조회 실패 - code:', caseListResponse.code, 'msg:', caseListResponse.msg);
        return '';
      }
      
      if (!caseListResponse.data?.list || caseListResponse.data.list.length === 0) {
        console.log('⚠️ 케이스 리스트가 비어있음');
        return '';
      }

      // 2. 가장 최신 케이스 찾기 (create_dt 기준 정렬)
      // 현재 등록된 건(가장 최신)을 제외하고 그 이전 건에서 담당자를 찾음
      const sortedCases = [...caseListResponse.data.list].sort((a, b) => {
        return new Date(b.create_dt).getTime() - new Date(a.create_dt).getTime();
      });
      
      // 2개 이상인 경우 두 번째로 최신인 케이스 사용 (첫 번째는 방금 등록된 것)
      const previousCase = sortedCases.length >= 2 ? sortedCases[1] : sortedCases[0];
      console.log('📌 이전 중복 케이스 (담당자 조회용):', {
        case_id: previousCase.case_id,
        client_name: previousCase.client_name,
        manager_idx: previousCase.manager_idx,
        manager: previousCase.manager,
        create_dt: previousCase.create_dt,
        total_cases: sortedCases.length
      });

      // 3. manager_idx가 있으면 담당자 리스트에서 이름 조회
      if (previousCase.manager_idx) {
        console.log('🔎 manager_idx로 담당자 조회:', previousCase.manager_idx);
        const userListResponse = await this.getUserList();
        
        if (userListResponse.code === 0 && userListResponse.data?.list) {
          console.log('👥 담당자 리스트에서 검색 중... (총', userListResponse.data.list.length, '명)');
          const manager = userListResponse.data.list.find(user => user.idx === previousCase.manager_idx);
          
          if (manager) {
            console.log('✅ 담당자 찾음:', manager.name, '(idx:', manager.idx, ')');
            return manager.name;
          } else {
            console.log('⚠️ manager_idx에 해당하는 담당자를 찾지 못함');
          }
        } else {
          console.log('❌ 담당자 리스트 조회 실패 - code:', userListResponse.code);
        }
      } else {
        console.log('⚠️ manager_idx가 없음');
      }

      // 4. manager_idx가 없거나 조회 실패 시 manager 필드 사용
      if (previousCase.manager) {
        console.log('📝 manager 필드 사용:', previousCase.manager);
        return previousCase.manager;
      }

      console.log('⚠️ 담당자 정보 없음');
      return '';
    } catch (error) {
      console.error('❌ 담당자 이름 조회 중 오류:', error);
      return '';
    }
  }
  
  /**
   * 연결 테스트 (단순 연결 확인용)
   */
  static async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(API_CONFIG.HOMEPAGE_API.BASE_URL, {
        method: 'HEAD',
        headers: {
          'Authorization': this.TOKEN,
        },
      });
      
      return response.ok || response.status < 500; // 4xx는 연결은 되는 것으로 간주
    } catch (error) {
      console.error('연결 테스트 실패:', error);
      return false;
    }
  }
  
  /**
   * 진단테스트 이름 생성 (타임스탬프 기반)
   * 형식: 자가진단YYMMDDHHMMSS
   */
  private static getDiagnosisTestName(): string {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // 25
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 09
    const day = now.getDate().toString().padStart(2, '0'); // 26
    const hour = now.getHours().toString().padStart(2, '0'); // 10
    const minute = now.getMinutes().toString().padStart(2, '0'); // 22
    const second = now.getSeconds().toString().padStart(2, '0'); // 23
    
    return `자가진단${year}${month}${day}${hour}${minute}${second}`;
  }

  /**
   * 회생터치 번호 생성 (순차 증가 방식) - Supabase 기반 카운팅
   */
  private static async getNextConsultationNumber(): Promise<string> {
    try {
      // Supabase에서 기존 레코드 가져오기 (서버/클라이언트 모두 작동)
      const { SupabaseDiagnosisService } = await import('@/lib/supabase/diagnosisService');
      const allRecords = await SupabaseDiagnosisService.getAllRecords();
      
      // "회생터치" 로 시작하는 모든 번호 추출
      const existingNumbers = allRecords
        .filter(record => record.customer_name && record.customer_name.startsWith('회생터치'))
        .map(record => {
          const name = record.customer_name!;
          const numberPart = name.replace('회생터치', '');
          return parseInt(numberPart, 10);
        })
        .filter(num => !isNaN(num) && num > 0);
      
      // 최대값 찾기
      const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
      const nextNumber = maxNumber + 1;
      
      console.log('🔢 회생터치 번호 생성:', `회생터치${nextNumber}`, '(기존 최대값:', maxNumber, ')');
      return `회생터치${nextNumber}`;
    } catch (error) {
      console.error('❌ 회생터치 번호 생성 실패:', error);
      // 실패시 1번부터 시작
      console.log('⚠️ 백업 번호 사용: 회생터치1');
      return '회생터치1';
    }
  }
  
  /**
   * 상담 데이터를 홈페이지 API 형식으로 변환
   */
  private static async transformToApiRequest(consultationData: ConsultationData): Promise<HomepageApiRequest> {
    // 거주지역 매핑 (홈페이지 드롭다운 리스트와 일치하도록 정식 명칭 사용)
    const regionMap: { [key: string]: string } = {
      'seoul': '서울특별시',
      'incheon': '인천광역시',
      'sejong': '세종특별자치시',
      'daejeon': '대전광역시',
      'daegu': '대구광역시',
      'ulsan': '울산광역시',
      'gwangju': '광주광역시',
      'busan': '부산광역시',
      'jeju': '제주특별자치도',
      'gangwon': '강원특별자치도',
      'gyeonggi': '경기도',
      'chungbuk': '충청북도',
      'chungnam': '충청남도',
      'gyeongbuk': '경상북도',
      'gyeongnam': '경상남도',
      'jeonbuk': '전북특별자치도',
      'jeonnam': '전라남도'
    };
    
    // 연락처 형식 유지 (하이픈 포함)
    const phone = consultationData.contact;
    
    // 거주지역 변환
    const livingPlace = regionMap[consultationData.residence] || consultationData.residence;
    
    // 회생터치 번호 사용 (이미 생성되어 전달된 경우) 또는 새로 생성
    const consultationName = consultationData.consultationName || await this.getNextConsultationNumber();
    console.log('🔢 홈페이지 API 전송 회생터치 번호:', consultationName);
    
    // 메모 생성 (신청시간, 고객이름, 거주지역, 상담유형, 진단내용)
    const consultationTypeText = consultationData.consultationType === 'phone' ? '전화상담' : '방문상담';
    
    // 날짜 형식: 2025-10-30 13:22:45 (한국 시간 KST)
    const now = new Date();
    const kstOffset = 9 * 60; // KST는 UTC+9
    const kstTime = new Date(now.getTime() + kstOffset * 60 * 1000);
    const year = kstTime.getUTCFullYear();
    const month = String(kstTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(kstTime.getUTCDate()).padStart(2, '0');
    const hours = String(kstTime.getUTCHours()).padStart(2, '0');
    const minutes = String(kstTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(kstTime.getUTCSeconds()).padStart(2, '0');
    const currentTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
    // 기본 메모
    let memo = `신청시간: ${currentTime}\n고객이름: ${consultationName}\n거주지역: ${livingPlace}\n상담유형: ${consultationTypeText}`;
    
    // 진단 데이터가 있는 경우 추가
    if (consultationData.diagnosisData) {
      const d = consultationData.diagnosisData;
      memo += '\n\n[자가진단 결과]';
      
      if (d.maritalStatus) memo += `\n혼인여부: ${d.maritalStatus}`;
      if (d.children) memo += `\n자녀: ${d.children}`;
      if (d.income) memo += `\n소득: ${d.income}`;
      if (d.assets) memo += `\n재산: ${d.assets}`;
      if (d.debt) memo += `\n채무: ${d.debt}`;
    }
     
    return {
      case_type: 1, // 기본값: 개인회생 (필요시 동적으로 변경 가능)
      name: consultationName, // 회생터치 번호 적용
      phone: phone,
      living_place: livingPlace,
      memo: memo
    };
  }
  
  /**
   * API 토큰 업데이트
   */
  static updateToken(newToken: string): void {
    // 실제 구현에서는 환경변수나 보안 저장소 사용
    console.log('토큰 업데이트:', newToken);
  }
  
}
