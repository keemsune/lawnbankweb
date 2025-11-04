'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ArrowRight, User, CheckCircle, TrendingUp, Calculator, FileText, ChevronDown, Headset } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { DiagnosisService, CompleteDiagnosisData } from '@/lib/diagnosis';
import { DiagnosisDataManager } from '@/lib/diagnosis/database';

export default function DiagnosisResult() {
  const [diagnosisData, setDiagnosisData] = useState<CompleteDiagnosisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 연락처 입력 관련 상태 (사용하지 않음 - 섹션7에서 통합 처리)
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  
  // 상담 신청 관련 상태
  const [consultationType, setConsultationType] = useState<'phone' | 'visit' | ''>('');
  const [contact, setContact] = useState('');
  const [residence, setResidence] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // 간편상담신청 모달 상태
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [modalConsultationType, setModalConsultationType] = useState<'phone' | 'visit' | ''>(''); // 아무것도 선택되지 않음
  const [modalContact, setModalContact] = useState('');
  const [modalResidence, setModalResidence] = useState('');
  const [acquisitionSource, setAcquisitionSource] = useState<string>('결과_서비스혜택');
  const [isModalSubmission, setIsModalSubmission] = useState(false); // 모달에서 제출되었는지 구분

  useEffect(() => {
    // 로컬 스토리지에서 진단 결과 불러오기
    const loadDiagnosisResult = () => {
      try {
        const data = DiagnosisService.loadDiagnosisResult();
        if (data) {
          setDiagnosisData(data);
        } else {
          console.log('저장된 진단 결과가 없습니다.');
        }
      } catch (error) {
        console.error('진단 결과 불러오기 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDiagnosisResult();
  }, []);

  // 상담 신청 폼 제출 핸들러 (모달 열기)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consultationType || !contact || !residence) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    // 섹션7에서 제출됨을 표시
    setIsModalSubmission(false);
    
    // 최종 확인 모달 열기
    setShowConfirmModal(true);
  };

  // 실제 상담 신청 처리
  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setIsSubmittingContact(true);
    
    try {
      console.log('상담 신청 데이터:', {
        consultationType,
        contact,
        residence
      });

      // 기존 진단 데이터 업데이트
      const allRecords = DiagnosisDataManager.getAllRecords();
      if (allRecords.length > 0) {
        // 가장 최근 기록 찾기 (생성일 기준으로 정렬해서 첫 번째)
        const sortedRecords = allRecords.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const latestRecord = sortedRecords[0];
        
        // DiagnosisDataManager의 updateContactInfoAndConversion 메서드 사용 (진단 레코드 전달)
        const result = await DiagnosisDataManager.updateContactInfoAndConversion(
          latestRecord.id,
          latestRecord.contactInfo?.name || '',
          contact,
          '테스트_전환',
          consultationType as 'phone' | 'visit',
          residence,
          latestRecord // 진단 레코드 전달
        );
        
        if (result.success) {
          console.log('상담 신청 정보가 성공적으로 저장되었습니다.');
          setContactSubmitted(true);
          alert(result.message || '상담 신청이 완료되었습니다!');
        } else {
          console.error('DB 업데이트 실패:', result.message);
          alert(result.message || '상담 신청에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        console.log('업데이트할 테스트 기록이 없습니다');
        alert('진단 기록을 찾을 수 없습니다. 진단 테스트를 먼저 완료해주세요.');
      }
    } catch (error) {
      console.error('상담 신청 중 오류:', error);
      alert('상담 신청 중 오류가 발생했습니다.');
    } finally {
      setIsSubmittingContact(false);
    }
  };

  // 간편상담신청 모달 핸들러
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 입력값 검증
    if (!modalConsultationType || !modalContact || !modalResidence) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // 모달에서 제출됨을 표시
    setIsModalSubmission(true);
    
    // 최종 확인 모달 열기
    setShowConfirmModal(true);
  };

  // 모달 상담신청 확인 처리 (기존 테스트 DB 전환)
  const handleModalConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setIsSubmittingContact(true);
    
    try {
      console.log('모달 상담 신청 데이터:', {
        consultationType: modalConsultationType,
        contact: modalContact,
        residence: modalResidence,
        acquisitionSource: acquisitionSource
      });

      // Supabase ID 가져오기: 세션 스토리지 -> 로컬 스토리지 -> 현재 diagnosisData
      let supabaseId = sessionStorage.getItem('current_diagnosis_id');
      
      // 세션에 없으면 로컬 스토리지의 diagnosisResult에서 가져오기
      if (!supabaseId) {
        console.log('⚠️ 세션 스토리지에 ID 없음, 로컬 스토리지 확인...');
        const savedResult = localStorage.getItem('diagnosisResult');
        if (savedResult) {
          const parsedResult = JSON.parse(savedResult);
          supabaseId = parsedResult.supabaseId || (parsedResult as any).supabaseId;
          console.log('✅ 로컬 스토리지에서 가져온 Supabase ID:', supabaseId);
        }
      } else {
        console.log('✅ 세션에서 가져온 Supabase ID:', supabaseId);
      }
      
      // 여전히 없으면 현재 diagnosisData에서 가져오기
      if (!supabaseId && diagnosisData) {
        supabaseId = (diagnosisData as any).supabaseId;
        console.log('⚠️ diagnosisData에서 가져온 Supabase ID:', supabaseId);
      }
      
      if (!supabaseId) {
        console.error('❌ Supabase ID를 찾을 수 없습니다.');
        console.log('📋 현재 상태:', {
          sessionStorage: sessionStorage.getItem('current_diagnosis_id'),
          localStorage: localStorage.getItem('diagnosisResult'),
          diagnosisData: diagnosisData
        });
        alert('진단 기록을 찾을 수 없습니다. 진단 테스트를 다시 진행해주세요.');
        setIsSubmittingContact(false);
        return;
      }
      
      // 진단 레코드 찾기
      const allRecords = DiagnosisDataManager.getAllRecords();
      const diagnosisRecord = allRecords.find(r => 
        r.id === supabaseId || (r as any).supabaseId === supabaseId
      );
      
      // DiagnosisDataManager의 updateContactInfoAndConversion 메서드 사용 (진단 레코드 전달)
      const result = await DiagnosisDataManager.updateContactInfoAndConversion(
        supabaseId, // Supabase ID 사용
        '', // name은 서버에서 생성
        modalContact,
        acquisitionSource, // 유입경로를 acquisitionSource로 설정
        modalConsultationType as 'phone' | 'visit',
        modalResidence,
        diagnosisRecord // 진단 레코드 전달
      );
        
      if (result.success) {
        console.log('테스트 DB가 성공적으로 전환되었습니다.');
        alert(result.message || '상담 신청이 완료되었습니다!');
        
        // 세션 스토리지에서 ID 제거
        sessionStorage.removeItem('current_diagnosis_id');
        
        // 폼 초기화
        setModalConsultationType(''); // 아무것도 선택되지 않음
        setModalContact('');
        setModalResidence('');
        setShowConsultationModal(false);
      } else {
        console.error('DB 업데이트 실패:', result.message);
        alert(result.message || '상담 신청에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('상담 신청 중 오류:', error);
      alert('상담 신청 중 오류가 발생했습니다.');
    } finally {
      setIsSubmittingContact(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-2 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-foreground">진단 결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!diagnosisData) {
    return (
      <div className="min-h-screen bg-background-2 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-heading-xl text-foreground mb-4">진단 결과를 찾을 수 없습니다</h1>
          <p className="text-body-lg text-muted-foreground mb-6">
            진단 테스트를 먼저 완료해주세요.
          </p>
          <Link href="/diagnosis/test">
            <Button colorVariant="default" styleVariant="fill" size="base">
              진단 테스트 하러가기
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { result, summary, contactInfo, metadata } = diagnosisData;

  return (
    <div className="min-h-screen bg-background-1 relative md:bg-background-2 md:px-4">
      {/* 배경 이미지 - 데스크탑에서만 */}
      <div className="absolute top-0 left-0 right-0 bottom-0 z-0 flex flex-col justify-start items-center hidden md:flex pt-14">
        {/* 이미지 1 */}
        <div className="w-[90%] h-auto relative">
          <Image
            src="/images/diagnosis/test/diagnosis_test_bg.webp"
            alt="테스트 배경 이미지 1"
            width={1200}
            height={800}
            className="object-contain w-full h-auto"
            priority
          />
        </div>
        
        {/* 간격 */}
        <div className="h-20"></div>
        
        {/* 이미지 2 */}
        <div className="w-[90%] h-auto relative">
          <Image
            src="/images/diagnosis/test/diagnosis_test_bg.webp"
            alt="테스트 배경 이미지 2"
            width={1200}
            height={800}
            className="object-contain w-full h-auto"
          />
        </div>
      </div>
      
      {/* 콘텐츠 */}
      <div className="relative z-20 flex flex-col items-center min-h-screen md:py-14 md:px-4">

        {/* 1. 회생파산 제도 적합성 */}
        <div className="w-full md:max-w-[588px] md:mb-6 md:rounded-3xl md:shadow-2xl" style={{background: 'linear-gradient(143deg, var(--primary-primary, #059669) 11.16%, var(--tertiary-tertiary, #3B82F6) 88.29%)'}}>
          <div className="px-4 md:px-6 md:pt-5 md:pb-4">
            {/* 1단: 네비게이션 버튼 */}
            <div className="pt-5 pb-4 md:pt-0 md:pb-4 flex justify-between items-center">
              <Link 
                href="/diagnosis/test"
                className="flex items-center gap-1 text-label-sm-css text-white hover:opacity-80 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
                처음으로
              </Link>
              
              <Link 
                href="/diagnosis"
                className="text-label-sm text-white hover:opacity-80 transition-opacity"
              >
                나가기
              </Link>
            </div>
            
            {/* 2단: 컨텐츠 */}
            <div className="py-14 md:px-8 md:py-10 space-y-8">
              {/* 1. 타이틀 */}
              <div className="flex justify-center items-center gap-6 md:justify-center md:gap-0">
                {/* 좌측 이미지 (모바일에서만 표시) */}
                <div className="w-14 h-14 flex-shrink-0 md:hidden">
                  <img 
                    src="/images/diagnosis/test/diagnosis_test_2.webp" 
                    alt="진단 이미지 2"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="bg-white rounded-full px-6 py-2 md:px-8">
                  <span 
                    className="font-title font-black text-[20px] leading-[24px] md:text-[24px] md:leading-[32px]"
                    style={{
                      background: 'linear-gradient(90deg, var(--tertiary-tertiary, #3B82F6) 0%, var(--primary-primary, #059669) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    진단 결과 확인
                  </span>
                </div>

                {/* 우측 이미지 (모바일에서만 표시) */}
                <div className="w-14 h-14 flex-shrink-0 md:hidden">
                  <img 
                    src="/images/diagnosis/test/diagnosis_test_3.webp" 
                    alt="진단 이미지 3"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* 2. 텍스트 */}
              <div className="flex items-center justify-between w-full md:flex md:md:items-center md:justify-between">
                {/* 좌측 이미지 (데스크탑에서만 표시) */}
                <div className="w-20 h-20 flex-shrink-0 hidden md:block">
                  <img 
                    src="/images/diagnosis/test/diagnosis_test_2.webp" 
                    alt="진단 이미지 2"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* 텍스트 */}
                <div className="text-center flex-1">
                  <div className="font-title font-black text-[20px] leading-[30px] text-white mb-2">
                    고객님은
                  </div>
                  <div className="font-title font-black text-[32px] leading-[42px] md:text-[36px] md:leading-[46px] text-white">
                    {diagnosisData?.result?.eligibility?.recommendation === 'recovery' ? '개인회생' : '개인파산'} 신청이<br />
                    가능해요!
                  </div>
                </div>

                {/* 우측 이미지 (데스크탑에서만 표시) */}
                <div className="w-20 h-20 flex-shrink-0 hidden md:block">
                  <img 
                    src="/images/diagnosis/test/diagnosis_test_3.webp" 
                    alt="진단 이미지 3"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* 3. 이미지 */}
              <div className="flex justify-center">
                <div className="w-40 h-40 md:w-56 md:h-56">
                  <img 
                    src="/images/diagnosis/test/diagnosis_test_4.webp" 
                    alt="진단 이미지 4"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. 상황 요약 */}
        <div className="w-full md:max-w-[588px] md:mb-6 bg-muted md:rounded-3xl md:shadow-2xl">
          <div className="px-4 py-14 md:px-8 md:py-10 space-y-6 md:space-y-10">
              {/* 1단: 타이틀 */}
              <div className="flex justify-center">
                <div className="bg-accent rounded-full px-6 py-2 flex items-center">
                  <span className="font-title font-black text-[14px] leading-none md:text-[18px] md:leading-[24px] text-accent-foreground">
                    고객님의 상황 요약
                  </span>
                </div>
              </div>

              {/* 2단: 컨텐츠 */}
              <div className="bg-card rounded-2xl p-6 md:p-8">
                <div className="space-y-3">
                  {(() => {
                    // 상황 요약 항목들을 동적으로 생성
                    const summaryItems = [
                      {
                        title: '혼인 상태',
                        value: diagnosisData?.originalAnswers?.[1] || '미입력'
                      },
                      {
                        title: '미성년 자녀',
                        value: diagnosisData?.originalAnswers?.[2] || '미입력'
                      },
                      {
                        title: '소득 활동',
                        values: (() => {
                          const incomeType = diagnosisData?.originalAnswers?.[3];
                          const incomeAmount = diagnosisData?.originalAnswers?.['3_additional'];
                          const result = [];
                          
                          if (incomeType) {
                            result.push(incomeType === '소득이 없다' ? '소득 없음' : incomeType);
                          }
                          if (incomeAmount && incomeType !== '소득이 없다') {
                            result.push(incomeAmount);
                          }
                          
                          return result.length > 0 ? result : ['미입력'];
                        })()
                      },
                      {
                        title: '보유 재산',
                        values: diagnosisData?.originalAnswers?.[5]?.length > 0 
                          ? diagnosisData.originalAnswers[5]
                          : ['없음']
                      },
                      {
                        title: '총 채무 금액',
                        value: diagnosisData?.originalAnswers?.[6] || '미입력'
                      }
                    ];

                    return summaryItems.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="text-heading-md md:text-heading-lg text-foreground">{item.title}</div>
                        <div>
                          {item.values ? (
                            // 여러 값이 있는 경우 각각을 개별 프레임으로 표시
                            item.values.map((value, valueIndex) => (
                              <div key={valueIndex} className="bg-card border border-primary rounded-full py-0.5 px-3 inline-flex items-center mr-2">
                                <span className="text-label-sm md:text-label-md text-primary">
                                  {value}
                                </span>
                              </div>
                            ))
                          ) : (
                            // 단일 값인 경우 기존 방식으로 표시
                            <div className="bg-card border border-primary rounded-full py-0.5 px-3 inline-flex items-center">
                              <span className="text-label-sm md:text-label-md text-primary">
                                {item.value}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
          </div>
        </div>

        {/* 3. 월 변제금 예측 */}
        <div className="w-full md:max-w-[588px] md:mb-6 bg-card md:rounded-3xl md:shadow-2xl">
          <div className="px-4 py-14 md:px-8 md:py-10 space-y-10">
              {/* 1단: 타이틀 */}
              <div className="flex justify-center">
                <div className="bg-accent rounded-full px-6 py-2 flex items-center">
                  <span className="font-title font-black text-[14px] leading-[18px] md:text-[18px] md:leading-[24px] text-accent-foreground">
                    채무해결책
                  </span>
                </div>
              </div>

              {/* 2단: 컨텐츠 */}
              <div className="space-y-8 md:space-y-10">
                {/* 1. 이미지 */}
                <div className="w-full flex items-end relative h-36 md:h-[168px]">
                  <div className="w-full bg-emerald-50 rounded-2xl z-10 h-[88px] md:h-[104px]">
                    {/* 박스 내용 */}
                  </div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20 flex justify-center h-[120px] md:h-[144px]">
                    <img 
                      src="/images/diagnosis/test/diagnosis_test_5.webp" 
                      alt="진단 이미지 5"
                      className="h-full w-auto object-contain"
                    />
                  </div>
                </div>

                {/* 2. 타이틀 */}
                <div className="text-center">
                  <div className="font-title font-black text-[24px] leading-[32px] md:text-[36px] md:leading-[46px]">
                    <span className="text-foreground">회생터치가 제시하는</span><br />
                    <span className="text-primary">채무해결책</span>
                  </div>
                </div>

                {/* 3. 변제금 박스 */}
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 pt-4">
                  {/* 36개월 박스 */}
                  <div className="flex-1 rounded-2xl shadow-xl p-2 relative" style={{background: 'linear-gradient(135deg, var(--primary-primary, #059669), var(--secondary-secondary, #F59E0B))'}}>
                    {/* 배지 */}
                       <div className="absolute -top-3 left-4 z-20 flex items-center bg-white px-2 py-1">
                         <img 
                           src="/images/main/review/main_review_1.webp" 
                           alt="리뷰 아이콘" 
                           className="w-[25px] h-auto object-contain mr-1"
                         />
                         <div className="flex items-center bg-secondary rounded-full px-3 py-1">
                           <span className="font-title font-normal text-[12px] leading-[16px] text-secondary-foreground">회생터치 pick!</span>
                         </div>
                       </div>
                    
                    <div className="bg-card rounded-xl px-6 pt-8 pb-6 relative z-10">
                      <div className="space-y-1">
                        <div className="text-heading-md text-primary">36개월 동안</div>
                        <div className="text-display-xs text-foreground">
                          월 {result.monthlyPayment.period36.toLocaleString()}원
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 60개월 박스 */}
                  <div className="flex-1 bg-card rounded-2xl shadow-xl p-2 border border-primary">
                    <div className="px-6 pt-8 pb-6">
                      <div className="space-y-1">
                        <div className="text-heading-md text-primary">60개월 동안</div>
                        <div className="text-display-xs text-foreground">
                          월 {result.monthlyPayment.period60.toLocaleString()}원
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. 탕감 그래프 */}
                <div className="bg-muted rounded-2xl pt-6 md:pt-8 pb-6 md:pb-8 px-6 md:px-8">
                  {/* 상단 텍스트 */}
                  <div className="text-left mb-8">
                    <div className="font-title text-[20px] leading-[26px] text-foreground md:text-[24px] md:leading-[30px]">
                      <span className="text-foreground">{result.eligibility.recommendation === 'recovery' ? '개인회생' : '개인파산'}을 진행하면</span><br />
                      <span className="text-primary">{(result.reductionRate.currentDebt - result.reductionRate.reducedDebt).toLocaleString()}원</span>
                      <span className="text-foreground">이 탕감돼요</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-center gap-4 md:gap-8">
                    {/* 현재 채무 */}
                    <div className="flex flex-col items-center">
                      {/* 금액 표시 */}
                      <div className="bg-muted-foreground text-muted px-3 py-1 rounded-full mb-2 text-sm font-medium">
                        {result.reductionRate.currentDebt.toLocaleString()}원
                      </div>
                      {/* 막대 */}
                      <div className="bg-muted-foreground rounded-lg w-12 md:w-[60px]" style={{height: '120px'}}></div>
                      {/* 라벨 */}
                      <div className="mt-2 text-heading-md text-muted-foreground">
                        현재 채무
                      </div>
                    </div>

                    {/* 탕감 후 채무 */}
                    <div className="flex flex-col items-center">
                      {/* 금액 표시 */}
                      <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full mb-2 text-sm font-medium">
                        {result.reductionRate.reducedDebt.toLocaleString()}원
                      </div>
                      {/* 막대 */}
                      <div className="bg-primary rounded-lg w-12 md:w-[60px]" style={{height: `${(result.reductionRate.reducedDebt / result.reductionRate.currentDebt) * 120}px`}}></div>
                      {/* 라벨 */}
                      <div className="mt-2 text-heading-md text-primary">
                        탕감 후 채무
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>

        {/* 4. 탕감률 */}
        <div className="w-full md:max-w-[588px] md:mb-6 md:rounded-3xl md:shadow-2xl" style={{background: 'linear-gradient(152deg, var(--emerald-800, #065F46) 23.34%, var(--blue-800, #1D4ED8) 95.25%)'}}>
          <div className="px-4 py-14 md:px-8 md:py-10 space-y-6 md:space-y-8">
              {/* 1단: 타이틀 */}
              <div className="flex justify-center">
                <div className="bg-accent rounded-full px-6 py-2">
                  <span className="font-title font-black text-[14px] leading-[18px] md:text-[18px] md:leading-[24px] flex items-center text-accent-foreground">
                    탕감률
                  </span>
                </div>
              </div>

              {/* 2단: 컨텐츠 */}
              <div className="space-y-10">
                {/* 1. 텍스트 */}
                <div className="text-center">
                  <div className="font-title font-black text-[20px] leading-[30px] text-white">
                    내 탕감률은
                  </div>
                </div>

                {/* 2. 탕감률 */}
                <div className="flex items-center justify-center gap-6 md:gap-14" style={{marginTop: '12px'}}>
                  {/* 좌측 이미지 */}
                  <div className="flex-shrink-0 w-14 h-14 md:w-[88px] md:h-[88px]">
                    <img 
                      src="/images/diagnosis/test/diagnosis_test_2.webp" 
                      alt="진단 이미지 2"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* 가운데 텍스트 */}
                  <div className="text-center">
                    <div 
                      className="font-title font-black text-[56px] leading-[64px]"
                      style={{
                        background: 'linear-gradient(90deg, var(--amber-200, #FDE68A) 0%, var(--emerald-300, #6EE7B7) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}
                    >
                      {result.reductionRate.percentage}%
                    </div>
                  </div>

                  {/* 우측 이미지 */}
                  <div className="flex-shrink-0 w-14 h-14 md:w-[88px] md:h-[88px]">
                    <img 
                      src="/images/diagnosis/test/diagnosis_test_3.webp" 
                      alt="진단 이미지 3"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* 3. 탕감률 그래프 */}
                <div className="bg-card rounded-2xl p-6 md:p-8" style={{marginTop: '40px'}}>
                  <div className="space-y-6">
                    {/* 텍스트 */}
                    <div className="text-left">
                      <div className="font-title font-black text-[20px] leading-[26px] md:text-[24px] md:leading-[30px] text-foreground">
                        다른 사람들에 비해<br />
                        <span className="text-primary">탕감률이 높은 편</span>이에요!
                      </div>
                    </div>

                    {/* 탕감률 막대 그래프 */}
                    <div className="space-y-2">
                      {(() => {
                        // 막대 데이터 배열 (각 구간별 실제 수치)
                        const barData = [60, 65, 75, 95, 90, 105, 115, 95, 80, 75];
                        const maxBackgroundHeight = 140; // 100% 기준 고정 높이
                        const userPercentage = result.reductionRate.percentage;
                        
                        // 활성 막대 인덱스 찾기
                        const activeBarIndex = Array.from({ length: 10 }, (_, index) => {
                          const percentage = (index + 1) * 10;
                          return userPercentage > index * 10 && userPercentage <= percentage ? index : -1;
                        }).find(index => index !== -1);
                        
                        return (
                          <div className="relative" style={{ paddingTop: '48px' }}>
                            {/* 탕감률 배지 (그래프 상단에 별도 배치) */}
                            <div className="absolute top-0 left-0 right-0 h-12 flex justify-between items-center">
                              {Array.from({ length: 10 }, (_, index) => {
                                const percentage = (index + 1) * 10;
                                const isActiveBar = userPercentage > index * 10 && userPercentage <= percentage;
                                
                                return (
                                  <div key={index} className="flex justify-center relative" style={{ width: '24px' }}>
                                    {isActiveBar && (
                                      <div className="bg-primary rounded-full px-3 py-2 whitespace-nowrap absolute z-50 -top-6 flex items-center">
                                        <span className="text-caption-lg text-primary-foreground leading-none">
                                          내 탕감률
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            
                            {/* 그래프 */}
                            <div className="flex justify-between items-end" style={{ height: `${maxBackgroundHeight}px` }}>
                              {Array.from({ length: 10 }, (_, index) => {
                                const percentage = (index + 1) * 10;
                                const isActiveBar = userPercentage > index * 10 && userPercentage <= percentage;
                                
                                return (
                                  <div key={index} className="flex flex-col items-center justify-end h-full relative">
                                    {/* 배경 막대 (100% 고정 높이) */}
                                    <div 
                                      className="w-6 rounded-lg bg-muted absolute bottom-0"
                                      style={{ height: `${maxBackgroundHeight}px` }}
                                    />
                                    {/* 실제 막대 (데이터 비율에 따른 높이) */}
                                    <div 
                                      className={`w-6 rounded-lg relative z-10 ${isActiveBar ? 'bg-primary' : 'bg-muted-foreground'}`}
                                      style={{ height: `${Math.min(barData[index], maxBackgroundHeight)}px` }}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                      
                      {/* 라벨 */}
                      <div className="flex justify-between text-label-md md:text-label-lg">
                        <span className="text-muted-foreground">0%</span>
                        <span className="text-primary">100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>

        {/* 5. 서비스혜택 */}
        <div className="w-full md:max-w-[588px] md:mb-6 md:rounded-3xl md:shadow-2xl" style={{backgroundColor: '#EBF7F3'}}>
          <div className="px-4 py-14 md:px-8 md:py-10 space-y-4 md:space-y-6">
              {/* 1단: 타이틀 */}
              <div className="flex justify-center">
                <div className="bg-accent rounded-full px-6 py-2">
                  <span className="font-title font-black text-[14px] leading-[18px] md:text-[18px] md:leading-[24px] flex items-center text-accent-foreground">
                    서비스 혜택
                  </span>
                </div>
              </div>

              {/* 2단: 컨텐츠 */}
              <div className="space-y-8 md:space-y-10">
                {/* 1. 텍스트 */}
                <div className="text-center">
                  <div className="font-title font-black text-[24px] leading-[32px] md:text-[36px] md:leading-[46px] text-foreground">
                    지금 회생터치를 진행하면<br />
                    <span className="text-primary">받을 수 있는 혜택 4가지</span>
                  </div>
                </div>

                {/* 2. 혜택카드 */}
                <div className="space-y-4 mt-10">
                  {/* 혜택카드 1 */}
                  <div className="px-6 py-4 bg-card rounded-2xl flex items-center gap-4">
                    <div className="w-[72px] h-[72px] bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <img 
                        src="/images/diagnosis/test/diagnosis_test_6.webp" 
                        alt="혜택 1 이미지"
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-body-sm md:text-body-md text-muted-foreground">
                        대한변협이 인정한 도산전문 법무법인
                      </div>
                      <div className="text-heading-lg md:text-heading-xl text-foreground">
                        전문 변호사 1:1 연결
                      </div>
                    </div>
                  </div>

                  {/* 혜택카드 2 */}
                  <div className="px-6 py-4 bg-card rounded-2xl flex items-center gap-4">
                    <div className="w-[72px] h-[72px] bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <img 
                        src="/images/diagnosis/test/diagnosis_test_7.webp" 
                        alt="혜택 2 이미지"
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-body-sm md:text-body-md text-muted-foreground">
                        복잡한 서류 준비, 어떻게 해결할까?
                      </div>
                      <div className="text-heading-lg md:text-heading-xl text-foreground">
                        전담 서류관리팀 배정
                      </div>
                    </div>
                  </div>

                  {/* 혜택카드 3 */}
                  <div className="px-6 py-4 bg-card rounded-2xl flex items-center gap-4">
                    <div className="w-[72px] h-[72px] bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <img 
                        src="/images/diagnosis/test/diagnosis_test_8.webp" 
                        alt="혜택 3 이미지"
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-body-sm md:text-body-md text-muted-foreground">
                        불편한 채권추심, 힘드시죠?
                      </div>
                      <div className="text-heading-lg md:text-heading-xl text-foreground">
                        고객님 대신 추심 전부 해결
                      </div>
                    </div>
                  </div>

                  {/* 혜택카드 4 */}
                  <div className="px-6 py-4 bg-card rounded-2xl flex items-center gap-4">
                    <div className="w-[72px] h-[72px] bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <img 
                        src="/images/diagnosis/test/diagnosis_test_9.webp" 
                        alt="혜택 4 이미지"
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-body-sm md:text-body-md text-muted-foreground">
                        비용부담을 줄이기 위한
                      </div>
                      <div className="text-heading-lg md:text-heading-xl text-foreground">
                        수임료 분납 서비스 제공
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. 버튼 */}
                <div className="mt-8">
                  <Button 
                    variant="primary" 
                    size="l" 
                    rightIcon={<ArrowRight />}
                    className="w-full"
                    onClick={() => {
                      setAcquisitionSource('결과_서비스혜택');
                      setShowConsultationModal(true);
                    }}
                  >
                    지금 혜택 받을래요
                  </Button>
                </div>
              </div>
          </div>
        </div>

        {/* 6. 진행절차 */}
        <div className="w-full md:max-w-[588px] md:mb-6 bg-card md:rounded-3xl md:shadow-2xl">
          <div className="px-4 py-14 md:px-8 md:py-10 space-y-4 md:space-y-6">
              {/* 1단: 타이틀 */}
              <div className="flex justify-center">
                <div className="bg-accent rounded-full px-6 py-2">
                  <span className="font-title font-black text-[14px] leading-[18px] md:text-[18px] md:leading-[24px] flex items-center text-accent-foreground">
                    회생터치 진행 절차
                  </span>
                </div>
              </div>

              {/* 2단: 컨텐츠 */}
              <div className="space-y-8 md:space-y-10">
                {/* 1. 텍스트 */}
                <div className="text-center">
                  <div className="font-title font-black text-[24px] leading-[32px] md:text-[36px] md:leading-[46px] text-foreground">
                    회생터치 채무해결은<br />
                    이렇게 진행돼요
                  </div>
                </div>

                {/* 2. 절차박스 */}
                <div style={{marginTop: '40px'}}>
                  <div className="space-y-4">
                    {/* Step 1 */}
                    <div className="bg-muted rounded-2xl p-4 md:p-6">
                      <div className="flex items-center gap-4">
                        {/* 좌측 이미지 */}
                        <div className="hidden md:flex flex-shrink-0" style={{width: '64px', height: '64px'}}>
                          <Image
                            src="/images/diagnosis/test/diagnosis_test_10.webp"
                            alt="자가진단 테스트"
                            width={64}
                            height={64}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        
                        {/* 우측 텍스트 */}
                        <div className="flex-1">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center" style={{width: '24px', height: '24px'}}>
                                <div className="bg-foreground rounded-full" style={{width: '12px', height: '12px'}}>
                                </div>
                              </div>
                              <div className="text-heading-lg md:text-heading-xl text-foreground">
                                STEP 1. 자가진단 테스트
                              </div>
                            </div>
                            <div className="text-body-sm md:text-body-md text-muted-foreground" style={{marginLeft: '32px'}}>
                              간단한 테스트를 통해 현재 고객님의 상황을 진단합니다.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                      {/* Step 2 */}
                      <div className="rounded-2xl p-4 md:p-6 border-2 border-tertiary" style={{backgroundColor: 'rgba(59, 130, 246, 0.08)'}}>
                      <div className="flex items-center gap-4">
                        {/* 좌측 이미지 */}
                        <div className="hidden md:flex flex-shrink-0" style={{width: '64px', height: '64px'}}>
                          <Image
                            src="/images/diagnosis/test/diagnosis_test_11.webp"
                            alt="진단 결과 확인"
                            width={64}
                            height={64}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        
                        {/* 우측 텍스트 */}
                        <div className="flex-1">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center relative" style={{width: '24px', height: '24px'}}>
                                <div className="bg-tertiary rounded-full" style={{width: '8px', height: '8px'}}>
                                </div>
                                <div className="absolute rounded-full border-4 border-tertiary" style={{width: '20px', height: '20px'}}>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-heading-lg md:text-heading-xl text-tertiary">
                                  STEP 2. 진단 결과 확인
                                </div>
                                <div className="bg-tertiary rounded-lg px-2 py-1">
                                  <div className="text-caption-md text-tertiary-foreground">
                                    현재 절차
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-body-sm md:text-body-md text-muted-foreground" style={{marginLeft: '32px'}}>
                              테스트 결과를 데이터베이스를 통해 분석하고, 앞으로 어떤 절차가 필요한지 방향을 잡습니다.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                      {/* Step 3 */}
                      <div className="rounded-2xl p-4 md:p-6 border-2 border-primary" style={{backgroundColor: 'rgba(5, 150, 105, 0.08)'}}>
                      <div className="flex items-center gap-4">
                        {/* 좌측 이미지 */}
                        <div className="hidden md:flex flex-shrink-0" style={{width: '64px', height: '64px'}}>
                          <Image
                            src="/images/diagnosis/test/diagnosis_test_12.webp"
                            alt="전문가 상담 연결"
                            width={64}
                            height={64}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        
                        {/* 우측 텍스트 */}
                        <div className="flex-1">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center relative" style={{width: '24px', height: '24px'}}>
                                <div className="bg-primary rounded-full" style={{width: '8px', height: '8px'}}>
                                </div>
                                <div className="absolute rounded-full border-4 border-primary" style={{width: '20px', height: '20px'}}>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-heading-lg md:text-heading-xl text-primary">
                                  STEP 3. 전문가 상담 연결
                                </div>
                                <div className="bg-primary rounded-lg px-2 py-1">
                                  <div className="text-caption-md text-primary-foreground">
                                    다음 절차
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-body-sm md:text-body-md text-muted-foreground" style={{marginLeft: '32px'}}>
                              대기 중인 전문가가 바로 연결해 상담을 진행하고, 구체적인 조언을 받을 수 있습니다.
                            </div>
                            
                            {/* 버튼 */}
                            <div style={{marginLeft: '32px', marginTop: '16px'}}>
                              <Button 
                                variant="primary" 
                                size="base" 
                                rightIcon={<ArrowRight />}
                                onClick={() => {
                                  setAcquisitionSource('결과_진행절차');
                                  setShowConsultationModal(true);
                                }}
                              >
                                지금 상담 연결
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="bg-muted rounded-2xl p-4 md:p-6">
                      <div className="flex items-center gap-4">
                        {/* 좌측 이미지 */}
                        <div className="hidden md:flex flex-shrink-0" style={{width: '64px', height: '64px'}}>
                          <Image
                            src="/images/diagnosis/test/diagnosis_test_13.webp"
                            alt="법원 절차 신청"
                            width={64}
                            height={64}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        
                        {/* 우측 텍스트 */}
                        <div className="flex-1">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center" style={{width: '24px', height: '24px'}}>
                                <div className="bg-foreground rounded-full" style={{width: '12px', height: '12px'}}>
                                </div>
                              </div>
                              <div className="text-heading-lg md:text-heading-xl text-foreground">
                                STEP 4. 법원 절차 신청
                              </div>
                            </div>
                            <div className="text-body-sm md:text-body-md text-muted-foreground" style={{marginLeft: '32px'}}>
                              법원에 공식적으로 회생파산 절차를 신청합니다. 필요한 서류 준비와 모든 절차를 전문팀이 함께 진행합니다.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 5 */}
                    <div className="bg-muted rounded-2xl p-4 md:p-6">
                      <div className="flex items-center gap-4">
                        {/* 좌측 이미지 */}
                        <div className="hidden md:flex flex-shrink-0" style={{width: '64px', height: '64px'}}>
                          <Image
                            src="/images/diagnosis/test/diagnosis_test_14.webp"
                            alt="채무 해결 완료"
                            width={64}
                            height={64}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        
                        {/* 우측 텍스트 */}
                        <div className="flex-1">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center" style={{width: '24px', height: '24px'}}>
                                <div className="bg-foreground rounded-full" style={{width: '12px', height: '12px'}}>
                                </div>
                              </div>
                              <div className="text-heading-lg md:text-heading-xl text-foreground">
                                STEP 5. 채무 해결 완료
                              </div>
                            </div>
                            <div className="text-body-sm md:text-body-md text-muted-foreground" style={{marginLeft: '32px'}}>
                              회생터치 진행으로 인해 채무가 해결되고 새로운 출발이 가능합니다.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>

        {/* 7. 간편 상담 신청 */}
        <div className="w-full md:max-w-[588px] md:mb-6 md:rounded-3xl md:shadow-2xl" style={{background: 'linear-gradient(141deg, #E1F2ED 6.84%, #E7F0FE 93.54%)'}}>
          <div className="px-4 py-14 md:px-8 md:py-10 space-y-6 md:space-y-8">
            {/* 1단: 타이틀 */}
            <div className="flex justify-center">
              <div className="bg-accent rounded-full px-6 py-2">
                <span className="font-title font-black text-[14px] leading-[18px] md:text-[18px] md:leading-[24px] flex items-center text-accent-foreground">
                  간편 상담 신청
                </span>
              </div>
            </div>

            {/* 2단: 컨텐츠 */}
            <div className="mb-6 md:mb-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 01 상담 유형 선택 */}
                <div>
                  <h3 className="text-heading-md md:text-heading-lg font-bold text-foreground mb-2">
                    <span className="text-primary">01</span> 상담 유형 선택
                  </h3>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setConsultationType('phone')}
                      className={`flex-1 py-3 px-3 md:py-3.5 md:px-3 rounded-lg transition-colors ${
                        consultationType === 'phone'
                          ? 'bg-primary/15 text-primary text-heading-sm md:text-heading-md border-none'
                          : 'bg-card text-foreground border border-border hover:bg-muted text-label-sm md:text-label-md'
                      }`}
                    >
                      전화상담
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultationType('visit')}
                      className={`flex-1 py-3 px-3 md:py-3.5 md:px-3 rounded-lg transition-colors ${
                        consultationType === 'visit'
                          ? 'bg-primary/15 text-primary text-heading-sm md:text-heading-md border-none'
                          : 'bg-card text-foreground border border-border hover:bg-muted text-label-sm md:text-label-md'
                      }`}
                    >
                      방문상담
                    </button>
                  </div>
                </div>

                {/* 02 상담받을 연락처 */}
                <div>
                  <h3 className="text-heading-md md:text-heading-lg font-bold text-foreground mb-2">
                    <span className="text-primary">02</span> 상담받을 연락처
                  </h3>
                  <Input
                    type="tel"
                    size="base"
                    fullWidth={true}
                    value={contact}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '')
                      if (value.length <= 11) {
                        let formatted = ''
                        if (value.length === 0) {
                          formatted = ''
                        } else if (value.length <= 3) {
                          formatted = value
                        } else if (value.length <= 7) {
                          formatted = value.slice(0, 3) + '-' + value.slice(3)
                        } else {
                          formatted = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7)
                        }
                        setContact(formatted)
                      }
                    }}
                    placeholder="연락처를 입력해주세요"
                    className="w-full !py-2.5 !px-4 !text-body-md !min-h-[40px] md:!py-3 md:!px-4 md:!text-body-lg md:!min-h-[48px]"
                  />
                </div>

                {/* 03 거주지역 선택 */}
                <div>
                  <h3 className="text-heading-md md:text-heading-lg font-bold text-foreground mb-2">
                    <span className="text-primary">03</span> 거주지역 선택
                  </h3>
                  <div className="relative">
                  <select
                    value={residence}
                    onChange={(e) => setResidence(e.target.value)}
                      className="w-full h-[44px] py-2.5 px-4 pr-12 md:h-[54px] md:py-3 md:px-4 md:pr-12 border border-border rounded-lg text-body-md md:text-body-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white appearance-none"
                  >
                      <option value="">거주지역을 선택해주세요</option>
                    <option value="seoul">서울</option>
                      <option value="incheon">인천</option>
                      <option value="sejong">세종</option>
                    <option value="daejeon">대전</option>
                      <option value="daegu">대구</option>
                      <option value="ulsan">울산</option>
                      <option value="gwangju">광주</option>
                    <option value="busan">부산</option>
                      <option value="jeju">제주</option>
                      <option value="gangwon">강원도</option>
                      <option value="gyeonggi">경기도</option>
                      <option value="chungbuk">충청북도</option>
                      <option value="chungnam">충청남도</option>
                      <option value="gyeongbuk">경상북도</option>
                      <option value="gyeongnam">경상남도</option>
                      <option value="jeonbuk">전라북도</option>
                      <option value="jeonnam">전라남도</option>
                  </select>
                    <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none z-10">
                      <ChevronDown size={16} className="text-muted-foreground" />
                    </div>
                  </div>
                </div>
                
                {/* 버튼 */}
                <div className="text-center mt-6">
                  {contactSubmitted ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                        <p className="text-sm text-green-800 font-medium">
                          상담 신청이 완료되었습니다!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* 개인정보 처리방침 동의 안내 */}
                      <div className="text-xs text-muted-foreground text-center mb-4">
                        상담 신청 시 개인정보 수집·이용에 동의합니다.
                      </div>
                      
                      <Button
                        type="submit"
                        variant="primary"
                        size="l"
                        rightIcon={<ArrowRight size={24} />}
                        className="w-full"
                        disabled={isSubmittingContact || !consultationType || !contact || !residence}
                      >
                        {isSubmittingContact ? '신청 중...' : '간편 상담 신청'}
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>


      </div>

      {/* 상담 신청 확인 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* 배경 오버레이 */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={() => setShowConfirmModal(false)}
          />
          
          {/* 모달 콘텐츠 */}
          <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-md">
            <div className="pt-4 pr-4 pb-7 pl-4 space-y-6">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-heading-md font-semibold text-card-foreground">
                  상담 신청 확인
                </h2>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Close modal"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-body-lg text-foreground mb-4">
                    입력하신 정보로 상담을 신청하시겠습니까?
                  </p>
                </div>
                
                <div className="bg-muted rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-label-md text-muted-foreground">상담 유형</span>
                    <span className="text-body-md text-foreground font-medium">
                      {(() => {
                        const currentType = isModalSubmission ? modalConsultationType : consultationType;
                        return currentType === 'phone' ? '전화상담' : '방문상담';
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-label-md text-muted-foreground">연락처</span>
                    <span className="text-body-md text-foreground font-medium">
                      {isModalSubmission ? modalContact : contact}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-label-md text-muted-foreground">거주지역</span>
                    <span className="text-body-md text-foreground font-medium">
                      {(() => {
                        const currentResidence = isModalSubmission ? modalResidence : residence;
                        const regionMap: { [key: string]: string } = {
                          'seoul': '서울',
                          'incheon': '인천',
                          'sejong': '세종',
                          'daejeon': '대전',
                          'daegu': '대구',
                          'ulsan': '울산',
                          'gwangju': '광주',
                          'busan': '부산',
                          'jeju': '제주',
                          'gangwon': '강원도',
                          'gyeonggi': '경기도',
                          'chungbuk': '충청북도',
                          'chungnam': '충청남도',
                          'gyeongbuk': '경상북도',
                          'gyeongnam': '경상남도',
                          'jeonbuk': '전라북도',
                          'jeonnam': '전라남도'
                        };
                        return regionMap[currentResidence] || currentResidence;
                      })()}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    styleVariant="outline"
                    colorVariant="alternative"
                    size="base"
                    className="flex-1"
                    onClick={() => setShowConfirmModal(false)}
                  >
                    취소
                  </Button>
                  <Button
                    variant="primary"
                    size="base"
                    className="flex-1"
                    onClick={isModalSubmission ? handleModalConfirmSubmit : handleConfirmSubmit}
                    disabled={isSubmittingContact}
                  >
                    {isSubmittingContact ? '신청 중...' : '확인'}
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 간편상담신청 모달 */}
      {showConsultationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 배경 오버레이 */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setShowConsultationModal(false)}
          ></div>
          
          {/* 모달 콘텐츠 */}
          <div className="relative bg-card border border-border rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Headset size={24} className="text-primary" />
                  <h2 className="text-heading-lg font-bold text-primary">간편 상담 신청</h2>
                </div>
                <button
                  onClick={() => setShowConsultationModal(false)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Close modal"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </button>
              </div>

              {/* Modal Body - 간편 상담 신청 폼 */}
              <div className="space-y-6">
              <form id="modalConsultationForm" onSubmit={handleModalSubmit} className="space-y-4">
                {/* 01 상담 유형 선택 */}
                <div>
                  <h3 className="text-heading-md font-bold text-foreground mb-2">
                    <span className="text-primary">01</span> 상담 유형 선택
                  </h3>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setModalConsultationType('phone')}
                      className={`flex-1 py-3 px-3 rounded-lg transition-colors ${
                        modalConsultationType === 'phone'
                          ? 'bg-primary/15 text-primary text-heading-sm border-none'
                          : 'bg-card text-foreground border border-border hover:bg-muted text-label-sm'
                      }`}
                    >
                      전화상담
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalConsultationType('visit')}
                      className={`flex-1 py-3 px-3 rounded-lg transition-colors ${
                        modalConsultationType === 'visit'
                          ? 'bg-primary/15 text-primary text-heading-sm border-none'
                          : 'bg-card text-foreground border border-border hover:bg-muted text-label-sm'
                      }`}
                    >
                      방문상담
                    </button>
                  </div>
                </div>

                {/* 02 상담받을 연락처 */}
                <div>
                  <h3 className="text-heading-md font-bold text-foreground mb-2">
                    <span className="text-primary">02</span> 상담받을 연락처
                  </h3>
                  <Input
                    type="tel"
                    size="base"
                    fullWidth={true}
                    value={modalContact}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const numbersOnly = inputValue.replace(/[^0-9]/g, '');
                      
                      if (numbersOnly.length <= 11) {
                        let formatted = numbersOnly;
                        
                        // 자동 포맷팅: 숫자가 충분할 때만 하이픈 추가
                        if (numbersOnly.length >= 4 && numbersOnly.length <= 7) {
                          formatted = numbersOnly.slice(0, 3) + '-' + numbersOnly.slice(3);
                        } else if (numbersOnly.length >= 8) {
                          formatted = numbersOnly.slice(0, 3) + '-' + numbersOnly.slice(3, 7) + '-' + numbersOnly.slice(7);
                        }
                        
                        setModalContact(formatted);
                      }
                    }}
                    placeholder="연락처를 입력해주세요"
                    className="w-full !py-2.5 !px-4 !text-body-md !min-h-[40px]"
                  />
                </div>

                {/* 03 거주지역 선택 */}
                <div>
                  <h3 className="text-heading-md font-bold text-foreground mb-2">
                    <span className="text-primary">03</span> 거주지역 선택
                  </h3>
                  <div className="relative">
                    <select
                      value={modalResidence}
                      onChange={(e) => setModalResidence(e.target.value)}
                      className="w-full h-[44px] py-2.5 px-4 pr-12 border border-border rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white appearance-none"
                    >
                      <option value="">거주지역을 선택해주세요</option>
                      <option value="seoul">서울</option>
                      <option value="incheon">인천</option>
                      <option value="sejong">세종</option>
                      <option value="daejeon">대전</option>
                      <option value="daegu">대구</option>
                      <option value="ulsan">울산</option>
                      <option value="gwangju">광주</option>
                      <option value="busan">부산</option>
                      <option value="jeju">제주</option>
                      <option value="gangwon">강원도</option>
                      <option value="gyeonggi">경기도</option>
                      <option value="chungbuk">충청북도</option>
                      <option value="chungnam">충청남도</option>
                      <option value="gyeongbuk">경상북도</option>
                      <option value="gyeongnam">경상남도</option>
                      <option value="jeonbuk">전라북도</option>
                      <option value="jeonnam">전라남도</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </form>

              {/* Modal Footer */}
              <div className="flex gap-3">
                <Button
                  styleVariant="outline"
                  colorVariant="alternative"
                  size="base"
                  className="flex-1"
                  onClick={() => setShowConsultationModal(false)}
                >
                  취소
                </Button>
                <Button
                  form="modalConsultationForm"
                  type="submit"
                  variant="primary"
                  size="base"
                  className="flex-1"
                  disabled={isSubmittingContact || !modalConsultationType || !modalContact || !modalResidence}
                >
                  {isSubmittingContact ? '신청 중...' : '상담 신청'}
                </Button>
              </div>

              {/* 개인정보 처리방침 동의 안내 */}
              <div className="text-xs text-muted-foreground text-center">
                상담 신청 시 개인정보 수집·이용에 동의합니다.
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}