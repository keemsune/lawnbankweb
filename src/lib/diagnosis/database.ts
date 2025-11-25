// 진단 데이터 저장 및 관리 시스템

import { CompleteDiagnosisData } from './service';
import { supabase } from '@/lib/supabase/client';

/**
 * 간편 상담 신청 데이터
 */
export interface SimpleConsultationData {
  consultationType: 'phone' | 'visit';
  contact: string;
  residence: string;
}

/**
 * 데이터베이스 저장용 진단 레코드
 */
export interface DiagnosisRecord extends CompleteDiagnosisData {
  id: string; // 고유 ID
  createdAt: string; // 생성 시간
  updatedAt: string; // 수정 시간
  status: 'completed' | 'pending' | 'cancelled'; // 상태
  acquisitionSource: 'test' | 'converted' | string; // 유입경로 (기존 conversionStatus)
  ipAddress?: string; // IP 주소 (선택)
  userAgent?: string; // 사용자 에이전트 (선택)
  isDuplicate?: boolean; // 중복 연락처 여부
  duplicateCount?: number; // 동일 연락처로 신청한 총 횟수
}

/**
 * 테이블 표시용 요약 데이터
 */
export interface DiagnosisTableRow {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  consultationType?: string;
  residence?: string;
  
  // 테스트 답변 요약
  maritalStatus: string;
  children: string;
  income: string;
  assets: string;
  debt: string;
  
  // 진단 결과 요약
  recommendation: string;
  monthlyPayment36: string;
  monthlyPayment60: string;
  currentDebt: string;
  reducedDebt: string;
  reductionRate: string;
  comparison: string;
  
  status: string;
  acquisitionSource: string;
  
  // 중복 정보
  isDuplicate?: boolean;
  duplicateCount?: number;
}

/**
 * 필터링 옵션
 */
export interface DiagnosisFilter {
  dateRange?: {
    start: string;
    end: string;
  };
  recommendation?: ('recovery' | 'bankruptcy' | 'both' | 'none')[];
  reductionRateRange?: {
    min: number;
    max: number;
  };
  debtRange?: {
    min: number;
    max: number;
  };
  status?: ('completed' | 'pending' | 'cancelled')[];
  acquisitionSource?: ('test' | 'converted' | string)[];
  consultationType?: ('phone' | 'visit')[];
  searchText?: string; // 이름, 이메일, 전화번호 검색
}

/**
 * 정렬 옵션
 */
export interface DiagnosisSortOption {
  field: keyof DiagnosisTableRow;
  direction: 'asc' | 'desc';
}

/**
 * 페이지네이션 옵션
 */
export interface PaginationOption {
  page: number;
  limit: number;
}

/**
 * 진단 데이터 관리 클래스
 */
export class DiagnosisDataManager {
  private static readonly STORAGE_KEY = 'diagnosis_records';
  
