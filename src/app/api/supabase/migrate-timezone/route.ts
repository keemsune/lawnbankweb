import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

/**
 * 일회성 마이그레이션 API
 * 기존 Supabase 데이터의 created_at을 UTC에서 KST로 변환 (9시간 추가)
 */
export async function POST(request: Request) {
  try {
    console.log('🔄 타임존 마이그레이션 시작...');
    
    // 모든 레코드 조회
    const { data: records, error: fetchError } = await supabase
      .from('consultation_records')
      .select('id, created_at')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('❌ 레코드 조회 실패:', fetchError);
      return NextResponse.json({
        success: false,
        error: fetchError.message
      }, { status: 500 });
    }

    if (!records || records.length === 0) {
      console.log('✅ 변환할 레코드가 없습니다.');
      return NextResponse.json({
        success: true,
        message: '변환할 레코드가 없습니다.',
        updated: 0
      });
    }

    console.log(`📊 총 ${records.length}개 레코드 발견`);

    // 각 레코드의 created_at에 9시간 추가
    const updates = records.map(record => {
      const utcDate = new Date(record.created_at);
      // 9시간(KST = UTC+9) 추가
      const kstDate = new Date(utcDate.getTime() + (9 * 60 * 60 * 1000));
      
      return {
        id: record.id,
        originalTime: record.created_at,
        newTime: kstDate.toISOString()
      };
    });

    console.log('🔍 변환 샘플 (첫 3개):');
    updates.slice(0, 3).forEach(u => {
      console.log(`  ID: ${u.id}`);
      console.log(`    기존: ${u.originalTime}`);
      console.log(`    변경: ${u.newTime}`);
    });

    // 일괄 업데이트
    let successCount = 0;
    let errorCount = 0;
    const errors: any[] = [];

    for (const update of updates) {
      const { error } = await supabase
        .from('consultation_records')
        .update({ created_at: update.newTime })
        .eq('id', update.id);

      if (error) {
        console.error(`❌ 업데이트 실패 (ID: ${update.id}):`, error);
        errorCount++;
        errors.push({ id: update.id, error: error.message });
      } else {
        successCount++;
      }
    }

    console.log(`✅ 마이그레이션 완료: 성공 ${successCount}개, 실패 ${errorCount}개`);

    return NextResponse.json({
      success: true,
      message: '타임존 마이그레이션 완료',
      totalRecords: records.length,
      successCount,
      errorCount,
      errors: errors.length > 0 ? errors : undefined,
      sample: updates.slice(0, 5) // 처음 5개 샘플
    });

  } catch (error: any) {
    console.error('❌ 마이그레이션 중 오류:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '알 수 없는 오류'
    }, { status: 500 });
  }
}



