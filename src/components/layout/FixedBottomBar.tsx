'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Headset, Phone, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function FixedBottomBar() {
  const pathname = usePathname()
  
  // 자가진단 관련 페이지 및 관리자 페이지에서는 하단고정바 숨김
  if (pathname === '/diagnosis/test' || pathname === '/diagnosis' || pathname?.startsWith('/consultation/dashboard-')) {
    return null
  }

  // 상담신청 모달 관련 상태
  const [showConsultationModal, setShowConsultationModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isSubmittingContact, setIsSubmittingContact] = useState(false)
  const [consultationType, setConsultationType] = useState<'phone' | 'visit' | ''>('') // 기본값: 선택 안함
  const [contact, setContact] = useState('')
  const [residence, setResidence] = useState('')

  // 연락처 포맷팅 함수
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  // 연락처 입력 핸들러
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setContact(formatted);
  };

  // 상담신청 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 입력값 검증
    if (!consultationType || !contact || !residence) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // 최종 확인 모달 열기
    setShowConfirmModal(true);
  };

  // 실제 상담 신청 처리
  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setIsSubmittingContact(true);
    
    try {
      // 간편 상담 신청 데이터를 관리자 페이지로 전송
      const { DiagnosisDataManager } = await import('@/lib/diagnosis/database');
      
      const consultationData = {
        consultationType: consultationType as 'phone' | 'visit',
        contact,
        residence
      };

      await DiagnosisDataManager.saveSimpleConsultation(consultationData, '하단바_상담신청');
      
      alert('상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.');
      
      // 폼 초기화
      setConsultationType('');
      setContact('');
      setResidence('');
      setShowConsultationModal(false);
      
    } catch (error) {
      console.error('상담 신청 오류:', error);
      alert('상담 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmittingContact(false);
    }
  };

  return (
    <>
      {/* 고정된 하단 바 */}
      <button 
        className="fixed bottom-0 left-0 right-0 z-40 w-full transition-all duration-200 active:scale-[0.99]"
        style={{
          background: 'linear-gradient(90deg, var(--emerald-400, #34D399) 0%, var(--blue-400, #609AFA) 100%)',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15), 0 -2px 8px rgba(0, 0, 0, 0.1)'
        }}
        onClick={() => setShowConsultationModal(true)}
      >
        <div className="max-w-content mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <span className="text-white text-label-lg font-medium">
              회생파산 상담 예약
            </span>
            <ArrowRight className="w-6 h-6 text-white" />
          </div>
        </div>
      </button>

      {/* 하단 바 높이만큼 여백 추가 (콘텐츠가 가려지지 않도록) - 하단고정바가 표시될 때만 */}
      {!(pathname === '/diagnosis/test' || pathname === '/diagnosis') && (
        <div className="h-[48px] md:h-[56px]" />
      )}

      {/* 상담신청 모달 */}
      {showConsultationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 배경 오버레이 */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={() => setShowConsultationModal(false)}
          />
          
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
                <form id="consultationForm" onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* 01 상담 유형 선택 */}
                  <div>
                    <h3 className="text-heading-md font-bold text-foreground mb-2">
                      <span className="text-primary">01</span> 상담 유형 선택
                    </h3>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setConsultationType('phone')}
                        className={`flex-1 py-3 px-3 rounded-lg transition-colors ${
                          consultationType === 'phone'
                            ? 'bg-primary/15 text-primary text-heading-sm border-none'
                            : 'bg-card text-foreground border border-border hover:bg-muted text-label-sm'
                        }`}
                      >
                        전화상담
                      </button>
                      <button
                        type="button"
                        onClick={() => setConsultationType('visit')}
                        className={`flex-1 py-3 px-3 rounded-lg transition-colors ${
                          consultationType === 'visit'
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
                      value={contact}
                      onChange={handleContactChange}
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
                        value={residence}
                        onChange={(e) => setResidence(e.target.value)}
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
                      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none z-10">
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </form>

                {/* 버튼 */}
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
                    colorVariant="default"
                    styleVariant="fill"
                    size="base"
                    className="flex-1"
                    disabled={isSubmittingContact || !consultationType || !contact || !residence}
                    onClick={() => {
                      // 실제 handleSubmit 직접 호출
                      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                      handleSubmit(fakeEvent);
                    }}
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

      {/* 확인 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                      {consultationType === 'phone' ? '전화상담' : '방문상담'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-label-md text-muted-foreground">연락처</span>
                    <span className="text-body-md text-foreground font-medium">
                      {contact}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-label-md text-muted-foreground">거주지역</span>
                    <span className="text-body-md text-foreground font-medium">
                      {(() => {
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
                        return regionMap[residence] || residence;
                      })()}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-center">
                  <Button
                    styleVariant="outline"
                    colorVariant="alternative"
                    size="base"
                    onClick={() => setShowConfirmModal(false)}
                  >
                    취소
                  </Button>
                  <Button
                    variant="primary"
                    size="base"
                    onClick={handleConfirmSubmit}
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
    </>
  )
}