  /**
   * 연락처 중복 체크 (홈페이지 API 기반 - 서버 라우트 통해)
   */
  private static async checkDuplicateContact(phone: string): Promise<{ isDuplicate: boolean; duplicateCount: number }> {
    try {
      console.log('🔍 중복 체크 시작 (서버 API 통해):', phone);
      
      // 서버 API 라우트를 통해 홈페이지 API 호출
      const response = await fetch('/api/homepage/checkDuplicate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });
      
      if (!response.ok) {
        throw new Error(`서버 API 호출 실패: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ 중복 체크 결과:', result);
        return {
          isDuplicate: result.isDuplicate,
          duplicateCount: result.duplicateCount
        };
      } else {
        console.error('❌ 중복 체크 실패:', result.error);
        return {
          isDuplicate: false,
          duplicateCount: 1
        };
      }
    } catch (error) {
      console.error('❌ 중복 체크 중 오류:', error);
      // API 실패 시 중복 없음으로 처리
      return {
        isDuplicate: false,
        duplicateCount: 1
      };
    }
  }
  
  /**
   * 간편 상담 신청 데이터를 진단 레코드로 저장
   */
  static async saveSimpleConsultation(data: SimpleConsultationData, acquisitionSource: string = '간편상담신청'): Promise<DiagnosisRecord> {
    console.log('DiagnosisDataManager.saveSimpleConsultation 호출됨');
    console.log('저장할 상담 신청 데이터:', data);
    
    // 연락처 중복 체크
    const duplicateInfo = await this.checkDuplicateContact(data.contact);
    console.log('연락처 중복 체크 결과:', duplicateInfo);
    
    // 회생터치 번호 생성 (Supabase 기반 - await 필요)
    const consultationName = await this.getNextConsultationNumberFromSupabase();
    console.log('생성된 회생터치 번호:', consultationName);
    
    // 홈페이지 API로 데이터 전송 (서버 API 라우트를 통해)
    try {
      const consultationData = {
        consultationType: data.consultationType,
        contact: data.contact,
        residence: data.residence,
        acquisitionSource: acquisitionSource,
        isDuplicate: duplicateInfo.isDuplicate,
        duplicateCount: duplicateInfo.duplicateCount,
        consultationName: consultationName // 생성된 회생터치 번호 전달
      };
      
      console.log('홈페이지 API 호출 시작 (서버 라우트 통해):', consultationData);
      const response = await fetch('/api/homepage/createCase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultationData),
      });
      
      if (!response.ok) {
        throw new Error(`서버 API 호출 실패: ${response.status}`);
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || '알 수 없는 오류');
      }
      
      console.log('홈페이지 API 호출 성공');
    } catch (error) {
      console.error('홈페이지 API 호출 실패:', error);
      // API 실패해도 로컬 저장은 계속 진행
    }

    // 간편 상담 신청을 위한 기본 진단 데이터 생성 (테스트 답변 없음)
    const defaultDiagnosisData: CompleteDiagnosisData = {
      // 원본 답변 데이터 (빈 값 - 테스트 안함)
      originalAnswers: {
        1: '미혼' as any, // 기본값으로 설정하되 실제로는 테스트 안함으로 표시
        2: '없다' as any,
        3: '소득이 없다' as any,
        5: [],
        6: '1천만원 이하' as any
      },
      
      // 코드화된 답변 데이터 (빈 값 - 테스트 안함)
      codedAnswers: {
        maritalStatus: 2 as any, // 기본값으로 설정하되 실제로는 테스트 안함으로 표시
        hasMinorChildren: false,
        numberOfChildren: 0,
        incomeType: 1 as any, // 기본값으로 설정하되 실제로는 테스트 안함으로 표시
        monthlyIncome: 0,
        hasInsurance: false,
        assets: {
          savings: false,
          insurance: false,
          deposit: false,
          vehicle: false,
          realEstate: false,
          other: false
        },
        totalDebt: 0 // 답변 없음
      },
      
      // 연락처 정보
      contactInfo: {
        name: consultationName, // 미리 생성된 회생터치 번호 사용
        phone: data.contact,
        consultationType: data.consultationType,
        residence: data.residence,
        submittedAt: new Date().toISOString()
      },
      
      // 계산된 결과 (기본값)
      result: {
        eligibility: {
          personalRecovery: false,
          bankruptcy: false,
          recommendation: 'none'
        },
        monthlyPayment: {
          period36: 0,
          period60: 0
        },
        reductionRate: {
          currentDebt: 0,
          reducedDebt: 0,
          reductionAmount: 0,
          percentage: 0,
          comparison: 'low',
          distributionData: {
            ranges: [],
            userPosition: 0
          }
        }
      },
      
      // 결과 요약 텍스트 (간편 상담신청 - 테스트 안함)
      summary: {
        eligibilityText: '테스트 미진행',
        paymentText: '테스트 미진행',
        reductionText: '테스트 미진행',
        comparisonText: '테스트 미진행'
      },
      
      // 메타데이터
      metadata: {
        calculatedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    return this.saveRecord(defaultDiagnosisData, acquisitionSource, duplicateInfo);
  }
  
  /**
   * 새로운 진단 레코드 저장
   */
  static async saveRecord(
    data: CompleteDiagnosisData, 
    acquisitionSource: 'test' | 'converted' | string = 'test',
    duplicateInfo?: { isDuplicate: boolean; duplicateCount: number }
  ): Promise<DiagnosisRecord & { supabaseId?: string }> {
    console.log('DiagnosisDataManager.saveRecord 호출됨');
    console.log('저장할 데이터:', data);
    console.log('유입경로:', acquisitionSource);
    console.log('중복 정보:', duplicateInfo);
    
    const record: DiagnosisRecord = {
      ...data,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'completed',
      acquisitionSource: acquisitionSource,
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent(),
      isDuplicate: duplicateInfo?.isDuplicate || false,
      duplicateCount: duplicateInfo?.duplicateCount || 1
    };
    
    console.log('생성된 레코드:', record);
    
    const records = this.getAllRecords();
    console.log('기존 레코드 수:', records.length);
    
    records.push(record);
    console.log('새 레코드 추가 후 총 개수:', records.length);
    
    this.saveAllRecords(records);
    console.log('로컬 스토리지에 저장 완료');
    
    // Supabase에도 저장 (재시도 3회)
    let supabaseId: string | undefined;
    const maxRetries = 3;
    const retryDelay = 1000; // 1초

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Supabase 저장 시도 ${attempt}/${maxRetries}...`);
        
        const response = await fetch('/api/supabase/saveRecord', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(record),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          supabaseId = result.data.id;
          console.log(`✅ Supabase 저장 성공! (${attempt}번째 시도) ID:`, supabaseId);
          break; // 성공하면 루프 탈출
          
        } else {
          throw new Error(result.error || 'Unknown error');
        }
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`❌ Supabase 저장 시도 ${attempt} 실패:`, errorMessage);
        
        // 마지막 시도에서도 실패한 경우
        if (attempt === maxRetries) {
          console.error('❌ Supabase 저장 최종 실패 (3회 시도)');
          
          // 에러 로그 저장
          await this.logError({
            errorType: 'supabase_save_failed',
            consultationNumber: (record as any).contactInfo?.name || 'unknown',
            customerPhone: (record as any).contactInfo?.phone || 'unknown',
            customerResidence: (record as any).contactInfo?.residence || 'unknown',
            acquisitionSource: record.acquisitionSource,
            errorMessage: errorMessage,
            errorDetails: {
              recordId: record.id,
              attempts: maxRetries,
              lastError: error
            },
            retryCount: maxRetries
          });
          
          // Slack 알림 전송
          try {
            await fetch('/api/slack/notify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'error',
                customerName: (record as any).contactInfo?.name || 'unknown',
                consultationType: (record as any).contactInfo?.consultationType || 'unknown',
                acquisitionSource: record.acquisitionSource,
                error: `Supabase 저장 실패 (3회 시도): ${errorMessage}`,
                attempts: maxRetries,
                phone: (record as any).contactInfo?.phone
              })
            });
          } catch (slackError) {
            console.error('Slack 알림 전송 실패:', slackError);
          }
          
        } else {
          // 재시도 전 대기
          console.log(`⏳ ${retryDelay}ms 후 재시도...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    // ⚠️ 중요: Supabase 저장 실패해도 사용자에게는 성공 메시지
    // 이유: 홈페이지 API 등록은 성공했으므로 상담은 접수된 상태
    return { ...record, supabaseId };
  }
  
  /**
   * 모든 레코드 조회
   */
  static getAllRecords(): DiagnosisRecord[] {
    if (typeof window === 'undefined') return [];
    
    try {
      // 시크릿모드에서 localStorage 접근 권한 확인
      if (!this.isLocalStorageAvailable()) {
        console.error('❌ localStorage가 사용 불가능합니다 (시크릿모드 또는 권한 제한)');
        console.log('💡 시크릿모드에서는 진단 데이터를 저장/조회할 수 없습니다.');
        return [];
      }
      
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const records = stored ? JSON.parse(stored) : [];
      console.log('📊 localStorage에서 레코드 조회:', records.length, '개');
      return records;
    } catch (error) {
      console.error('❌ 레코드 조회 중 오류:', error);
      console.error('시크릿모드이거나 localStorage 접근이 제한되었을 수 있습니다.');
      return [];
    }
  }
  
  /**
   * 유입경로 업데이트
   */
  static updateAcquisitionSource(recordId: string, acquisitionSource: 'test' | 'converted' | string): boolean {
    const records = this.getAllRecords();
    const recordIndex = records.findIndex(record => record.id === recordId);
    
    if (recordIndex === -1) {
      return false; // 레코드를 찾을 수 없음
    }
    
    records[recordIndex].acquisitionSource = acquisitionSource;
    records[recordIndex].updatedAt = new Date().toISOString();
    
    this.saveAllRecords(records);
    return true;
  }
  
  /**
   * 연락처 정보 및 유입경로 업데이트 (첫 번째 전환만 허용)
   */
  static async updateContactInfoAndConversion(
    recordId: string, 
    name: string, 
    phone: string, 
    acquisitionSource: 'test' | 'converted' | string = 'converted',
    consultationType?: 'phone' | 'visit',
    residence?: string,
    diagnosisRecord?: DiagnosisRecord
  ): Promise<{ success: boolean; message?: string }> {
    console.log('DiagnosisDataManager.updateContactInfoAndConversion 호출됨');
    console.log('recordId:', recordId, 'name:', name, 'phone:', phone, 'acquisitionSource:', acquisitionSource);
    
    const records = this.getAllRecords();
    
    // recordId로 레코드 찾기 (로컬 ID 또는 Supabase ID로 검색)
    let recordIndex = records.findIndex(record => record.id === recordId);
    
    // 로컬 ID로 못 찾으면 Supabase ID로 검색
    if (recordIndex === -1) {
      console.log('⚠️ 로컬 ID로 레코드를 찾지 못함, Supabase ID로 검색 시도...');
      recordIndex = records.findIndex(record => (record as any).supabaseId === recordId);
      
      if (recordIndex !== -1) {
        console.log('✅ Supabase ID로 레코드 찾음:', records[recordIndex].id);
      }
    }
    
    // 여전히 못 찾으면 가장 최근 test 레코드 사용 (fallback)
    if (recordIndex === -1) {
      console.log('⚠️ ID로 레코드를 찾지 못함, 가장 최근 test 레코드 검색...');
      const testRecords = records
        .filter(r => r.acquisitionSource === 'test')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      if (testRecords.length > 0) {
        const latestTestRecord = testRecords[0];
        recordIndex = records.findIndex(r => r.id === latestTestRecord.id);
        console.log('✅ 가장 최근 test 레코드 사용:', latestTestRecord.id);
      }
    }
    
    if (recordIndex === -1) {
      console.error('❌ 레코드를 찾을 수 없습니다. 제공된 ID:', recordId);
      console.log('📋 현재 저장된 레코드:', records.map(r => ({ id: r.id, supabaseId: (r as any).supabaseId, acquisitionSource: r.acquisitionSource })));
      return { success: false, message: '진단 기록을 찾을 수 없습니다. 진단 테스트를 다시 진행해주세요.' };
    }
    
    const currentRecord = records[recordIndex];
    
    // 중복 전환 방지: 이미 전환된 레코드는 조용히 무시 (사용자에게는 성공으로 표시)
    if (currentRecord.acquisitionSource !== 'test' && currentRecord.acquisitionSource !== 'converted') {
      console.log('이미 전환된 레코드입니다. 현재 유입경로:', currentRecord.acquisitionSource, '- 무시됨');
      // 사용자에게는 성공으로 표시하지만 실제로는 아무것도 하지 않음
      return { success: true, message: '상담 신청이 완료되었습니다!' };
    }
    
    // 연락처 중복 체크
    const duplicateInfo = await this.checkDuplicateContact(phone);
    console.log('연락처 중복 체크 결과:', duplicateInfo);
    
    // 회생터치 번호 생성 (테스트→상담전환 시, Supabase 기반)
    const consultationName = await this.getNextConsultationNumberFromSupabase();
    console.log('생성된 회생터치 번호:', consultationName);
    
    // 홈페이지 API로 데이터 전송 (전환된 경우에만, 서버 API 라우트를 통해)
    if (acquisitionSource === '테스트_전환' || acquisitionSource === 'converted' || acquisitionSource === '결과_서비스혜택' || acquisitionSource === '결과_진행절차') {
      try {
        console.log('🔍 진단 레코드 확인:', diagnosisRecord ? '있음' : '없음');
        
        // 진단 데이터 준비 (diagnosisRecord가 제공된 경우)
        let diagnosisData = undefined;
        if (diagnosisRecord) {
          const originalAnswers = diagnosisRecord.originalAnswers || {};
          const result = diagnosisRecord.result;
          
          console.log('📝 원본 답변:', originalAnswers);
          console.log('📊 진단 결과:', result);
          
          diagnosisData = {
            maritalStatus: originalAnswers[1] || undefined,
            children: originalAnswers[2] || undefined,
            income: originalAnswers[3] ? 
              (originalAnswers['3_additional'] ? `${originalAnswers[3]} (${originalAnswers['3_additional']})` : originalAnswers[3]) 
              : undefined,
            assets: originalAnswers[5] ? (Array.isArray(originalAnswers[5]) ? originalAnswers[5].join(', ') : originalAnswers[5]) : undefined,
            debt: originalAnswers[6] || undefined,
            recommendation: result?.eligibility?.recommendation === 'recovery' ? '개인회생' :
                           result?.eligibility?.recommendation === 'bankruptcy' ? '파산면책' :
                           result?.eligibility?.recommendation === 'both' ? '회생/파산 모두' : undefined,
            monthlyPayment36: result?.monthlyPayment?.period36 || undefined,
            monthlyPayment60: result?.monthlyPayment?.period60 || undefined,
            reductionRate: result?.reductionRate?.percentage || undefined
          };
          
          console.log('✅ 생성된 진단 데이터:', diagnosisData);
        } else {
          console.log('⚠️ diagnosisRecord가 없습니다!');
        }
        
        const consultationData = {
          consultationType: consultationType || 'phone',
          contact: phone,
          residence: residence || 'seoul',
          acquisitionSource: acquisitionSource,
          isDuplicate: duplicateInfo.isDuplicate,
          duplicateCount: duplicateInfo.duplicateCount,
          consultationName: consultationName, // 생성된 회생터치 번호 전달
          diagnosisData: diagnosisData // 진단 데이터 추가
        };
        
        console.log('홈페이지 API 호출 시작 (전환, 서버 라우트 통해):', consultationData);
        const response = await fetch('/api/homepage/createCase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(consultationData),
        });
        
        if (!response.ok) {
          throw new Error(`서버 API 호출 실패: ${response.status}`);
        }
        
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || '알 수 없는 오류');
        }
        
        console.log('홈페이지 API 호출 성공 (전환)');
      } catch (error) {
        console.error('홈페이지 API 호출 실패 (전환):', error);
        // API 실패해도 로컬 저장은 계속 진행
      }
    }
    
    // 연락처 정보 업데이트
    const conversionTime = new Date().toISOString();
    records[recordIndex].contactInfo.name = consultationName; // 회생터치 번호로 변경
    records[recordIndex].contactInfo.phone = phone;
    if (consultationType) {
      records[recordIndex].contactInfo.consultationType = consultationType;
    }
    if (residence) {
      records[recordIndex].contactInfo.residence = residence;
    }
    records[recordIndex].contactInfo.submittedAt = conversionTime;
    records[recordIndex].acquisitionSource = acquisitionSource;
    records[recordIndex].createdAt = conversionTime; // 상담 전환 시점으로 업데이트
    records[recordIndex].updatedAt = conversionTime;
    records[recordIndex].isDuplicate = duplicateInfo.isDuplicate;
    records[recordIndex].duplicateCount = duplicateInfo.duplicateCount;
    
    console.log('업데이트된 레코드:', records[recordIndex]);
    
    this.saveAllRecords(records);
    console.log('로컬 스토리지 업데이트 완료');
    
    // Supabase에도 업데이트 (서버 API 통해)
    // recordId가 Supabase UUID인 경우 직접 업데이트
    try {
      console.log('🔄 Supabase 업데이트 시작 (서버 API 통해)...');
      console.log('📝 업데이트할 ID:', recordId);
      
      const updateData = {
        id: recordId, // Supabase UUID
        customer_name: consultationName,
        phone: phone,
        residence: residence || records[recordIndex].contactInfo.residence,
        acquisition_source: acquisitionSource,
        is_duplicate: duplicateInfo.isDuplicate,
        duplicate_count: duplicateInfo.duplicateCount,
        // created_at은 업데이트하지 않음 (원래 시간 유지)
      };
      
      const response = await fetch('/api/supabase/updateRecordByPhone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        throw new Error(`서버 API 호출 실패: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Supabase 업데이트 성공!');
      } else {
        console.error('❌ Supabase 업데이트 실패:', result.error);
      }
    } catch (error) {
      console.error('❌ Supabase 업데이트 중 오류:', error);
    }
    
