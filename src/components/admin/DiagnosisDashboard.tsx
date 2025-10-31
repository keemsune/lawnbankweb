'use client';

import React, { useState, useEffect } from 'react';
import { DiagnosisDataManager, DiagnosisTableRow, DiagnosisFilter, DiagnosisSortOption } from '@/lib/diagnosis/database';
import { SupabaseDiagnosisService } from '@/lib/supabase/diagnosisService';

interface DiagnosisDashboardProps {
  className?: string;
}

export default function DiagnosisDashboard({ className }: DiagnosisDashboardProps) {
  const [records, setRecords] = useState<DiagnosisTableRow[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<DiagnosisFilter>({});
  const [sort, setSort] = useState<DiagnosisSortOption>({ field: 'createdAt', direction: 'desc' });
  const [isLoading, setIsLoading] = useState(false);
  const [statistics, setStatistics] = useState<any>(null);

  const pageSize = 10;

  // 데이터 로드
  const loadData = async () => {
    setIsLoading(true);
    try {
      console.log('=== 데이터 로드 시작 ===');
      
      // Supabase에서 데이터 조회
      console.log('🔄 Supabase 데이터 조회 중...');
      const supabaseRecords = await SupabaseDiagnosisService.getAllRecords();
      console.log('✅ Supabase 레코드 수:', supabaseRecords.length);
      
      // Supabase 데이터를 DiagnosisRecord 형식으로 변환
      const convertedRecords = supabaseRecords.map(dbRecord => 
        SupabaseDiagnosisService.convertToRecord(dbRecord)
      );
      console.log('변환된 레코드:', convertedRecords);
      
      // localStorage 데이터도 조회 (백업용)
      const localRecords = DiagnosisDataManager.getAllRecords();
      console.log('localStorage 레코드 수:', localRecords.length);
      
      // Supabase 데이터를 우선 사용, 없으면 localStorage 사용
      const allRecords = supabaseRecords.length > 0 ? convertedRecords : localRecords;
      console.log('사용할 전체 레코드 수:', allRecords.length);
      
      // 필터링 및 정렬 (간단한 버전)
      let filteredRecords = [...allRecords];
      
      // 정렬
      filteredRecords.sort((a, b) => {
        const aValue = a[sort.field as keyof typeof a];
        const bValue = b[sort.field as keyof typeof b];
        if (sort.direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
      
      // 페이지네이션
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedRecords = filteredRecords.slice(startIndex, endIndex);
      
      const tableRows = DiagnosisDataManager.convertToTableRows(paginatedRecords);
      console.log('테이블 행 수:', tableRows.length);
      
      setRecords(tableRows);
      setTotal(filteredRecords.length);
      setTotalPages(Math.ceil(filteredRecords.length / pageSize));
      
      // 통계 데이터도 로드
      const stats = DiagnosisDataManager.getStatistics();
      console.log('통계 데이터:', stats);
      setStatistics(stats);
      
      console.log('=== 데이터 로드 완료 ===');
    } catch (error) {
      console.error('데이터 로드 중 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentPage, filter, sort]);

  // 필터 적용
  const handleFilterChange = (newFilter: Partial<DiagnosisFilter>) => {
    setFilter({ ...filter, ...newFilter });
    setCurrentPage(1);
  };

  // 정렬 변경
  const handleSortChange = (field: keyof DiagnosisTableRow) => {
    const newDirection = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    setSort({ field, direction: newDirection });
  };

  // CSV 내보내기
  const handleExportCSV = () => {
    const csvContent = DiagnosisDataManager.exportToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `diagnosis_records_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 레코드 삭제
  const handleDeleteRecord = (id: string) => {
    if (confirm('정말로 이 레코드를 삭제하시겠습니까?')) {
      DiagnosisDataManager.deleteRecord(id);
      loadData();
    }
  };

  // 모든 데이터 초기화
  const handleClearAllData = () => {
    if (confirm('모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      localStorage.removeItem('diagnosis_records');
      loadData();
      alert('모든 데이터가 삭제되었습니다.');
    }
  };

  // 전환 상태는 이제 사용자가 연락처 입력 여부에 따라 자동 결정됨

  return (
    <div className={`diagnosis-dashboard ${className || ''}`}>
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">상담 관리 대시보드</h1>
        <p className="text-gray-600">사용자들의 진단 테스트 결과를 확인하고 상담을 관리할 수 있습니다.</p>
      </div>

      {/* 통계 카드 */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">전체 진단 수</h3>
            <p className="text-2xl font-bold text-blue-600">{statistics.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">진단→상담 전환율</h3>
            <p className="text-2xl font-bold text-orange-600">{statistics.conversionRate?.conversionPercentage || 0}%</p>
            <p className="text-xs text-gray-500 mt-1">전환: {statistics.conversionRate?.converted || 0} / 진단완료: {statistics.conversionRate?.total || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">평균 탕감률</h3>
            <p className="text-2xl font-bold text-green-600">{statistics.averageReductionRate}%</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">개인회생 적합</h3>
            <p className="text-2xl font-bold text-purple-600">{statistics.byRecommendation.recovery || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">파산면책 적합</h3>
            <p className="text-2xl font-bold text-red-600">{statistics.byRecommendation.bankruptcy || 0}</p>
          </div>
        </div>
      )}

      {/* 필터 및 검색 */}
      <div className="bg-white p-4 rounded-lg shadow border mb-6">
        <div className="space-y-4">
          {/* 첫 번째 행 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름/전화번호 검색</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="검색어 입력"
                value={filter.searchText || ''}
                onChange={(e) => handleFilterChange({ searchText: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">추천 제도</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filter.recommendation?.[0] || ''}
                onChange={(e) => handleFilterChange({ 
                  recommendation: e.target.value ? [e.target.value as any] : undefined 
                })}
              >
                <option value="">전체</option>
                <option value="recovery">개인회생</option>
                <option value="bankruptcy">파산면책</option>
                <option value="both">회생/파산 모두</option>
                <option value="none">부적합</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">탕감률 범위</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="최소"
                  min="0"
                  max="100"
                  value={filter.reductionRateRange?.min || ''}
                  onChange={(e) => handleFilterChange({
                    reductionRateRange: {
                      ...filter.reductionRateRange,
                      min: Number(e.target.value) || 0,
                      max: filter.reductionRateRange?.max || 100
                    }
                  })}
                />
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="최대"
                  min="0"
                  max="100"
                  value={filter.reductionRateRange?.max || ''}
                  onChange={(e) => handleFilterChange({
                    reductionRateRange: {
                      min: filter.reductionRateRange?.min || 0,
                      max: Number(e.target.value) || 100
                    }
                  })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">유입경로</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filter.acquisitionSource?.[0] || ''}
                onChange={(e) => handleFilterChange({ 
                  acquisitionSource: e.target.value ? [e.target.value as any] : undefined 
                })}
              >
                <option value="">전체</option>
                <option value="test">테스트</option>
                <option value="헤더_상담신청">헤더_상담신청</option>
                <option value="테스트_전환">진단전환</option>
                <option value="결과_서비스혜택">진단전환_혜택</option>
                <option value="결과_진행절차">진단전환_절차</option>
                <option value="서비스_CTA">서비스_CTA</option>
                <option value="문의_방문상담">문의_방문상담</option>
                <option value="문의_간편상담">문의_간편상담</option>
                <option value="하단바_상담신청">하단바_상담신청</option>
              </select>
            </div>
          </div>

          {/* 두 번째 행 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">상담 유형</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filter.consultationType?.[0] || ''}
                onChange={(e) => handleFilterChange({ 
                  consultationType: e.target.value ? [e.target.value as any] : undefined 
                })}
              >
                <option value="">전체</option>
                <option value="phone">전화상담</option>
                <option value="visit">방문상담</option>
              </select>
            </div>
            <div></div>
            <div></div>
            <div className="flex items-end space-x-2">
              <button
                onClick={handleExportCSV}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                CSV 내보내기
              </button>
              <button
                onClick={handleClearAllData}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                데이터 초기화
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            리스트 ({total}건)
          </h2>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">데이터를 불러오는 중...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSortChange('createdAt')}
                  >
                    생성일시 {sort.field === 'createdAt' && (sort.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    연락처
                  </th>
                  <th className="w-64 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    테스트 답변
                  </th>
                  <th 
                    className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSortChange('recommendation')}
                  >
                    추천 제도 {sort.field === 'recommendation' && (sort.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="w-20 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSortChange('reductionRate')}
                  >
                    탕감률 {sort.field === 'reductionRate' && (sort.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="w-48 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    채무 정보
                  </th>
                  <th 
                    className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSortChange('acquisitionSource')}
                  >
                    유입경로 {sort.field === 'acquisitionSource' && (sort.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="w-20 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 text-xs text-gray-900">
                      <div className="space-y-0.5">
                        <div className="font-medium">
                          {(() => {
                            const parts = record.createdAt.split(' ');
                            // 새 형식: "2025.09.09 09:17:45" -> ["2025.09.09", "09:17:45"]
                            // 기존 형식: "2025. 9. 9. 오전 9:17:29" -> ["2025.", "9.", "9.", "오전", "9:17:29"]
                            if (parts.length === 2) {
                              return parts[0]; // 새 형식
                            } else {
                              // 기존 형식에서 날짜 부분만 추출
                              return parts.slice(0, 3).join(' ');
                            }
                          })()}
                        </div>
                        <div className="text-gray-500">
                          {(() => {
                            const parts = record.createdAt.split(' ');
                            if (parts.length === 2) {
                              return parts[1]; // 새 형식
                            } else {
                              // 기존 형식에서 시간 부분만 추출
                              return parts.slice(3).join(' ');
                            }
                          })()}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{record.name}</div>
                        <div className="text-gray-500">{record.phone}</div>
                        {record.consultationType && (
                          <div className="text-xs text-blue-600">
                            {record.consultationType === 'phone' ? '전화상담' : '방문상담'}
                          </div>
                        )}
                        {record.residence && (
                          <div className="text-xs text-green-600">{record.residence}</div>
                        )}
                        {record.isDuplicate && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              중복 ({record.duplicateCount}회)
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {record.maritalStatus === '-' && record.children === '-' && record.income === '-' && record.assets === '-' && record.debt === '-' ? (
                        <div>-</div>
                      ) : (
                        <div className="space-y-1">
                          <div>{record.maritalStatus === '-' ? '-' : <><span className="font-medium">혼인:</span> {record.maritalStatus}</>}</div>
                          <div>{record.children === '-' ? '-' : <><span className="font-medium">자녀:</span> {record.children}</>}</div>
                          <div>{record.income === '-' ? '-' : <><span className="font-medium">소득:</span> {record.income}</>}</div>
                          <div>{record.assets === '-' ? '-' : <><span className="font-medium">재산:</span> {record.assets}</>}</div>
                          <div>{record.debt === '-' ? '-' : <><span className="font-medium">채무:</span> {record.debt}</>}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.recommendation === '개인회생' ? 'bg-blue-100 text-blue-800' :
                        record.recommendation === '파산면책' ? 'bg-red-100 text-red-800' :
                        record.recommendation === '회생/파산 모두' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {record.recommendation}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span className="font-medium text-lg">{record.reductionRate}</span>
                        <span className={`ml-2 text-xs ${
                          record.comparison === '높음' ? 'text-green-600' :
                          record.comparison === '낮음' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          ({record.comparison})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {record.currentDebt === '-' && record.reducedDebt === '-' && record.monthlyPayment36 === '-' && record.monthlyPayment60 === '-' ? (
                        <div>-</div>
                      ) : (
                        <div className="space-y-1">
                          <div>{record.currentDebt === '-' ? '-' : <><span className="font-medium">현재:</span> {record.currentDebt}</>}</div>
                          <div>{record.reducedDebt === '-' ? '-' : <><span className="font-medium">탕감후:</span> {record.reducedDebt}</>}</div>
                          <div>{record.monthlyPayment36 === '-' ? '-' : <><span className="font-medium">36개월:</span> {record.monthlyPayment36}</>}</div>
                          <div>{record.monthlyPayment60 === '-' ? '-' : <><span className="font-medium">60개월:</span> {record.monthlyPayment60}</>}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.acquisitionSource === '전환완료' ? 'bg-green-100 text-green-800' :
                        record.acquisitionSource === '간편상담신청' ? 'bg-blue-100 text-blue-800' :
                        record.acquisitionSource === '헤더_상담신청' ? 'bg-purple-100 text-purple-800' :
                        record.acquisitionSource === '진단전환' ? 'bg-emerald-100 text-emerald-800' :
                        record.acquisitionSource === '진단전환_혜택' ? 'bg-emerald-100 text-emerald-800' :
                        record.acquisitionSource === '진단전환_절차' ? 'bg-emerald-100 text-emerald-800' :
                        record.acquisitionSource === '서비스_CTA' ? 'bg-orange-100 text-orange-800' :
                        record.acquisitionSource === '문의_방문상담' ? 'bg-pink-100 text-pink-800' :
                        record.acquisitionSource === '문의_간편상담' ? 'bg-cyan-100 text-cyan-800' :
                        record.acquisitionSource === '하단바_상담신청' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {record.acquisitionSource}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 페이지네이션 */}
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            전체 {total}건 중 {total === 0 ? 0 : ((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, total)}건 표시
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            <span className="px-3 py-1 text-sm">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
