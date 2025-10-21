import { supabase, DiagnosisRecordDB } from './client';
import { DiagnosisRecord } from '../diagnosis/database';

/**
 * Supabase 진단 데이터 서비스
 */
export class SupabaseDiagnosisService {
  
  /**
   * 진단 레코드 저장
   */
  static async saveRecord(record: DiagnosisRecord): Promise<{ success: boolean; error?: string; data?: DiagnosisRecordDB }> {
    try {
      console.log('🔍 Supabase 저장할 레코드:', record);
      
      // 직접 상담신청인지 확인 (자가진단을 거치지 않은 경우)
      const isDirectConsultation = this.isDirectConsultation(record.acquisitionSource);
      console.log('🔍 직접 상담신청 여부:', isDirectConsultation);
      
      // DiagnosisRecord를 DiagnosisRecordDB 형식으로 변환
      const dbRecord = {
        customer_name: (record as any).contactInfo?.name || (record as any).customerName || null,
        phone: (record as any).contactInfo?.phone || (record as any).phone || null,
        residence: (record as any).contactInfo?.residence || (record as any).residence || null,
        acquisition_source: record.acquisitionSource,
        // 직접 상담신청인 경우 test_answers와 debt_info를 null로 저장
        test_answers: isDirectConsultation ? null : (record.originalAnswers || (record as any).testAnswers || null),
        debt_info: isDirectConsultation ? null : (record.result || (record as any).debtInfo || null),
        is_duplicate: record.isDuplicate || false,
        duplicate_count: record.duplicateCount || 0,
      };
      
      console.log('🔍 Supabase 저장할 DB 레코드:', dbRecord);

      const { data, error } = await supabase
        .from('diagnosis_records')
        .insert([dbRecord])
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase 저장 실패:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Supabase 저장 성공:', data);
      return { success: true, data };
    } catch (error: any) {
      console.error('❌ Supabase 저장 중 오류:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 모든 진단 레코드 조회
   */
  static async getAllRecords(): Promise<DiagnosisRecordDB[]> {
    try {
      const { data, error } = await supabase
        .from('diagnosis_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Supabase 조회 실패:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Supabase 조회 중 오류:', error);
      return [];
    }
  }

  /**
   * ID로 진단 레코드 조회
   */
  static async getRecordById(id: string): Promise<DiagnosisRecordDB | null> {
    try {
      const { data, error } = await supabase
        .from('diagnosis_records')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Supabase 조회 실패:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ Supabase 조회 중 오류:', error);
      return null;
    }
  }

  /**
   * 전화번호로 중복 체크
   */
  static async checkDuplicateByPhone(phone: string): Promise<{ isDuplicate: boolean; count: number }> {
    try {
      const { data, error } = await supabase
        .from('diagnosis_records')
        .select('id')
        .eq('phone', phone);

      if (error) {
        console.error('❌ 중복 체크 실패:', error);
        return { isDuplicate: false, count: 0 };
      }

      const count = data?.length || 0;
      return {
        isDuplicate: count > 0,
        count: count
      };
    } catch (error) {
      console.error('❌ 중복 체크 중 오류:', error);
      return { isDuplicate: false, count: 0 };
    }
  }

  /**
   * 레코드 업데이트
   */
  static async updateRecord(id: string, updates: Partial<DiagnosisRecordDB>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('diagnosis_records')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('❌ Supabase 업데이트 실패:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Supabase 업데이트 성공');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Supabase 업데이트 중 오류:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 레코드 삭제
   */
  static async deleteRecord(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('diagnosis_records')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Supabase 삭제 실패:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Supabase 삭제 성공');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Supabase 삭제 중 오류:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * DiagnosisRecordDB를 DiagnosisRecord로 변환
   */
  static convertToRecord(dbRecord: DiagnosisRecordDB): DiagnosisRecord {
    const record: any = {
      id: dbRecord.id,
      createdAt: dbRecord.created_at,
      updatedAt: dbRecord.created_at,
      status: 'completed',
      acquisitionSource: dbRecord.acquisition_source,
      isDuplicate: dbRecord.is_duplicate,
      duplicateCount: dbRecord.duplicate_count,
      
      // CompleteDiagnosisData 구조에 맞게 변환
      contactInfo: {
        name: dbRecord.customer_name || '',
        phone: dbRecord.phone || '',
        residence: dbRecord.residence || '',
      },
      originalAnswers: dbRecord.test_answers || {},
      codedAnswers: {},
      result: dbRecord.debt_info || {},
      summary: {
        eligibilityText: '',
        paymentText: '',
        reductionText: '',
        comparisonText: '',
      },
      metadata: {
        calculatedAt: dbRecord.created_at,
        version: '1.0.0',
      },
      
      // 하위 호환성을 위한 추가 필드
      customerName: dbRecord.customer_name || undefined,
      phone: dbRecord.phone || undefined,
      residence: dbRecord.residence || undefined,
      testAnswers: dbRecord.test_answers || undefined,
      debtInfo: dbRecord.debt_info || undefined,
    };
    return record as DiagnosisRecord;
  }

  /**
   * 직접 상담신청인지 확인 (자가진단을 거치지 않은 경우)
   */
  private static isDirectConsultation(acquisitionSource: string): boolean {
    // 자가진단을 통해 유입되는 경우
    const diagnosisBasedSources = [
      'test',               // 테스트만 완료 (전환 안함)
      '결과_서비스혜택',    // 진단전환_혜택
      '결과_진행절차',      // 진단전환_절차
      '테스트_전환'         // 진단전환
    ];
    
    // 자가진단을 거치지 않은 직접 상담신청
    return !diagnosisBasedSources.includes(acquisitionSource);
  }
}