    console.log('DB 업데이트 완료');
    return { success: true };
  }
  
  /**
   * 필터링된 레코드 조회
   */
  static getFilteredRecords(
    filter?: DiagnosisFilter,
    sort?: DiagnosisSortOption,
    pagination?: PaginationOption
  ): {
    records: DiagnosisRecord[];
    total: number;
    totalPages: number;
  } {
    let records = this.getAllRecords();
    
    // 필터링
    if (filter) {
      records = this.applyFilter(records, filter);
    }
    
    const total = records.length;
    
    // 정렬
    if (sort) {
      records = this.applySorting(records, sort);
    }
    
    // 페이지네이션
    let totalPages = 1;
    if (pagination) {
      totalPages = Math.ceil(total / pagination.limit);
      const startIndex = (pagination.page - 1) * pagination.limit;
      records = records.slice(startIndex, startIndex + pagination.limit);
    }
    
    return { records, total, totalPages };
  }
  
  /**
   * 테이블 표시용 데이터로 변환
   */
  static convertToTableRows(records: DiagnosisRecord[]): DiagnosisTableRow[] {
    return records.map(record => {
      // 안전한 데이터 접근을 위한 기본값 설정
      const contactInfo = record.contactInfo || {
        name: '-',
        phone: '-',
        consultationType: undefined,
        residence: undefined,
        submittedAt: ''
      };
      const originalAnswers = record.originalAnswers || {};
      const result = record.result || {
        eligibility: { recommendation: 'none' },
        monthlyPayment: { period36: 0, period60: 0 },
        reductionRate: { 
          currentDebt: 0, 
          reducedDebt: 0, 
          reductionAmount: 0,
          percentage: 0, 
          comparison: 'low',
          distributionData: {
            ranges: [],
            userPosition: 0
          }
        }
      };

      return {
      id: record.id,
      createdAt: (() => {
        // ISO 문자열을 그대로 파싱 (2025-10-29T15:30:45.123Z -> 2025.10.29 15:30:45)
        const isoString = record.createdAt;
        // "2025-10-29T15:30:45.123Z" 형식에서 날짜와 시간 추출
        const [datePart, timePart] = isoString.split('T');
        const [year, month, day] = datePart.split('-');
        const [hours, minutes, seconds] = timePart.split(':');
        const sec = seconds.split('.')[0]; // 밀리초 제거
        return `${year}.${month}.${day} ${hours}:${minutes}:${sec}`;
      })(),
        name: contactInfo.name || '-',
        phone: contactInfo.phone || '-',
        consultationType: contactInfo.consultationType || undefined,
        residence: contactInfo.residence || undefined,
        
        // 테스트 답변 요약 (자가진단을 거치지 않은 경우 모두 '-'로 표시)
        maritalStatus: this.isDirectConsultation(record) ? '-' : (originalAnswers[1] || '-'),
        children: this.isDirectConsultation(record) ? '-' : (originalAnswers[2] || '-'),
        income: this.isDirectConsultation(record) ? '-' : ((originalAnswers[3] || '-') + (originalAnswers['3_additional'] ? ` (${originalAnswers['3_additional']})` : '')),
        assets: this.isDirectConsultation(record) ? '-' : (originalAnswers[5] ? originalAnswers[5].join(', ') : '-'),
        debt: this.isDirectConsultation(record) ? '-' : (originalAnswers[6] || '-'),
        
        // 진단 결과 요약 (자가진단을 거치지 않은 경우 '-'로 표시)
        recommendation: this.isDirectConsultation(record) ? '-' : (result.eligibility?.recommendation === 'none' ? '-' : this.getRecommendationText(result.eligibility?.recommendation || 'none')),
        monthlyPayment36: this.isDirectConsultation(record) ? '-' : (result.monthlyPayment?.period36 === 0 || !result.monthlyPayment?.period36 ? '-' : result.monthlyPayment.period36.toLocaleString() + '원'),
        monthlyPayment60: this.isDirectConsultation(record) ? '-' : (result.monthlyPayment?.period60 === 0 || !result.monthlyPayment?.period60 ? '-' : result.monthlyPayment.period60.toLocaleString() + '원'),
        currentDebt: this.isDirectConsultation(record) ? '-' : (result.reductionRate?.currentDebt === 0 || !result.reductionRate?.currentDebt ? '-' : result.reductionRate.currentDebt.toLocaleString() + '원'),
        reducedDebt: this.isDirectConsultation(record) ? '-' : (result.reductionRate?.reducedDebt === 0 || !result.reductionRate?.reducedDebt ? '-' : result.reductionRate.reducedDebt.toLocaleString() + '원'),
        reductionRate: this.isDirectConsultation(record) ? '-' : (result.reductionRate?.percentage === 0 || !result.reductionRate?.percentage ? '-' : result.reductionRate.percentage + '%'),
        comparison: this.isDirectConsultation(record) ? '-' : (result.reductionRate?.comparison === 'low' && result.reductionRate?.percentage === 0 ? '-' : this.getComparisonText(result.reductionRate?.comparison || 'low')),
      
      status: this.getStatusText(record.status),
        acquisitionSource: this.getAcquisitionSourceText(record.acquisitionSource),
        
        // 중복 정보
        isDuplicate: record.isDuplicate || false,
        duplicateCount: record.duplicateCount || 0
      };
    });
  }
  
  /**
   * 특정 레코드 조회
   */
  static getRecordById(id: string): DiagnosisRecord | null {
    const records = this.getAllRecords();
    return records.find(record => record.id === id) || null;
  }
  
  /**
   * 레코드 삭제
   */
  static deleteRecord(id: string): boolean {
    const records = this.getAllRecords();
    const filteredRecords = records.filter(record => record.id !== id);
    
    if (filteredRecords.length < records.length) {
      this.saveAllRecords(filteredRecords);
      return true;
    }
    return false;
  }
  
  /**
   * 통계 데이터 생성
   */
  static getStatistics(records?: DiagnosisRecord[]): {
    total: number;
    byRecommendation: Record<string, number>;
    byReductionRate: Record<string, number>;
    byMonth: Record<string, number>;
    averageReductionRate: number;
    conversionRate: {
      total: number;
      test: number;
      converted: number;
      conversionPercentage: number;
    };
  } {
    const recordsToUse = records || this.getAllRecords();
    
    const stats = {
      total: recordsToUse.length,
      byRecommendation: {} as Record<string, number>,
      byReductionRate: {} as Record<string, number>,
      byMonth: {} as Record<string, number>,
      averageReductionRate: 0,
      conversionRate: {
        total: 0, // 실제 진단테스트를 완료한 수로 계산
        test: 0,
        converted: 0,
        conversionPercentage: 0
      }
    };
    
    if (recordsToUse.length === 0) return stats;
    
    let totalReductionRate = 0;
    let validRecordsCount = 0;
    
    recordsToUse.forEach(record => {
      // result 구조 확인
      if (!record.result || !record.result.eligibility || !record.result.reductionRate) {
        console.warn('레코드 구조 불완전:', record.id);
        return;
      }
      
      validRecordsCount++;
      
      // 추천 제도별 통계
      const rec = record.result.eligibility.recommendation || '파산면책';
      stats.byRecommendation[rec] = (stats.byRecommendation[rec] || 0) + 1;
      
      // 탕감률별 통계
      const rate = record.result.reductionRate.percentage || 0;
      const rateRange = this.getReductionRateRange(rate);
      stats.byReductionRate[rateRange] = (stats.byReductionRate[rateRange] || 0) + 1;
      totalReductionRate += rate;
      
      // 월별 통계
      const month = new Date(record.createdAt).toISOString().slice(0, 7); // YYYY-MM
      stats.byMonth[month] = (stats.byMonth[month] || 0) + 1;
      
      // 전환율 통계 - 자가진단 결과페이지에서 전환된 것만 전환율로 계산
      const acquisitionSource = record.acquisitionSource;
      
      // 진단테스트를 실제로 완료한 레코드인지 확인 (직접상담 제외)
      const isActualDiagnosisTest = !this.isDirectConsultation(record);
      
      if (isActualDiagnosisTest) {
        // 실제 진단테스트를 완료한 경우만 전환율 계산 대상에 포함
        stats.conversionRate.total++;
        
        if (acquisitionSource === 'test') {
          stats.conversionRate.test++;
        } else if (
          acquisitionSource === 'converted' || 
          acquisitionSource === '테스트_전환' || 
          acquisitionSource === '결과_서비스혜택' || 
          acquisitionSource === '결과_진행절차'
        ) {
          // 자가진단 결과페이지에서 전환된 경우만 전환으로 카운트
          stats.conversionRate.converted++;
        }
      }
      // 직접 상담신청(헤더, 서비스CTA, 문의페이지 등)은 전환율에서 완전히 제외
    });
    
    stats.averageReductionRate = validRecordsCount > 0 ? Math.round(totalReductionRate / validRecordsCount) : 0;
    
    // 전환율 계산
    if (stats.conversionRate.total > 0) {
      stats.conversionRate.conversionPercentage = Math.round(
        (stats.conversionRate.converted / stats.conversionRate.total) * 100
      );
    }
    
    return stats;
  }
  
  /**
   * CSV 내보내기
   */
  static exportToCSV(): string {
    const records = this.getAllRecords();
    const tableRows = this.convertToTableRows(records);
    
    const headers = [
      'ID', '생성일시', '이름', '전화번호',
      '혼인여부', '자녀', '소득', '재산', '채무',
      '추천제도', '36개월변제금', '60개월변제금', '현재채무', '탕감후채무', '탕감률', '탕감률비교', '상태', '유입경로'
    ];
    
    const csvContent = [
      headers.join(','),
      ...tableRows.map(row => [
        row.id, row.createdAt, row.name, row.phone,
        row.maritalStatus, row.children, row.income, row.assets, row.debt,
        row.recommendation, row.monthlyPayment36, row.monthlyPayment60, 
        row.currentDebt, row.reducedDebt, row.reductionRate, row.comparison, row.status, row.acquisitionSource
      ].map(field => `"${field}"`).join(','))
    ].join('\n');
    
    return csvContent;
  }
  
  // Private 헬퍼 메서드들
  
  /**
   * 직접 상담신청인지 확인 (테스트 없이 바로 상담신청한 경우)
   */
  private static isDirectConsultation(record: DiagnosisRecord): boolean {
    // 자가진단을 통해 유입되는 경우를 제외한 나머지는 모두 직접 상담신청으로 간주
    const diagnosisBasedSources = [
      'test',               // 테스트
      '결과_서비스혜택',    // 진단전환_혜택
      '결과_진행절차',      // 진단전환_절차
      '테스트_전환'         // 진단전환
    ];
    
    return !diagnosisBasedSources.includes(record.acquisitionSource);
  }
  
  /**
   * 회생터치 번호 생성 (Supabase 시퀀스 기반 - 중복 불가)
   */
  private static async getNextConsultationNumberFromSupabase(): Promise<string> {
    try {
      console.log('🔢 회생터치 번호 생성 시작 (시퀀스 기반)');
      
      // Supabase 함수 호출 (원자적 증가)
      const { data, error } = await supabase.rpc('get_next_consultation_number');
      
      if (error) {
        console.error('❌ 번호 생성 실패:', error);
        
        // 에러 로그 저장
        await this.logError({
          errorType: 'number_generation_failed',
          errorMessage: error.message,
          errorDetails: error
        });
        
        throw new Error(`번호 생성 실패: ${error.message}`);
      }
      
      const nextNumber = data;
      const consultationName = `회생터치${nextNumber}`;
      
      console.log('✅ 회생터치 번호 생성 성공:', consultationName);
      return consultationName;
      
    } catch (error) {
      console.error('❌ 회생터치 번호 생성 중 오류:', error);
      
      // 최후의 백업: 타임스탬프 기반 임시 번호
      const timestamp = Date.now();
      const tempName = `회생터치-임시-${timestamp}`;
      console.warn('⚠️ 임시 번호 사용:', tempName);
      
      // 에러 로그
      await this.logError({
        errorType: 'number_generation_critical_failed',
        errorMessage: error instanceof Error ? error.message : String(error),
        errorDetails: { timestamp, tempName }
      });
      
      return tempName;
    }
  }
  
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  private static getClientIP(): string {
    // 실제 구현에서는 서버에서 IP를 받아와야 함
    return 'unknown';
  }
  
  private static getUserAgent(): string {
    return typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown';
  }
  
  /**
   * localStorage 사용 가능 여부 확인 (시크릿모드 감지)
   */
  private static isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  private static saveAllRecords(records: DiagnosisRecord[]): void {
    if (typeof window !== 'undefined') {
      try {
        // 시크릿모드에서 localStorage 접근 권한 확인
        if (!this.isLocalStorageAvailable()) {
          console.error('❌ localStorage가 사용 불가능합니다 (시크릿모드 또는 권한 제한)');
          alert('시크릿모드에서는 진단 데이터를 저장할 수 없습니다. 일반 브라우저 모드를 사용해주세요.');
          return;
        }
        
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
        console.log('✅ localStorage에 레코드 저장 완료:', records.length, '개');
      } catch (error) {
        console.error('❌ 레코드 저장 중 오류:', error);
        console.error('시크릿모드이거나 localStorage 접근이 제한되었을 수 있습니다.');
        alert('데이터 저장에 실패했습니다. 시크릿모드가 아닌 일반 브라우저 모드를 사용해주세요.');
      }
    }
  }
  
  private static applyFilter(records: DiagnosisRecord[], filter: DiagnosisFilter): DiagnosisRecord[] {
    return records.filter(record => {
      // 날짜 범위 필터
      if (filter.dateRange) {
        const recordDate = new Date(record.createdAt);
        const startDate = new Date(filter.dateRange.start);
        const endDate = new Date(filter.dateRange.end);
        if (recordDate < startDate || recordDate > endDate) return false;
      }
      
      // 추천 제도 필터
      if (filter.recommendation && filter.recommendation.length > 0) {
        if (!filter.recommendation.includes(record.result.eligibility.recommendation)) return false;
      }
      
      // 탕감률 범위 필터
      if (filter.reductionRateRange) {
        const rate = record.result.reductionRate.percentage;
        if (rate < filter.reductionRateRange.min || rate > filter.reductionRateRange.max) return false;
      }
      
      // 채무 범위 필터
      if (filter.debtRange) {
        const debt = record.result.reductionRate.currentDebt;
        if (debt < filter.debtRange.min || debt > filter.debtRange.max) return false;
      }
      
      // 상태 필터
      if (filter.status && filter.status.length > 0) {
        if (!filter.status.includes(record.status)) return false;
      }
      
      // 유입경로 필터
      if (filter.acquisitionSource && filter.acquisitionSource.length > 0) {
        if (!filter.acquisitionSource.includes(record.acquisitionSource)) return false;
      }
      
      // 상담 유형 필터
      if (filter.consultationType && filter.consultationType.length > 0) {
        const contactInfo = record.contactInfo;
        if (!contactInfo?.consultationType || !filter.consultationType.includes(contactInfo.consultationType)) return false;
      }
      
      // 텍스트 검색
      if (filter.searchText) {
        const searchText = filter.searchText.toLowerCase();
        const searchableText = [
          record.contactInfo.name,
          record.contactInfo.phone
        ].join(' ').toLowerCase();
        if (!searchableText.includes(searchText)) return false;
      }
      
      return true;
    });
  }
  
  private static applySorting(records: DiagnosisRecord[], sort: DiagnosisSortOption): DiagnosisRecord[] {
    return [...records].sort((a, b) => {
      const tableRowA = this.convertToTableRows([a])[0];
      const tableRowB = this.convertToTableRows([b])[0];
      
      const valueA = tableRowA[sort.field] || '';
      const valueB = tableRowB[sort.field] || '';
      
      let comparison = 0;
      if (valueA < valueB) comparison = -1;
      if (valueA > valueB) comparison = 1;
      
      return sort.direction === 'desc' ? -comparison : comparison;
    });
  }
  
  private static getRecommendationText(recommendation: string): string {
    switch (recommendation) {
      case 'recovery': return '개인회생';
      case 'bankruptcy': return '파산면책';
      case 'both': return '회생/파산 모두';
      case 'none': return '부적합';
      default: return '알 수 없음';
    }
  }
  
  private static getComparisonText(comparison: string): string {
    switch (comparison) {
      case 'high': return '높음';
      case 'average': return '보통';
      case 'low': return '낮음';
      default: return '알 수 없음';
    }
  }
  
  private static getStatusText(status: string): string {
    switch (status) {
      case 'completed': return '완료';
      case 'pending': return '대기';
      case 'cancelled': return '취소';
      default: return '알 수 없음';
    }
  }
  
  private static getAcquisitionSourceText(acquisitionSource: string): string {
    switch (acquisitionSource) {
      case 'test': return '테스트';
      case 'converted': return '전환완료';
      // 기존 간편상담신청 (호환성 유지)
      case '간편상담신청': return '간편상담신청';
      // 새로운 5가지 전환경로
      case '헤더_상담신청': return '헤더_상담신청';
      case '테스트_전환': return '진단전환';
      case '서비스_CTA': return '서비스_CTA';
      case '문의_방문상담': return '문의_방문상담';
      case '문의_간편상담': return '문의_간편상담';
      case '하단바_상담신청': return '하단바_상담신청';
      case '결과_서비스혜택': return '진단전환_혜택';
      case '결과_진행절차': return '진단전환_절차';
      // 기타 (호환성 유지)
      case '히어로_전화상담': return '히어로_전화상담';
      case '히어로_방문상담': return '히어로_방문상담';
      case '히어로_카톡상담': return '히어로_카톡상담';
      case 'CTA_자가진단': return 'CTA_자가진단';
      case 'CTA_서비스소개': return 'CTA_서비스소개';
      default: return acquisitionSource || '알 수 없음';
    }
  }
  
  private static getReductionRateRange(rate: number): string {
    if (rate < 50) return '0-50%';
    if (rate < 70) return '50-70%';
    if (rate < 85) return '70-85%';
    if (rate < 95) return '85-95%';
    return '95-100%';
  }

  /**
   * 에러 로그 저장 (Supabase)
   */
  private static async logError(errorData: {
    errorType: string;
    consultationNumber?: string;
    customerPhone?: string;
    customerResidence?: string;
    acquisitionSource?: string;
    errorMessage: string;
    errorDetails?: any;
    retryCount?: number;
  }): Promise<void> {
    try {
      const { error } = await supabase
        .from('consultation_error_logs')
        .insert([{
          error_type: errorData.errorType,
          consultation_number: errorData.consultationNumber,
          customer_phone: errorData.customerPhone,
          customer_residence: errorData.customerResidence,
          acquisition_source: errorData.acquisitionSource,
          error_message: errorData.errorMessage,
          error_details: errorData.errorDetails,
          retry_count: errorData.retryCount || 0
        }]);
      
      if (error) {
        console.error('에러 로그 저장 실패:', error);
      } else {
        console.log('✅ 에러 로그 저장 성공');
      }
    } catch (err) {
      console.error('에러 로그 저장 중 예외:', err);
    }
  }
}
