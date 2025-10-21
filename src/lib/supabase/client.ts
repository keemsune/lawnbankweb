import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 생성
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 데이터베이스 타입 정의
export interface DiagnosisRecordDB {
  id: string;
  created_at: string;
  customer_name: string | null;
  phone: string | null;
  residence: string | null;
  acquisition_source: string;
  test_answers: any | null;
  debt_info: any | null;
  is_duplicate: boolean;
  duplicate_count: number;
}

