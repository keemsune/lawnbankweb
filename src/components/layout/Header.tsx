'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, CircleArrowRight, Headset, Clock, MapPin, Phone, ArrowRight, ChevronDown, MessageSquareText } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Container } from './Container'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface HeaderProps {
  hideCasesMenu?: boolean  // 진행사례 메뉴 숨김 여부
}

export default function Header({ hideCasesMenu = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showConsultationModal, setShowConsultationModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isSubmittingContact, setIsSubmittingContact] = useState(false)
  const [consultationType, setConsultationType] = useState<'phone' | 'visit' | ''>('')
  const [contact, setContact] = useState('')
  const [residence, setResidence] = useState('')
  const [variant, setVariant] = useState<string | null>(null)
  const pathname = usePathname()

  // variant 파라미터 읽기
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setVariant(params.get('variant'));
  }, [pathname])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

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

      await DiagnosisDataManager.saveSimpleConsultation(consultationData, '헤더_상담신청');
      
      alert('상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.');
      
      // 폼 초기화
      setConsultationType('');
      setContact('');
      setResidence('');
      
      // 모달 닫기
      setShowConsultationModal(false);
      
    } catch (error) {
      console.error('상담 신청 중 오류:', error);
      alert('상담 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmittingContact(false);
    }
  }

  // ESC 키로 메뉴 닫기 및 외부 클릭으로 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element
      const header = document.getElementById('app-header')
      const dropdown = document.querySelector('[data-dropdown-menu]')
      
      if (isMenuOpen && header && dropdown && 
          !header.contains(target) && !dropdown.contains(target)) {
        closeMenu()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  // variant 파라미터를 URL에 추가하는 헬퍼 함수
  const addVariantToUrl = (url: string) => {
    if (!variant) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}variant=${variant}`;
  };

  const allMenuItems = [
    { href: '/diagnosis', label: '자가진단 테스트' },
    { href: '/cases', label: '진행사례' },
    { href: '/services', label: '서비스 소개' },
    { href: '/contact', label: '문의/상담' },
  ]

  // 진행사례 메뉴 숨김 처리
  const shouldHideCases = true; // 진행사례 메뉴 숨김

  // 진행사례 메뉴 필터링
  const menuItems = (hideCasesMenu || shouldHideCases)
    ? allMenuItems.filter(item => item.href !== '/cases')
    : allMenuItems

  return (
    <>
      <div id="app-header" className="fixed top-0 left-0 right-0 w-full bg-background border-b border-border z-50">
        <Container>
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-[72px] lg:h-[80px]">
            {/* 로고 */}
            <Link href={addVariantToUrl("/")} className="flex items-center">
              <Image
                src="/images/logo.svg"
                alt="회생터치 로고"
                width={96}
                height={24}
                className="h-5 w-auto sm:h-6 md:h-7 lg:h-8 object-contain"
              />
            </Link>

            {/* 데스크톱 네비게이션 메뉴 (769px 이상에서만 표시) */}
            <nav className="hidden md:flex items-center gap-12">
              {menuItems.map((item) => (
                <Link 
                  key={item.href}
                  href={addVariantToUrl(item.href)} 
                  className="text-base font-medium text-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              
              {/* 데스크톱 메뉴 아이콘 */}
              <button 
                onClick={toggleMenu}
                className="flex items-center justify-center p-2 rounded-md hover:bg-muted transition-colors"
                aria-label={isMenuOpen ? "전체 메뉴 닫기" : "전체 메뉴 열기"}
              >
                {isMenuOpen ? (
                  <X size={24} className="text-foreground" />
                ) : (
                <Menu size={24} className="text-foreground" />
                )}
              </button>
            </nav>

            {/* 모바일 메뉴 아이콘 (768px 이하에서만 표시) */}
            <button 
              onClick={toggleMenu}
              className="md:hidden flex items-center justify-center p-2 rounded-md hover:bg-muted transition-colors"
              aria-label={isMenuOpen ? "전체 메뉴 닫기" : "전체 메뉴 열기"}
            >
              {isMenuOpen ? (
                <X size={24} className="text-foreground" />
              ) : (
              <Menu size={24} className="text-foreground" />
              )}
            </button>
          </div>
        </Container>
      </div>

      {/* 드롭다운 메뉴 - 반응형 디자인 */}
      {isMenuOpen && (
        <>
          {/* 배경 오버레이 - 헤더 아래부터 시작 */}
          <div 
            className="fixed top-[56px] sm:top-[64px] md:top-[72px] lg:top-[80px] left-0 right-0 bottom-0 bg-black/40 z-[50] transition-opacity duration-200 ease-out"
            onClick={closeMenu}
          />
          
          {/* 드롭다운 메뉴 */}
        <div 
          data-dropdown-menu
            className="fixed top-[56px] sm:top-[64px] md:top-[72px] lg:top-[80px] left-0 right-0 bg-background border border-border shadow-2xl z-[60] transition-all duration-200 ease-out transform animate-[slideDown_0.2s_ease-out]"
        >
          <Container>
            {/* 375px 모바일 디자인 */}
            {/* 375px 모바일 디자인 */}
            <div className="block sm:hidden py-8">
              <div className="flex flex-col gap-8">
                {/* 상단 1단: 카테고리 */}
                <div className="space-y-6">
                  {/* 주요 메뉴 */}
                  <nav className="space-y-6">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={addVariantToUrl(item.href)}
                    onClick={closeMenu}
                        className="block text-heading-lg font-bold text-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
                </div>

                {/* 하단 3단: CTA 버튼 + 번호 + 운영시간 */}
                <div className="space-y-6 pt-8 border-t border-border">
                  {/* 1단: CTA 버튼 - 세로 3개 */}
                  <div className="flex flex-col gap-2">
                    <Link
                      href={addVariantToUrl("/diagnosis/test")}
                      onClick={closeMenu}
                      className="bg-primary hover:bg-emerald-800 text-primary-foreground flex items-center justify-between py-3.5 px-5 rounded-xl text-label-sm transition-colors"
                    >
                      <span>나의 상황 알아보기</span>
                      <CircleArrowRight size={24} />
                    </Link>
                    <button
                      onClick={() => {
                        setShowConsultationModal(true);
                        closeMenu();
                      }}
                      className="bg-tertiary hover:bg-blue-700 text-tertiary-foreground flex items-center justify-between py-3.5 px-5 rounded-xl text-label-sm transition-colors"
                    >
                      <span>채무해결 상담신청</span>
                      <CircleArrowRight size={24} />
                      </button>
                    <button
                      onClick={() => {
                        window.open('https://pf.kakao.com/_AeGxoxl', '_blank');
                        closeMenu();
                      }}
                      className="bg-[#181600] hover:bg-[#181600]/85 text-[#fee500] flex items-center justify-between py-3.5 px-5 rounded-xl text-label-sm transition-colors"
                    >
                      <span>카카오톡 문의하기</span>
                      <CircleArrowRight size={24} />
                      </button>
                  </div>

                  {/* 2단: 전화번호 */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Headset size={28} className="text-primary" />
                      <span className="ml-2 text-display-xs text-primary">1800-5495</span>
                    </div>
                    <Button
                      size="xs"
                      styleVariant="outline"
                      rightIcon={<ArrowRight size={16} />}
                      onClick={() => window.location.href = 'tel:1800-5495'}
                    >
                      전화상담
                    </Button>
                  </div>

                  {/* 3단: 운영시간 */}
                  <div className="flex items-center">
                    <Clock size={28} className="text-primary" />
                    <div className="ml-2 flex items-center space-x-1">
                      <span className="text-heading-md text-foreground">평일</span>
                      <span className="text-body-md text-foreground">오전 8시 ~ 오후 7시</span>
                    </div>
                    <div className="ml-2 flex items-center space-x-1">
                      <span className="text-heading-md text-foreground">주말/공휴일</span>
                      <span className="text-body-md text-foreground">휴무</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 768px ~ 376px 태블릿 디자인 */}
            <div className="hidden sm:block md:hidden py-8">
              <div className="flex flex-col gap-8">
                {/* 상단 1단: 카테고리 */}
                <div className="space-y-6">
                  {/* 주요 메뉴 */}
                  <nav className="space-y-6">
                    {menuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={addVariantToUrl(item.href)}
                        onClick={closeMenu}
                        className="block text-heading-lg font-bold text-foreground hover:text-primary transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* 하단 3단: CTA 버튼 + 번호 + 운영시간 */}
                <div className="space-y-6 pt-8 border-t border-border">
                  {/* 1단: CTA 버튼 - 가로 3개 */}
                  <div className="flex gap-4">
                    <Link
                      href={addVariantToUrl("/diagnosis/test")}
                      onClick={closeMenu}
                      className="flex-1 bg-primary hover:bg-emerald-800 text-primary-foreground flex items-center justify-between py-3.5 px-5 rounded-xl text-label-sm transition-colors"
                    >
                      <span>나의 상황 알아보기</span>
                      <CircleArrowRight size={24} />
                    </Link>
                    <button
                      onClick={() => {
                        setShowConsultationModal(true);
                        closeMenu();
                      }}
                      className="flex-1 bg-tertiary hover:bg-blue-700 text-tertiary-foreground flex items-center justify-between py-3.5 px-5 rounded-xl text-label-sm transition-colors"
                    >
                      <span>채무해결 상담신청</span>
                      <CircleArrowRight size={24} />
                    </button>
                    <button
                      onClick={() => {
                        window.open('https://pf.kakao.com/_AeGxoxl', '_blank');
                        closeMenu();
                      }}
                      className="flex-1 bg-[#181600] hover:bg-[#181600]/85 text-[#fee500] flex items-center justify-between py-3.5 px-5 rounded-xl text-label-sm transition-colors"
                    >
                      <span>카카오톡 문의하기</span>
                      <CircleArrowRight size={24} />
                      </button>
                  </div>

                  {/* 2단: 전화번호 */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Headset size={28} className="text-primary" />
                      <span className="ml-2 text-display-xs text-primary">1800-5495</span>
                    </div>
                    <Button
                      size="xs"
                      styleVariant="outline"
                      rightIcon={<ArrowRight size={16} />}
                      onClick={() => window.location.href = 'tel:1800-5495'}
                    >
                      전화상담
                    </Button>
                  </div>

                  {/* 3단: 운영시간 */}
                  <div className="flex items-center">
                    <Clock size={28} className="text-primary" />
                    <div className="ml-2 flex items-center space-x-1">
                      <span className="text-heading-md text-foreground">평일</span>
                      <span className="text-body-md text-foreground">오전 8시 ~ 오후 7시</span>
                    </div>
                    <div className="ml-2 flex items-center space-x-1">
                      <span className="text-heading-md text-foreground">주말/공휴일</span>
                      <span className="text-body-md text-foreground">휴무</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 1024px 이상 데스크톱 디자인 */}
            <div className="hidden md:block py-8">
              <div className="flex gap-8 items-center">
                {/* 좌측 1단: 카테고리 - 282px 고정 */}
                <div className="w-[282px] space-y-6 border-r border-border">
                  {/* 주요 메뉴 */}
                  <nav className="space-y-6">
                    {menuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={addVariantToUrl(item.href)}
                        onClick={closeMenu}
                        className="block text-heading-lg font-bold text-foreground hover:text-primary transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* 우측 3단: CTA 버튼 + 번호 + 운영시간 */}
                <div className="flex-1 space-y-6">
                  {/* 1단: CTA 버튼 - 가로 3개 */}
                  <div className="flex gap-6">
                    <Link
                      href={addVariantToUrl("/diagnosis/test")}
                      onClick={closeMenu}
                      className="flex-1 bg-primary hover:bg-emerald-800 text-primary-foreground flex items-center justify-between py-3.5 px-5 rounded-xl text-label-sm transition-colors"
                    >
                      <span>나의 상황 알아보기</span>
                      <CircleArrowRight size={24} />
                    </Link>
                    <button
                      onClick={() => {
                        setShowConsultationModal(true);
                        closeMenu();
                      }}
                      className="flex-1 bg-tertiary hover:bg-blue-700 text-tertiary-foreground flex items-center justify-between py-3.5 px-5 rounded-xl text-label-sm transition-colors"
                    >
                      <span>채무해결 상담신청</span>
                      <CircleArrowRight size={24} />
                    </button>
                    <button
                      onClick={() => {
                        window.open('https://pf.kakao.com/_AeGxoxl', '_blank');
                        closeMenu();
                      }}
                      className="flex-1 bg-[#181600] hover:bg-[#181600]/85 text-[#fee500] flex items-center justify-between py-3.5 px-5 rounded-xl text-label-sm transition-colors"
                    >
                      <span>카카오톡 문의하기</span>
                      <CircleArrowRight size={24} />
                      </button>
                  </div>

                  {/* 2단: 전화번호 */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Headset size={28} className="text-primary" />
                      <span className="ml-2 text-display-xs text-primary">1800-5495</span>
                    </div>
                    <Button
                      size="xs"
                      styleVariant="outline"
                      rightIcon={<ArrowRight size={16} />}
                      onClick={() => window.location.href = 'tel:1800-5495'}
                    >
                      전화상담
                    </Button>
                  </div>

                  {/* 3단: 운영시간 */}
                  <div className="flex items-center">
                    <Clock size={28} className="text-primary" />
                    <div className="ml-2 flex items-center space-x-1">
                      <span className="text-heading-md text-foreground">평일</span>
                      <span className="text-body-md text-foreground">오전 8시 ~ 오후 7시</span>
                    </div>
                    <div className="ml-2 flex items-center space-x-1">
                      <span className="text-heading-md text-foreground">주말/공휴일</span>
                      <span className="text-body-md text-foreground">휴무</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </Container>
        </div>
        </>
      )}

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
                <form id="headerConsultationForm" onSubmit={handleSubmit} className="space-y-4">
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
                    form="headerConsultationForm"
                    type="submit"
                    variant="primary"
                    size="base"
                    className="flex-1"
                    disabled={isSubmittingContact || !consultationType || !contact || !residence}
                  >
                    {isSubmittingContact ? '신청 중...' : '상담 신청'}
                  </Button>
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
                      {consultationType === 'phone' ? '전화상담' : '방문상담'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-label-md text-muted-foreground">연락처</span>
                    <span className="text-body-md text-foreground font-medium">{contact}</span>
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