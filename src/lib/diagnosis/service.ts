// 진단 서비스 메인 파일 - 모든 로직을 통합

import { DiagnosisAnswers, ContactInfo, DiagnosisResult, CodedAnswers } from './types';
import { mapAnswersToCode, reverseMapCode } from './mapper';
import { calculateDiagnosisResult, generateResultSummary } from './calculator';
import { DiagnosisDataManager } from './database';

/**
 * 진단 결과 전체 데이터 구조
 */
export interface CompleteDiagnosisData {
  // 원본 답변 데이터
  originalAnswers: DiagnosisAnswers;
  
  // 코드화된 답변 데이터
  codedAnswers: CodedAnswers;
  
  // 연락처 정보
  contactInfo: ContactInfo;
  
  // 계산된 결과
  result: DiagnosisResult;
  
  // 결과 요약 텍스트
  summary: {
    eligibilityText: string;
    paymentText: string;
    reductionText: string;
    comparisonText: string;
  };
  
  // 메타데이터
  metadata: {
    calculatedAt: string; // ISO 날짜 문자열
    version: string; // 계산 로직 버전
  };
}

/**
 * 메인 진단 서비스 클래스
 */
export class DiagnosisService {
  private static readonly CALCULATION_VERSION = '1.0.0';
  
  /**
   * 진단테스트 이름 생성 (타임스탬프 기반)
   * 형식: 자가진단YYMMDDHHMMSS
   */
  private static generateDiagnosisTestName(): string {
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
   * 진단 테스트 답변을 받아 완전한 진단 결과를 생성
   */
  static async processDiagnosis(
    answers: DiagnosisAnswers,
    contactInfo: ContactInfo
  ): Promise<CompleteDiagnosisData> {
    try {
      // 1. 답변을 코드로 변환
      const codedAnswers = mapAnswersToCode(answers);
      
      // 2. 결과 계산
      const result = calculateDiagnosisResult(codedAnswers);
      
      // 3. 요약 텍스트 생성
      const summary = generateResultSummary(result);
      
      // 4. 완전한 데이터 구조 생성
      const completeDiagnosisData: CompleteDiagnosisData = {
        originalAnswers: answers,
        codedAnswers,
        contactInfo,
        result,
        summary,
        metadata: {
          calculatedAt: new Date().toISOString(),
          version: this.CALCULATION_VERSION
        }
      };
      
      // 핸드폰 번호가 있는 경우에만 데이터베이스에 저장
      console.log('저장 조건 확인 - phone:', contactInfo.phone, 'trim():', contactInfo.phone?.trim());
      if (contactInfo.phone && contactInfo.phone.trim() !== '') {
        try {
          console.log('저장 조건 만족 - 데이터베이스 저장 시작');
          
          // 진단테스트 이름 생성 (타임스탬프 기반)
          const diagnosisTestName = this.generateDiagnosisTestName();
          console.log('생성된 진단테스트 이름:', diagnosisTestName);
          
          // contactInfo에 이름 추가
          const updatedContactInfo = {
            ...contactInfo,
            name: diagnosisTestName
          };
          
          // completeDiagnosisData 업데이트
          const updatedDiagnosisData = {
            ...completeDiagnosisData,
            contactInfo: updatedContactInfo
          };
          
          // 테스트용 더미 값인 경우 'test' 상태로, 실제 번호인 경우 'converted' 상태로 저장
          const conversionStatus = contactInfo.phone === 'test-user' ? 'test' : 'converted';
          console.log('결정된 전환 상태:', conversionStatus);
          
          const savedRecord = await DiagnosisDataManager.saveRecord(updatedDiagnosisData, conversionStatus);
          console.log('진단 데이터 저장 완료:', contactInfo.phone, '상태:', conversionStatus);
          
          // Supabase ID를 updatedDiagnosisData와 completeDiagnosisData 모두에 추가
          if (savedRecord.supabaseId) {
            (updatedDiagnosisData as any).supabaseId = savedRecord.supabaseId;
            (completeDiagnosisData as any).supabaseId = savedRecord.supabaseId;
            console.log('✅ Supabase ID 추가:', savedRecord.supabaseId);
          }
          
          // updatedDiagnosisData를 반환하도록 변경
          return updatedDiagnosisData;
        } catch (saveError) {
          console.error('진단 결과 저장 중 오류 (계산은 완료됨):', saveError);
        }
      } else {
        console.log('핸드폰 번호 없음 - 데이터베이스 저장 생략');
        console.log('contactInfo.phone:', contactInfo.phone);
        console.log('contactInfo.phone.trim():', contactInfo.phone?.trim());
      }
      
      return completeDiagnosisData;
    } catch (error) {
      console.error('진단 처리 중 오류 발생:', error);
      throw new Error('진단 결과를 계산하는 중 오류가 발생했습니다.');
    }
  }
  
  /**
   * 저장된 진단 데이터의 유효성 검증
   */
  static validateDiagnosisData(data: any): data is CompleteDiagnosisData {
    return (
      data &&
      typeof data === 'object' &&
      data.originalAnswers &&
      data.codedAnswers &&
      data.contactInfo &&
      data.result &&
      data.summary &&
      data.metadata &&
      typeof data.metadata.calculatedAt === 'string' &&
      typeof data.metadata.version === 'string'
    );
  }
  
  /**
   * 진단 결과를 로컬 스토리지에 저장
   */
  static saveDiagnosisResult(data: CompleteDiagnosisData): { supabaseId?: string } | null {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('diagnosisResult', JSON.stringify(data));
        return { supabaseId: (data as any).supabaseId };
      }
      return null;
    } catch (error) {
      console.error('진단 결과 저장 중 오류:', error);
      return null;
    }
  }
  
  /**
   * 로컬 스토리지에서 진단 결과 불러오기
   */
  static loadDiagnosisResult(): CompleteDiagnosisData | null {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('diagnosisResult');
        if (saved) {
          const data = JSON.parse(saved);
          if (this.validateDiagnosisData(data)) {
            return data;
          }
        }
      }
    } catch (error) {
      console.error('진단 결과 불러오기 중 오류:', error);
    }
    return null;
  }
  
  /**
   * 저장된 진단 결과 삭제
   */
  static clearDiagnosisResult(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('diagnosisResult');
      }
    } catch (error) {
      console.error('진단 결과 삭제 중 오류:', error);
    }
  }
  
  /**
   * 진단 결과 재계산 (로직 업데이트 시 사용)
   */
  static async recalculateDiagnosis(
    originalAnswers: DiagnosisAnswers,
    contactInfo: ContactInfo
  ): Promise<CompleteDiagnosisData> {
    return this.processDiagnosis(originalAnswers, contactInfo);
  }
}

