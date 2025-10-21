'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Headset, MapPin, Phone, Clock, ArrowRight, ChevronDown, MessageSquareText, CheckCircle, Info, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import Image from 'next/image'

export default function ContactPage() {
  // 섹션2 간편상담신청 폼 상태
  const [consultationType, setConsultationType] = useState<'phone' | 'visit' | ''>('')
  const [contact, setContact] = useState('')
  const [residence, setResidence] = useState('')
  
  // 모달 상담신청 폼 상태 (별도 관리)
  const [modalConsultationType, setModalConsultationType] = useState<'phone' | 'visit' | ''>('visit') // 방문상담 기본 선택
  const [modalContact, setModalContact] = useState('')
  const [modalResidence, setModalResidence] = useState('')
  
  const [activeOffice, setActiveOffice] = useState<'seoul' | 'daejeon' | 'busan'>('seoul')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isSubmittingContact, setIsSubmittingContact] = useState(false)
  const [showConsultationModal, setShowConsultationModal] = useState(false)
  const [acquisitionSource, setAcquisitionSource] = useState<string>('문의_간편상담') // 기본값은 섹션2 간편상담
  const [isModalSubmission, setIsModalSubmission] = useState(false) // 모달에서 제출되었는지 구분


  const offices = {
    seoul: {
      name: '서울 주사무소',
      address: '서울특별시 강남구 논현로87길 25, HB타워 3,4층(역삼동 736-36)',
      phone: '02-555-7455',
      hours: {
        weekday: '평일 오전 08:00 ~ 오후 07:00',
        weekend: '주말 및 공휴일 휴무'
      }
    },
    daejeon: {
      name: '대전 분사무소',
      address: '대전광역시 서구 둔산중로78번길 26, 민석타워 14층(둔산동 1395)',
      phone: '042-484-0488',
      hours: {
        weekday: '평일 오전 08:00 ~ 오후 07:00',
        weekend: '주말 및 공휴일 휴무'
      }
    },
    busan: {
      name: '부산 분사무소',
      address: '부산광역시 연제구 법원로 38, 로펌빌딩 401호(거제동 1486-5)',
      phone: '051-501-1919',
      hours: {
        weekday: '평일 오전 08:00 ~ 오후 07:00',
        weekend: '주말 및 공휴일 휴무'
      }
    }
  }

  // 섹션2 간편상담신청 폼 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 입력값 검증
    if (!consultationType || !contact || !residence) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // 유입경로는 각 버튼에서 이미 설정되었으므로 여기서는 변경하지 않음
    
    // 섹션2에서 제출됨을 표시
    setIsModalSubmission(false);
    
    // 최종 확인 모달 열기
    setShowConfirmModal(true);
  };

  // 모달 상담신청 폼 핸들러 (별도)
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
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

  // 실제 상담 신청 처리
  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setIsSubmittingContact(true);
    
    try {
      // 간편 상담 신청 데이터를 관리자 페이지로 전송
      const { DiagnosisDataManager } = await import('@/lib/diagnosis/database');
      
      // 모달에서 제출된 경우와 섹션2에서 제출된 경우 구분
      const consultationData = isModalSubmission ? {
        consultationType: modalConsultationType as 'phone' | 'visit',
        contact: modalContact,
        residence: modalResidence
      } : {
        consultationType: consultationType as 'phone' | 'visit',
        contact,
        residence
      };

      // 모달에서 제출된 경우와 섹션2에서 제출된 경우 유입경로 구분
      const finalAcquisitionSource = isModalSubmission ? acquisitionSource : '문의_간편상담';
      
      await DiagnosisDataManager.saveSimpleConsultation(consultationData, finalAcquisitionSource);
      
      alert('상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.');
      
      // 폼 초기화 (모달과 섹션2 구분)
      if (isModalSubmission) {
        setModalConsultationType('visit'); // 방문상담 기본값으로 리셋
        setModalContact('');
        setModalResidence('');
        setShowConsultationModal(false); // 모달 닫기
      } else {
        setConsultationType('');
        setContact('');
        setResidence('');
      }
      
      // 모달 닫기
      setShowConsultationModal(false);
      
    } catch (error) {
      console.error('상담 신청 중 오류:', error);
      alert('상담 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmittingContact(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 섹션1: 히어로 섹션 */}
      <section className="bg-emerald-900 py-28 xs:py-14 sm:py-14 md:py-28">
        <Container>
          {/* 1단: 텍스트 */}
          <div className="flex gap-6 items-center hidden sm:hidden md:flex">
            <div className="flex flex-col gap-6">
              <h1 className="text-[40px] leading-[52px] font-extrabold text-emerald-300" style={{ fontFamily: 'RiaSans-ExtraBold' }}>
                편하게 상담을 제공합니다
              </h1>
              <h2 className="text-[32px] leading-[40px] font-extrabold text-white" style={{ fontFamily: 'RiaSans-ExtraBold' }}>
                원하는 방식으로,<br />
                언제든 상담을 시작하세요
              </h2>
            </div>
            <div className="flex-1">
              {/* 이미지 영역 */}
              <div className="w-full h-80 flex items-center justify-center">
                <img 
                  src="/images/contact/hero/contact_hero_1.webp" 
                  alt="Hero 이미지" 
                  className="object-contain h-full"
                />
              </div>
            </div>
          </div>

          {/* 모바일 반응형 디자인 (768px ~ 0px) */}
          <div className="block xs:block md:hidden flex flex-col items-center space-y-8">
            {/* 1단: 이미지 영역 */}
            <div className="w-full h-40 flex items-center justify-center">
              <img 
                src="/images/contact/hero/contact_hero_1.webp" 
                alt="Hero 이미지" 
                className="object-contain h-full"
              />
            </div>
            {/* 2단: 텍스트 */}
            <div className="text-center">
              <h2 className="text-[24px] leading-[34px] font-extrabold text-white" style={{ fontFamily: 'RiaSans-ExtraBold' }}>
                원하는 방식으로,<br />
                언제든 상담을 시작하세요
              </h2>
            </div>
            {/* 3단: 상담유형 */}
            <div className="flex flex-col gap-4 w-full">
              <div className="w-full bg-card rounded-3xl p-6 shadow-lg">
                <div className="flex gap-6 items-center">
                  {/* 1단: 텍스트 */}
                  <div className="flex flex-col gap-2.5 flex-1">
                    <h3 className="text-heading-xl font-bold text-foreground">전화 상담</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      rightIcon={<ArrowRight size={16} />}
                      className="w-fit"
                    >
                      1800-5495
                    </Button>
                  </div>
                  {/* 2단: 이미지 */}
                  <div className="flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ width: '72px', height: '72px' }}>
                    <img 
                      src="/images/contact/hero/contact_hero_2.webp" 
                      alt="전화 상담" 
                      className="w-auto h-auto object-contain"
                      style={{ maxWidth: '72px', maxHeight: '72px' }}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full bg-card rounded-3xl p-6 shadow-lg">
                <div className="flex gap-6 items-center">
                  {/* 1단: 텍스트 */}
                  <div className="flex flex-col gap-2.5 flex-1">
                    <h3 className="text-heading-xl font-bold text-foreground">방문 상담</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      rightIcon={<ArrowRight size={16} />}
                      className="w-fit"
                      onClick={() => {
                        setModalConsultationType('visit'); // 모달 상태만 설정
                        setAcquisitionSource('문의_방문상담');
                        setShowConsultationModal(true);
                      }}
                    >
                      상담예약신청
                    </Button>
                  </div>
                  {/* 2단: 이미지 */}
                  <div className="flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ width: '72px', height: '72px' }}>
                    <img 
                      src="/images/contact/hero/contact_hero_3.webp" 
                      alt="방문 상담" 
                      className="w-auto h-auto object-contain"
                      style={{ maxWidth: '72px', maxHeight: '72px' }}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full bg-card rounded-3xl p-6 shadow-lg">
                <div className="flex gap-6 items-center">
                  {/* 1단: 텍스트 */}
                  <div className="flex flex-col gap-2.5 flex-1">
                    <h3 className="text-heading-xl font-bold text-foreground">카카오톡 상담</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      rightIcon={<ArrowRight size={16} />}
                      className="w-fit"
                    >
                      카톡상담하기
                    </Button>
                  </div>
                  {/* 2단: 이미지 */}
                  <div className="flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ width: '72px', height: '72px' }}>
                    <img 
                      src="/images/contact/hero/contact_hero_4.webp" 
                      alt="카카오톡 상담" 
                      className="w-auto h-auto object-contain"
                      style={{ maxWidth: '72px', maxHeight: '72px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2단: 상담유형 - 데스크톱 디자인 (769px 이상) */}
          <div className="hidden md:flex gap-6">
            <div className="flex-1 bg-card rounded-2xl p-8 shadow-lg">
              <div className="flex gap-6 items-center">
                {/* 1단: 텍스트 */}
                <div className="flex flex-col gap-4 flex-1">
                  <h3 className="text-display-xs font-bold text-foreground">전화 상담</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    rightIcon={<ArrowRight size={16} />}
                    className="w-fit"
                    onClick={() => window.open('tel:1800-5495', '_self')}
                  >
                    1800-5495
                  </Button>
                </div>
                {/* 2단: 이미지 */}
                <div className="flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ width: '72px', height: '72px' }}>
                  <img 
                    src="/images/contact/hero/contact_hero_2.webp" 
                    alt="전화 상담" 
                    className="w-auto h-auto object-contain"
                    style={{ maxWidth: '72px', maxHeight: '72px' }}
                  />
                </div>
              </div>
            </div>
            <div className="flex-1 bg-card rounded-2xl p-8 shadow-lg">
              <div className="flex gap-6 items-center">
                {/* 1단: 텍스트 */}
                <div className="flex flex-col gap-4 flex-1">
                  <h3 className="text-display-xs font-bold text-foreground">방문 상담</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    rightIcon={<ArrowRight size={16} />}
                    className="w-fit"
                    onClick={() => {
                      setModalConsultationType('visit'); // 모달 상태만 설정
                      setAcquisitionSource('문의_방문상담');
                      setShowConsultationModal(true);
                    }}
                  >
                    상담예약신청
                  </Button>
                </div>
                {/* 2단: 이미지 */}
                <div className="flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ width: '72px', height: '72px' }}>
                  <img 
                    src="/images/contact/hero/contact_hero_3.webp" 
                    alt="방문 상담" 
                    className="w-auto h-auto object-contain"
                    style={{ maxWidth: '72px', maxHeight: '72px' }}
                  />
                </div>
              </div>
            </div>
            <div className="flex-1 bg-card rounded-2xl p-8 shadow-lg">
              <div className="flex gap-6 items-center">
                {/* 1단: 텍스트 */}
                <div className="flex flex-col gap-4 flex-1">
                  <h3 className="text-display-xs font-bold text-foreground">카카오톡 상담</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    rightIcon={<ArrowRight size={16} />}
                    className="w-fit"
                    onClick={() => window.open('https://pf.kakao.com/_AeGxoxl', '_blank')}
                  >
                    카톡상담하기
                  </Button>
                </div>
                {/* 2단: 이미지 */}
                <div className="flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ width: '72px', height: '72px' }}>
                  <img 
                    src="/images/contact/hero/contact_hero_4.webp" 
                    alt="카카오톡 상담" 
                    className="w-auto h-auto object-contain"
                    style={{ maxWidth: '72px', maxHeight: '72px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 섹션2: 상담신청 섹션 */}
      <section className="py-14 md:py-24 bg-gray-100">
        <Container>
          <div className="text-center mb-8 md:mb-14">
            <h1 className="text-[26px] leading-[36px] md:text-[40px] md:leading-[52px] font-extrabold text-foreground mb-2" style={{ fontFamily: 'RiaSans-ExtraBold' }}>
              회생터치 상담신청
            </h1>
            <p className="text-heading-lg md:text-display-xs text-foreground">
              상담을 신청하시면 채무해결을 도와줄<br />
              담당자가 배정되어 연락드립니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {/* 간편 상담 신청 */}
            <div className="bg-card rounded-4xl py-8 px-6 md:p-10 flex flex-col h-full">
              {/* 1단: 텍스트 */}
              <div className="flex items-center gap-2 justify-center mb-6 md:mb-8">
                <Headset size={32} className="text-primary" />
                <h2 className="text-[20px] leading-[30px] md:text-[24px] md:leading-[34px] font-extrabold text-primary" style={{ fontFamily: 'RiaSans-ExtraBold' }}>간편 상담 신청</h2>
              </div>
              
              {/* 2단: 폼 - 가운데 배치 */}
              <div className="flex-1 flex flex-col justify-center mb-6 md:mb-8">
                <form id="consultationForm" onSubmit={handleSubmit} className="space-y-4">
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
                          
                          setContact(formatted);
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

                </form>
              </div>
              
              {/* 3단: 버튼 - 하단 고정 */}
              <div className="text-center">
                {/* 개인정보 처리방침 동의 안내 */}
                <div className="text-xs text-muted-foreground text-center mb-8">
                  상담 신청 시 개인정보 수집·이용에 동의합니다.
                </div>
                
                <Button
                  form="consultationForm"
                  type="submit"
                  variant="primary"
                  size="l"
                  rightIcon={<ArrowRight size={24} />}
                  className="w-full"
                  disabled={isSubmittingContact || !consultationType || !contact || !residence}
                >
                  {isSubmittingContact ? '신청 중...' : '간편 상담 신청'}
                </Button>
              </div>
            </div>

            {/* 카카오톡 상담 */}
            <div className="bg-[#181600] rounded-4xl py-8 px-6 md:p-10 flex flex-col h-full">
              {/* 1단: 텍스트 */}
              <div className="flex items-center gap-2 justify-center mb-6 md:mb-8">
                <MessageSquareText size={32} className="text-[#FEE500]" />
                <span 
                  className="text-[20px] leading-[30px] md:text-[24px] md:leading-[34px] font-extrabold text-[#FEE500]"
                  style={{ fontFamily: 'RiaSans-ExtraBold' }}
                >
                  카카오톡 상담
                </span>
              </div>
              
              {/* 2단: 이미지 - 가운데 배치 */}
              <div className="flex-1 flex items-center justify-center mb-6 md:mb-8">
                <Image
                  src="/images/contact/application/contact_application_1280.webp"
                  alt="카카오톡 상담 신청"
                  width={0}
                  height={0}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              
              {/* 3단: 버튼 - 하단 고정 */}
              <div className="text-center">
                <Button
                  variant="primary"
                  size="l"
                  rightIcon={<ArrowRight size={24} />}
                  className="w-full !bg-[#FEE500] !text-[#181600] hover:!bg-[#FFED4C]"
                  onClick={() => window.open('https://pf.kakao.com/_AeGxoxl', '_blank')}
                >
                  카카오톡 상담하기
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 섹션3: 오시는 길 */}
      <section className="py-14 md:py-28 bg-background-1">
        <Container>
          <div className="text-center mb-8 md:mb-14">
            <h2 
              className="text-[26px] leading-[36px] md:text-[40px] md:leading-[52px] font-extrabold text-foreground"
              style={{ fontFamily: 'RiaSans-ExtraBold' }}
            >
              오시는 길
            </h2>
          </div>

          {/* 사무소 탭 */}
          <div className="flex gap-2.5 mb-6 md:mb-8">
              {(['seoul', 'daejeon', 'busan'] as const).map((office) => (
                <button
                  key={office}
                  onClick={() => setActiveOffice(office)}
                className={`flex-1 py-3 md:py-3.5 px-3 rounded-lg transition-colors ${
                    activeOffice === office
                    ? 'bg-accent text-accent-foreground text-heading-xs-css md:text-heading-md-css font-semibold'
                    : 'bg-card text-card-foreground text-label-xs-css md:text-label-md-css border border-border hover:bg-muted'
                  }`}
                >
                  {offices[office].name}
                </button>
              ))}
          </div>

          {/* 사무소 정보 */}
          <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:items-center">
            {/* 지도 - 모바일에서 먼저 표시 */}
            <div className="w-full h-[380px] bg-gray-200 rounded-xl flex items-center justify-center order-1 md:order-2">
              <p className="text-body-lg text-muted-foreground">지도가 여기에 표시됩니다</p>
            </div>

            {/* 텍스트 정보 - 모바일에서 나중에 표시 */}
            <div className="space-y-6 order-2 md:order-1">
              {/* 1단: 타이틀 */}
              <h3 className="text-display-xs-css md:text-display-sm-css font-bold text-foreground">
                {offices[activeOffice].name}
              </h3>
              
              {/* 2단: 정보내용 */}
              <div className="space-y-4">
                {/* 1단: 주소 */}
                <div className="space-y-1">
                  {/* 1단 라벨 */}
                  <div className="flex items-center gap-1">
                    <MapPin size={20} className="text-accent flex-shrink-0" />
                    <p className="text-heading-md md:text-heading-lg text-accent">사무소 주소</p>
                  </div>
                  {/* 2단 내용 */}
                  <div className="flex gap-1">
                    <div className="w-5 h-5 flex-shrink-0"></div>
                    <p className="text-body-sm md:text-body-md text-foreground">{offices[activeOffice].address}</p>
                  </div>
                </div>

                {/* 2단: 연락처 */}
                <div className="space-y-1">
                  {/* 1단 라벨 */}
                  <div className="flex items-center gap-1">
                    <Phone size={20} className="text-accent flex-shrink-0" />
                    <p className="text-heading-md md:text-heading-lg text-accent">연락처</p>
                  </div>
                  {/* 2단 내용 */}
                  <div className="flex gap-1">
                    <div className="w-5 h-5 flex-shrink-0"></div>
                    <p className="text-heading-xl md:text-display-xs text-foreground">{offices[activeOffice].phone}</p>
                  </div>
                </div>

                {/* 3단: 운영시간 */}
                <div className="space-y-1">
                  {/* 1단 라벨 */}
                  <div className="flex items-center gap-1">
                    <Clock size={20} className="text-accent flex-shrink-0" />
                    <p className="text-heading-md md:text-heading-lg text-accent">운영시간</p>
                  </div>
                  {/* 2단 내용 */}
                  <div className="flex gap-1">
                    <div className="w-5 h-5 flex-shrink-0"></div>
                    <div className="space-y-0">
                      <div className="flex gap-2">
                        <span className="text-heading-sm md:text-heading-md text-foreground">평일</span>
                        <span className="text-body-sm md:text-body-md text-foreground">오전 08:00 ~ 오후 07:00</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-heading-sm md:text-heading-md text-foreground">주말 및 공휴일</span>
                        <span className="text-body-sm md:text-body-md text-foreground">휴무</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 섹션4: CTA 섹션 */}
      <section className="bg-gray-100 pt-14 pb-24">
        <Container>
          {/* CTA 콘텐츠 영역 - 가로 2단 구조 */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {/* 첫 번째 박스 */}
            <Link href="/diagnosis">
              <div className="bg-card rounded-3xl px-8 py-6 md:px-10 md:py-8 shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="flex items-center justify-between">
                  {/* 좌측: 세로 2단 텍스트 구조 */}
                  <div className="flex flex-col gap-2">
                    {/* 1단 텍스트 */}
                    <p className="text-body-md md:text-body-lg text-card-foreground">
                      나의 상황에 맞는<br />
                      채무 해결책이 궁금하다면?
                    </p>
                    {/* 2단 텍스트 */}
                    <h3 className="text-heading-xl md:text-display-xs text-card-foreground font-bold">자가진단 테스트</h3>
              </div>

                  {/* 우측: 아이콘 */}
                  <div className="flex-shrink-0">
                    <ChevronRight size={40} className="text-primary" />
                  </div>
                </div>
              </div>
            </Link>

            {/* 두 번째 박스 */}
            <Link href="/services">
              <div className="bg-card rounded-3xl px-8 py-6 md:px-10 md:py-8 shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="flex items-center justify-between">
                  {/* 좌측: 세로 2단 텍스트 구조 */}
                  <div className="flex flex-col gap-2">
                    {/* 1단 텍스트 */}
                    <p className="text-body-md md:text-body-lg text-card-foreground">
                      회생터치는 무슨 서비스일까?<br />
                      차별화된 서비스 바로 확인
                    </p>
                    {/* 2단 텍스트 */}
                    <h3 className="text-heading-xl md:text-display-xs text-card-foreground font-bold">회생터치 소개</h3>
              </div>

                  {/* 우측: 아이콘 */}
                  <div className="flex-shrink-0">
                    <ChevronRight size={40} className="text-primary" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </Container>
      </section>

      {/* 간편 상담 신청 모달 */}
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
                      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none z-10">
                        <ChevronDown size={16} className="text-muted-foreground" />
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

      {/* 상담 신청 확인 모달 */}
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
                      {(isModalSubmission ? modalConsultationType : consultationType) === 'phone' ? '전화상담' : '방문상담'}
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
                        const currentResidence = isModalSubmission ? modalResidence : residence;
                        return regionMap[currentResidence] || currentResidence;
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
    </div>
  )
}