/**
 * 테스트용 샘플 데이터 생성
 */
export function createSampleDiagnosisData(): CompleteDiagnosisData {
  const sampleAnswers: DiagnosisAnswers = {
    1: '혼인',
    2: '있다',
    '2_additional': '2명',
    3: '직장인(급여소득)',
    '3_additional': '200만~300만원',
    5: ['예금/적금', '자동차/오토바이'],
    6: '5천만~1억원'
  };
  
  const sampleContactInfo: ContactInfo = {
    name: '홍길동',
    phone: '010-1234-5678',
    email: 'hong@example.com'
  };
  
  const codedAnswers = mapAnswersToCode(sampleAnswers);
  const result = calculateDiagnosisResult(codedAnswers);
  const summary = generateResultSummary(result);
  
  return {
    originalAnswers: sampleAnswers,
    codedAnswers,
    contactInfo: sampleContactInfo,
    result,
    summary,
    metadata: {
      calculatedAt: new Date().toISOString(),
      version: '1.0.0'
    }
  };
}

/**
 * 진단 결과 데이터를 표 형태로 정리하는 유틸리티 함수
 */
export function formatDiagnosisDataForTable(data: CompleteDiagnosisData) {
  return {
    // 기본 정보
    basicInfo: {
      이름: data.contactInfo.name,
      연락처: data.contactInfo.phone,
      진단일시: new Date(data.metadata.calculatedAt).toLocaleString('ko-KR')
    },
    
    // 테스트 답변 요약
    testAnswers: {
      혼인여부: data.originalAnswers[1],
      미성년자녀: data.originalAnswers[2] + (data.originalAnswers['2_additional'] ? ` (${data.originalAnswers['2_additional']})` : ''),
      소득활동: data.originalAnswers[3] + (data.originalAnswers['3_additional'] ? ` (${data.originalAnswers['3_additional']})` : ''),
      보유재산: data.originalAnswers[5].join(', '),
      총채무금액: data.originalAnswers[6]
    },
    
    // 진단 결과 요약
    diagnosisResult: {
      적합제도: data.summary.eligibilityText,
      '36개월변제금': `월 ${data.result.monthlyPayment.period36.toLocaleString()}원`,
      '60개월변제금': `월 ${data.result.monthlyPayment.period60.toLocaleString()}원`,
      현재채무: `${data.result.reductionRate.currentDebt.toLocaleString()}원`,
      탕감후채무: `${data.result.reductionRate.reducedDebt.toLocaleString()}원`,
      탕감률: `${data.result.reductionRate.percentage}%`,
      탕감률비교: data.result.reductionRate.comparison === 'high' ? '높음' : 
                data.result.reductionRate.comparison === 'average' ? '보통' : '낮음'
    }
  };
}
