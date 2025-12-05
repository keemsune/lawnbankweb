"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { TeamMemberCard } from '@/components/ui/TeamMemberCard'
import { Pagination } from '@/components/ui/Pagination'
import { FloatingTab } from '@/components/ui/FloatingTab'
import { Accordion } from '@/components/ui/Accordion'
import { ArrowRight, CheckCircle, Users, Clock, Shield, Award, X, ChevronDown, Headset } from 'lucide-react'

// 🎛️ 서비스 기능 설정
const FEATURE_FLAGS = {
  SHOW_AI_CASE_ANALYSIS: true,     // AI 사례 분석 섹션 표시 여부
  SHOW_CASE_MATCHING: true,        // 사례 매칭 기능 표시 여부
  USE_TEMP_COPY: true,             // 임시 카피 사용 여부
  SHOW_STEP_SECTIONS: true,        // 4단계 상세 섹션 표시 여부
}

export default function ServicesPage() {
  // variant 상태 관리
  const [variant, setVariant] = useState<string | null>(null)
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1)
  
  // 상담신청 모달 관련 상태
  const [showConsultationModal, setShowConsultationModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isSubmittingContact, setIsSubmittingContact] = useState(false)
  const [consultationType, setConsultationType] = useState<'phone' | 'visit' | ''>('')
  const [contact, setContact] = useState('')
  const [residence, setResidence] = useState('')

  // 컴포넌트 마운트 시 URL에서 variant 읽기
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setVariant(params.get('variant'));
  }, []);

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

      await DiagnosisDataManager.saveSimpleConsultation(consultationData, '서비스_CTA');
      
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

  // 구성원 데이터 배열
  const teamMembers = [
    {
      id: 1,
      name: "김충환 대표변호사",
      department: "서울 주사무소",
      contact: "도산˙이혼 전문",
      image: "/images/intro/team_member/kchunghwan.webp"
    },
    {
      id: 2,
      name: "우종현 변호사",
      department: "대전 분사무소",
      contact: "도산˙부동산 전문",
      image: "/images/intro/team_member/wjonghyun.webp"
    },
    {
      id: 3,
      name: "허남관 변호사",
      department: "부산 분사무소",
      contact: "도산˙등기˙경매 전문",
      image: "/images/intro/team_member/hnamkwan.webp"
    },
    {
      id: 4,
      name: "김태준 팀장",
      department: "법률컨설팅팀",
      contact: "T. 070-7706-4679",
      image: "/images/intro/team_member/ktaejun.webp"
    },
    {
      id: 5,
      name: "정미주 팀장",
      department: "법률컨설팅팀",
      contact: "T. 070-4944-9973",
      image: "/images/intro/team_member/jmiju.webp"
    },
    {
      id: 6,
      name: "김은화 실장",
      department: "지원팀",
      contact: "T. 070-4607-4430",
      image: "/images/intro/team_member/keunhwa.webp"
    },
    {
      id: 7,
      name: "이예은 대리",
      department: "지원팀",
      contact: "T. 070-4607-4595",
      image: "/images/intro/team_member/lyeeun.webp"
    },
    {
      id: 8,
      name: "이가현 과장",
      department: "법률컨설팅팀",
      contact: "T. 070-7709-7045",
      image: "/images/intro/team_member/lgahyun.webp"
    },
    {
      id: 9,
      name: "백나래 대리",
      department: "지원팀",
      contact: "T. 070-4607-4487",
      image: "/images/intro/team_member/bnarae.webp"
    },
    {
      id: 10,
      name: "박준표 팀장",
      department: "법률컨설팅팀",
      contact: "T. 070-4607-4536",
      image: "/images/intro/team_member/pjunpyo.webp"
    },
    {
      id: 11,
      name: "권진현 팀장",
      department: "법률컨설팅팀",
      contact: "T. 070-4607-1502",
      image: "/images/intro/team_member/kjinhyun.webp"
    },
    {
      id: 12,
      name: "김지혜 대리",
      department: "사건관리팀",
      contact: "T. 070-4607-4594",
      image: "/images/intro/team_member/kjihye.webp"
    },
    {
      id: 13,
      name: "방한솔 과장",
      department: "법률컨설팅팀",
      contact: "070-4607-4533",
      image: "/images/intro/team_member/bhansol.webp"
    },
    {
      id: 14,
      name: "이소정 과장",
      department: "법률컨설팅팀",
      contact: "070-4607-0587",
      image: "/images/intro/team_member/lsojeong.webp"
    },
    {
      id: 15,
      name: "김영찬 과장",
      department: "법률컨설팅팀",
      contact: "070-4607-4637",
      image: "/images/intro/team_member/kyoungchan.webp"
    },
    {
      id: 16,
      name: "옥윤서 대리",
      department: "사건관리팀",
      contact: "070-4607-4595",
      image: "/images/intro/team_member/oyoonseo.webp"
    },
    {
      id: 17,
      name: "심샛별 과장",
      department: "법률컨설팅팀",
      contact: "070-4607-0053",
      image: "/images/intro/team_member/ssaetbyeol.webp"
    },
    {
      id: 18,
      name: "황윤주 과장",
      department: "법률컨설팅팀",
      contact: "070-4607-1501",
      image: "/images/intro/team_member/hyunju.webp"
    },
    {
      id: 19,
      name: "박유진 대리",
      department: "사건관리팀",
      contact: "070-5080-4502",
      image: "/images/intro/team_member/pyujin.webp"
    },
    {
      id: 20,
      name: "오미혜 과장",
      department: "법률컨설팅팀",
      contact: "070-4944-3570",
      image: "/images/intro/team_member/omihye.webp"
    },
    {
      id: 21,
      name: "김미진 과장",
      department: "법률컨설팅팀",
      contact: "070-7706-5502",
      image: "/images/intro/team_member/kmijin.webp"
    },
    {
      id: 22,
      name: "신수아 과장",
      department: "법률컨설팅팀",
      contact: "070-4607-4429",
      image: "/images/intro/team_member/ssua.webp"
    },
    {
      id: 23,
      name: "김지안 과장",
      department: "법률컨설팅팀",
      contact: "070-7706-9368",
      image: "/images/intro/team_member/kjiahn.webp"
    },
    {
      id: 24,
      name: "천왕겸 과장",
      department: "법률컨설팅팀",
      contact: "070-7706-0595",
      image: "/images/intro/team_member/cwangkyeom.webp"
    },
    {
      id: 25,
      name: "박기현 대리",
      department: "사건관리팀",
      contact: "070-4607-4431",
      image: "/images/intro/team_member/pkihyun.webp"
    },
    {
      id: 26,
      name: "안은주 대리",
      department: "사건관리팀",
      contact: "070-4607-1340",
      image: "/images/intro/team_member/aeunjoo.webp"
    },
    {
      id: 27,
      name: "이현유 대리",
      department: "사건관리팀",
      contact: "070-4944-9970",
      image: "/images/intro/team_member/lhyeonyu.webp"
    },
    {
      id: 28,
      name: "김현정 과장",
      department: "법률컨설팅팀",
      contact: "070-4607-4534",
      image: "/images/intro/team_member/khyunjung.webp"
    },
    {
      id: 29,
      name: "박유은 과장",
      department: "법률컨설팅팀",
      contact: "070-4607-4425",
      image: "/images/intro/team_member/pyueun.webp"
    },
    {
      id: 30,
      name: "김민지 대리",
      department: "사건관리팀",
      contact: "070-7706-8307",
      image: "/images/intro/team_member/kminji.webp"
    },
    {
      id: 31,
      name: "신석영 대리",
      department: "사건관리팀",
      contact: "070-4946-5249",
      image: "/images/intro/team_member/sseokyeong.webp"
    },
    {
      id: 32,
      name: "심웅보 과장",
      department: "법률컨설팅팀",
      contact: "070-4607-2253",
      image: "/images/intro/team_member/swoongbo.webp"
    },
    {
      id: 33,
      name: "나호인 주임",
      department: "사건관리팀",
      contact: "070-4607-4535",
      image: "/images/intro/team_member/nhoin.webp"
    },
    {
      id: 34,
      name: "김연주 주임",
      department: "사건관리팀",
      contact: "070-4169-2602",
      image: "/images/intro/team_member/kyeonju.webp"
    },
    {
      id: 35,
      name: "김희원 주임",
      department: "사건관리팀",
      contact: "070-4494-9971",
      image: "/images/intro/team_member/kheewon.webp"
    },
    {
      id: 36,
      name: "공서아 주임",
      department: "사건관리팀",
      contact: "070-4607-4592",
      image: "/images/intro/team_member/kseoa.webp"
    },
    {
      id: 37,
      name: "이보미 대리",
      department: "사건관리팀",
      contact: "070-4607-1209",
      image: "/images/intro/team_member/lbomi.webp"
    },
    {
      id: 38,
      name: "신지용 과장",
      department: "법률컨설팅팀",
      contact: "070-4607-1208",
      image: "/images/intro/team_member/sjiyong.webp"
    },
    {
      id: 39,
      name: "박성준 주임",
      department: "사건관리팀",
      contact: "070-4607-4638",
      image: "/images/intro/team_member/psungjun.webp"
    },
    {
      id: 40,
      name: "이경은 주임",
      department: "사건관리팀",
      contact: "070-7706-4679",
      image: "/images/intro/team_member/lkyungeun.webp"
    },
    {
      id: 41,
      name: "정유민 주임",
      department: "사건관리팀",
      contact: "070-7709-7045",
      image: "/images/intro/team_member/jyumin.webp"
    },
    {
      id: 42,
      name: "이서영 주임",
      department: "사건관리팀",
      contact: "070-4607-0085",
      image: "/images/intro/team_member/lseoyoung.webp"
    },
    {
      id: 43,
      name: "최우성 주임",
      department: "사건관리팀",
      contact: "070-4169-8171",
      image: "/images/intro/team_member/cwoosung.webp"
    },
    {
      id: 44,
      name: "김동화 주임",
      department: "사건관리팀",
      contact: "070-4607-4427",
      image: "/images/intro/team_member/kdonghwa.webp"
    },
    {
      id: 45,
      name: "강혜연 주임",
      department: "사건관리팀",
      contact: "070-4494-9969",
      image: "/images/intro/team_member/khyeyeon.webp"
    },
    {
      id: 46,
      name: "서화영 주임",
      department: "사건관리팀",
      contact: "070-4494-9973",
      image: "/images/intro/team_member/shwayoung.webp"
    },
    {
      id: 47,
      name: "김효준 주임",
      department: "사건관리팀",
      contact: "070-4607-5258",
      image: "/images/intro/team_member/khyojun.webp"
    },
    {
      id: 48,
      name: "도현진 주임",
      department: "사건관리팀",
      contact: "070-4607-5220",
      image: "/images/intro/team_member/dhyunjin.webp"
    }
  ]

  const MEMBERS_PER_PAGE = 12;
  const totalPages = Math.ceil(teamMembers.length / MEMBERS_PER_PAGE);
  const pagedMembers = teamMembers.slice(
    (currentPage - 1) * MEMBERS_PER_PAGE,
    currentPage * MEMBERS_PER_PAGE
  );

  // FAQ 데이터 - 원본과 임시 카피
  const originalFaqItems = [
    {
      id: 'faq-1',
      question: '회생터치 서비스는 어떻게 이용하나요?',
      answer: '회생터치 서비스는 자가진단을 통해 유사한 사례를 제공하고 법률전문가와의 연결까지 돕는 서비스입니다.\n먼저 7번의 터치로 자가진단을 진행하고,\n로앤에서 진행한 수천 건의 사건 데이터를 AI가 분석하여 유사한 사례를 제공합니다.\n해결책을 충분히 파악하고 매칭된 법률전문가에게 직접 상담받고 절차를 진행할 수 있습니다.'
    },
    {
      id: 'faq-2',
      question: '회생터치 서비스는 도산전문 법무법인인가요?',
      answer: '회생터치 서비스는 법무법인 로앤에서 제공하는 서비스입니다.\n법무법인 로앤은 13년 이상의 회생파산 경력으로 대한변협에서 도산전문을 인증받은 로펌입니다.\n도산전문 변호사와 오래된 경력으로 구성된 실무팀이 직접 사건을 분담하여 처리하며,\n의뢰인의 정보를 안전하게 보호하고 절차에 맞춰 사건을 진행합니다.'
    },
    {
      id: 'faq-3',
      question: '채무가 많아도 회생이나 파산이 가능한가요?',
      answer: '회생파산 제도에서 채무액보다 중요한 건 소득, 지출, 자산, 부양가족 등 전체의 상황입니다.\n간단한 진단 후 유사한 사례 제공을 통해 나의 상황에 적합한 해결방향이 무엇인지를 판단할 수 있습니다.\n그 후 전문가와 소통을 하며 적합한 제도와 해결방법을 안내해 드립니다.\n로앤은 수천 건의 해결사례가 있기에 다양한 상황도 수월하게 해결을 도와드릴 수 있습니다.'
    },
    {
      id: 'faq-4',
      question: '채권자에게 계속 연락이 오는데 어떻게 하나요?',
      answer: '회생파산 절차를 시작하면 법적으로 추심이 중단됩니다.\n로앤과 사건을 진행하시게 되면 저희가 고객님 대신 대응해 드릴 수 있으니,\n모든 걱정은 로앤에게 맡겨주세요.'
    },
    {
      id: 'faq-5',
      question: '상담받으면 바로 사건을 맡겨야 하나요?',
      answer: '아닙니다. 먼저 자가진단과 사례 분석을 통해 본인의 상황을 정확히 파악하고,\n법률전문가가 진단 내용을 바탕으로 사건의 진행방향과 최적의 솔루션을 제공해 드립니다.\n충분한 상담과 소통을 통해 진행 여부를 결정하시면 되며,\n로앤은 고객님들께 무조건적인 수임을 권하지 않습니다.'
    }
  ]

  const tempFaqItems = [
    {
      id: 'faq-1',
      question: '회생터치 서비스는 어떻게 이용하나요?',
      answer: '회생터치 서비스는 자가진단을 통해 전문가와의 연결까지 돕는 서비스입니다.\n먼저 5번의 터치로 자가진단을 진행하고,\n축적된 데이터를 분석하여 상황에 맞는 해결 방향을 제시합니다.\n해결책을 충분히 파악하고 매칭된 법률전문가에게 직접 상담받고 절차를 진행할 수 있습니다.'
    },
    {
      id: 'faq-2',
      question: '회생터치 서비스는 도산전문 법무법인인가요?',
      answer: '회생터치 서비스는 법무법인 로앤에서 제공하는 서비스입니다.\n법무법인 로앤은 13년 이상의 회생파산 경력으로 대한변협에서 도산전문을 인증받은 로펌입니다.\n도산전문 변호사와 오래된 경력으로 구성된 실무팀이 직접 사건을 분담하여 처리하며,\n의뢰인의 정보를 안전하게 보호하고 절차에 맞춰 사건을 진행합니다.'
    },
    {
      id: 'faq-3',
      question: '채무가 많아도 회생이나 파산이 가능한가요?',
      answer: '회생파산 제도에서 채무액보다 중요한 건 소득, 지출, 자산, 부양가족 등 전체의 상황입니다.\n간단한 진단 후 데이터 분석을 통해 나의 상황에 적합한 해결방향이 무엇인지를 판단할 수 있습니다.\n그 후 전문가와 소통을 하며 적합한 제도와 해결방법을 안내해 드립니다.\n로앤은 수천 건의 해결사례가 있기에 다양한 상황도 수월하게 해결을 도와드릴 수 있습니다.'
    },
    {
      id: 'faq-4',
      question: '채권자에게 계속 연락이 오는데 어떻게 하나요?',
      answer: '회생파산 절차를 시작하면 법적으로 추심이 중단됩니다.\n로앤과 사건을 진행하시게 되면 저희가 고객님 대신 대응해 드릴 수 있으니,\n모든 걱정은 로앤에게 맡겨주세요.'
    },
    {
      id: 'faq-5',
      question: '상담받으면 바로 사건을 맡겨야 하나요?',
      answer: '아닙니다. 먼저 자가진단과 데이터 분석을 통해 본인의 상황을 정확히 파악하고,\n법률전문가가 진단 내용을 바탕으로 사건의 진행방향과 최적의 솔루션을 제공해 드립니다.\n충분한 상담과 소통을 통해 진행 여부를 결정하시면 되며,\n로앤은 고객님들께 무조건적인 수임을 권하지 않습니다.'
    }
  ]

  // simple 페이지 전용 FAQ
  const simpleFaqItems = [
    {
      id: 'faq-1',
      question: '회생터치 서비스는 어떻게 이용하나요?',
      answer: '회생터치 서비스는 자가진단을 통해 전문가와의 연결까지 돕는 서비스입니다.\n먼저 5번의 터치로 자가진단을 진행하고,\n축적된 데이터를 분석하여 상황에 맞는 해결 방향을 제시합니다.\n해결책을 충분히 파악하고 매칭된 법률전문가에게 직접 상담받고 절차를 진행할 수 있습니다.'
    },
    {
      id: 'faq-2',
      question: '회생터치 서비스는 도산전문 법무법인인가요?',
      answer: '물론입니다.\n13년 이상의 회생파산 경력으로 대한변협에서 도산전문을 인증받은 로펌에서 진행하는 서비스입니다.\n도산전문 변호사와 오래된 경력으로 구성된 실무팀이 직접 사건을 분담하여 처리하며,\n의뢰인의 정보를 안전하게 보호하고 절차에 맞춰 사건을 진행합니다.'
    },
    {
      id: 'faq-3',
      question: '채무가 많아도 회생이나 파산이 가능한가요?',
      answer: '회생파산 제도에서 채무액보다 중요한 건 소득, 지출, 자산, 부양가족 등 전체의 상황입니다.\n간단한 진단 후 데이터 분석을 통해 나의 상황에 적합한 해결방향이 무엇인지를 판단할 수 있습니다.\n그 후 전문가와 소통을 하며 적합한 제도와 해결방법을 안내해 드립니다.\n로앤은 수천 건의 해결사례가 있기에 다양한 상황도 수월하게 해결을 도와드릴 수 있습니다.'
    },
    {
      id: 'faq-4',
      question: '채권자에게 계속 연락이 오는데 어떻게 하나요?',
      answer: '회생파산 절차를 시작하면 법적으로 추심이 중단됩니다.\n로앤과 사건을 진행하시게 되면 저희가 고객님 대신 대응해 드릴 수 있으니,\n모든 걱정은 로앤에게 맡겨주세요.'
    },
    {
      id: 'faq-5',
      question: '상담받으면 바로 사건을 맡겨야 하나요?',
      answer: '아닙니다. 먼저 자가진단과 데이터 분석을 통해 본인의 상황을 정확히 파악하고,\n법률전문가가 진단 내용을 바탕으로 사건의 진행방향과 최적의 솔루션을 제공해 드립니다.\n충분한 상담과 소통을 통해 진행 여부를 결정하시면 되며,\n로앤은 고객님들께 무조건적인 수임을 권하지 않습니다.'
    }
  ]

  // 현재 사용할 FAQ 데이터 선택
  const faqItems = variant === 'simple' 
    ? simpleFaqItems 
    : (FEATURE_FLAGS.USE_TEMP_COPY ? tempFaqItems : originalFaqItems)

  return (
    <div>
      {/* 플로팅 탭 */}
      {variant !== 'simple' && (
      <FloatingTab
        tabs={[
          { id: 'law-firm', label: '법무법인 로앤', targetIds: [
            'law-firm-section', 'lawyer-section', 'differentiation-section', 'team-section'
          ] },
          { id: 'service-guide', label: '서비스 안내', targetIds: [
            'service-guide-section', /* 이후 서비스 안내 섹션 id 추가 */
          ] }
        ]}
      />
      )}
      
      {/* 섹션 1: 히어로 섹션 */}
      <section id="law-firm-section" className="relative py-14 md:py-28 overflow-hidden">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/intro/hero/intro_hero_bg.webp"
            alt="서비스 소개 히어로 배경"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
        
        <Container className="relative z-10">
          {/* 가로 2단 구조: 좌측 텍스트, 우측 이미지박스 */}
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            {/* 좌측: 텍스트 */}
            <div className="w-full md:w-[542px] lg:w-[588px] text-center md:text-left">
              <h1 
                className="font-title font-black text-foreground mb-6 text-[26px] leading-[36px] md:text-[36px] md:leading-[48px] lg:text-[40px] lg:leading-[52px]"
              >
                회생터치는<br />
                <span 
                  className="bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent"
                  style={{
                    background: 'linear-gradient(90deg, var(--color-primary, #059669) 0%, var(--color-tertiary, #3B82F6) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  13년 이상 회생파산 경험
                </span>을<br />
                바탕으로 진행됩니다.
              </h1>
              <p className="text-heading-lg-css md:text-display-xs-css text-foreground">
                {variant === 'simple' ? (
                  <>
                    수많은 사건 진행 경험을<br />
                    데이터로 축적하여,<br />
                    사건의 진행 방향을 예측하고<br />
                    고객님께 최적의 해결방안을 제시합니다.
                  </>
                ) : (
                  <>
                    법무법인 로앤은 설립 이후<br />
                    10배가 넘는 사건을 해결하며<br />
                    꾸준히 성장 중인<br />
                    회생파산 전문로펌 입니다.
                  </>
                )}
              </p>
            </div>
            
            {/* 우측: 이미지박스 */}
            <div className="w-full md:w-[588px] flex justify-center items-center h-[124px] md:h-[300px]">
                              <Image
                  src="/images/intro/hero/intro_hero_1.webp"
                  alt="회생터치 서비스 소개"
                  width={400}
                  height={300}
                  className="object-contain w-auto h-[124px] md:h-[300px] md:w-full md:max-w-[400px] lg:max-w-[588px]"
                />
            </div>
          </div>
        </Container>
      </section>

      {/* 섹션 2: 변호사 소개 */}
      {variant !== 'simple' && (
      <section id="lawyer-section" className="bg-background py-14 md:py-28">
        <Container>
          {/* 가로 2단 구조: 좌측 사진, 우측 텍스트 */}
          <div className="flex flex-col md:flex-row gap-10 md:gap-8 md:items-center">
            {/* 좌측: 변호사 사진 (반응형 크기) */}
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              <div 
                className="relative overflow-hidden w-full h-[330px] xs:h-[335px] sm:h-[340px] md:w-[380px] md:h-[523px] lg:w-[550px] lg:h-[628px]"
              >
                {/* 모바일용 이미지 (769px 미만) */}
                <Image
                  src="/images/intro/lawyer/intro_lawyer_1.webp"
                  alt="도산전문 변호사"
                  fill
                  className="absolute hover:scale-110 transition-transform duration-500 md:hidden"
                  style={{
                    objectFit: 'cover',
                    objectPosition: '50% 10%',
                    transform: 'scale(1.0)'
                  }}
                />
                {/* 데스크톱용 이미지 */}
                <Image
                  src="/images/intro/lawyer/intro_lawyer_1.webp"
                  alt="도산전문 변호사"
                  fill
                  className="absolute hover:scale-110 transition-transform duration-500 hidden md:block"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    transform: 'scale(1.5) translateY(10%)'
                  }}
                />
              </div>
            </div>
            
            {/* 우측: 텍스트 (나머지 공간 차지) */}
            <div className="flex-1 text-center md:text-left">
              {/* 세로 1단: 전문증서 (가로 2단 구성) */}
              <div className="flex flex-row gap-4 md:gap-6 items-end mb-6 md:mb-8 justify-center md:justify-start">
                {/* 좌측: 전문증서 이미지 */}
                <div className="flex-shrink-0">
                  <Image
                    src="/images/intro/lawyer/intro_lawyer_2.webp"
                    alt="전문증서"
                    width={180}
                    height={243}
                    className="object-cover object-center w-[120px] h-[162px] md:w-[116px] md:h-[156px] lg:w-[180px] lg:h-[243px]"
                  />
                </div>
                
                {/* 우측: 텍스트 */}
                <div className="text-left">
                  <h2 className="text-heading-xl-css md:text-[30px] md:leading-[38px] lg:text-[36px] lg:leading-[44px] font-bold text-foreground">
                    꾸준히 채무해결을 위해<br />
                    달려온 도산전문 변호사
                  </h2>
                </div>
              </div>
              
              {/* 세로 2단: 소개말 */}
              <div>
                {/* 소개말 내용 - 3단락 구성 */}
                <div className="space-y-3 mb-6">
                  <p className="text-body-md-css md:text-body-xl-css text-foreground">
                    누구나 겪을 수 있는 채무문제는 '어떻게' 해결하는지가 중요합니다.<br />
                    13년이 넘는 시간 동안 비슷한 고민, 비슷한 상황을 수없이 해결해왔고<br />
                    그만큼 해결 방법을 누구보다 빠르게 판단하고 제시할 수 있습니다.
                  </p>
                  
                  <p className="text-body-md-css md:text-body-xl-css text-foreground">
                    채무문제는 복잡해 보이지만,<br />
                    고객님의 상황을 정확히 이해한다면 쉽게 해결될 수 있습니다.
                  </p>
                  
                  <p className="text-body-md-css md:text-body-xl-css text-foreground">
                    지금 이 순간부터 채무해결은<br />
                    수천 건의 사건을 해결해 온 저희에게 맡겨주세요.
                  </p>
                </div>
                
                {/* 서명 */}
                <div className="flex flex-col gap-2 items-center md:items-start">
                  <div className="flex gap-2 items-baseline">
                    <p className="text-label-lg-css md:text-label-xl-css text-foreground">도산전문 변호사</p>
                    <p className="text-heading-lg-css md:text-display-xs-css text-foreground">김충환 대표</p>
                  </div>
                  <div>
                    <Image
                      src="/images/intro/lawyer/intro_lawyer_3.webp"
                      alt="서명"
                      width={120}
                      height={40}
                      className="h-[30px] md:h-[40px] w-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      )}

      {/* 섹션 3: 차별화 서비스 */}
      <section id="differentiation-section" className="bg-emerald-900 py-14 md:py-28">
        <Container>
          {/* 세로 2단 구조 */}
          <div className="flex flex-col gap-10 md:gap-12">
            {/* 1단: 텍스트 */}
            <div className="text-center flex flex-col gap-2">
              <h2 className="font-title font-black text-[26px] leading-[36px] md:text-[40px] md:leading-[52px] text-white">
                로앤의 차별화 서비스
              </h2>
              <p className="text-heading-lg-css md:text-display-xs-css text-white">
                언제나 고객을 중심으로 고민하고 해결합니다.
              </p>
            </div>
            
            {/* 2단: 서비스 3가지 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
              {/* 서비스 1 */}
              <div className="p-10 bg-card rounded-3xl">
                <div className="flex flex-col gap-8 text-center">
                  <div>
                    <h3 className="text-heading-xl-css md:text-display-xs-css text-card-foreground mb-2">
                      체계적인<br />
                      사건전담 시스템
                    </h3>
                    <p className="text-body-md-css text-card-foreground">
                      4명의 전문가가 한 팀을 이뤄<br />
                      한 사건을 전담하여 움직입니다.
                    </p>
                  </div>
                  <div className="w-[120px] h-[120px] mx-auto overflow-hidden rounded-xl">
                    <Image
                      src="/images/intro/service/intro_service_1.webp"
                      alt="체계적인 사건전담 시스템"
                      width={120}
                      height={120}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* 서비스 2 */}
              <div className="p-10 bg-card rounded-3xl">
                <div className="flex flex-col gap-8 text-center">
                  <div>
                    <h3 className="text-heading-xl-css md:text-display-xs-css text-card-foreground mb-2">
                      사건이 시작되면<br />
                      고객님 대신 전부 해결
                    </h3>
                    <p className="text-body-md-css text-card-foreground">
                      복잡한 서류 준비나<br />
                      추심 응대는 저희가 맡겨주세요.
                    </p>
                  </div>
                  <div className="w-[120px] h-[120px] mx-auto overflow-hidden rounded-xl">
                    <Image
                      src="/images/intro/service/intro_service_2.webp"
                      alt="사건이 시작되면 고객님 대신 전부 해결"
                      width={120}
                      height={120}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* 서비스 3 */}
              <div className="p-10 bg-card rounded-3xl">
                <div className="flex flex-col gap-8 text-center">
                  <div>
                    <h3 className="text-heading-xl-css md:text-display-xs-css text-card-foreground mb-2">
                      수임료,<br />
                      부담없이 분납 가능
                    </h3>
                    <p className="text-body-md-css text-card-foreground">
                      분납 옵션을 제공하여<br />
                      비용 부담을 덜어드릴게요.
                    </p>
                  </div>
                  <div className="w-[120px] h-[120px] mx-auto overflow-hidden rounded-xl">
                    <Image
                      src="/images/intro/service/intro_service_3.webp"
                      alt="수임료, 부담없이 분납 가능"
                      width={120}
                      height={120}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 섹션 4: 구성원 소개 */}
      {variant !== 'simple' && (
      <section id="team-section" className="bg-background py-14 md:py-28">
        <Container>
          <div className="flex flex-col gap-10 md:gap-12">
            {/* 1단: 제목 */}
            <div className="text-center flex flex-col gap-2">
              <h2 className="font-title font-black text-[26px] leading-[36px] md:text-[40px] md:leading-[52px] text-foreground">
                로앤 구성원 소개
              </h2>
              <p className="text-heading-lg-css md:text-display-xs-css text-foreground">
                고객과 한팀이 되어 하나의 목표만을 바라봅니다.
              </p>
            </div>
            
            {/* 2단: 구성원 그리드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {pagedMembers.map((member) => (
                <TeamMemberCard
                  key={member.id}
                  name={member.name}
                  department={member.department}
                  contact={member.contact}
                  image={member.image}
                />
              ))}
            </div>
            
            {/* 3단: 페이지네이션 */}
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                size="sm"
                showFirstLast={false}
                maxVisiblePages={3}
                className="md:hidden"
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                size="base"
                className="hidden md:flex"
              />
            </div>
          </div>
        </Container>
      </section>
      )}

      {/* 섹션 5: 4단계 안내 */}
      {FEATURE_FLAGS.SHOW_STEP_SECTIONS && (
        <section id="service-guide-section" className="bg-gray-100 py-14 md:py-28">
        <Container>
          <div className="flex flex-col gap-10">
            {/* 1단: 텍스트 */}
            <div className="text-center flex flex-col gap-2">
              <h2 className="font-title font-black text-[24px] leading-[32px] sm:text-[30px] sm:leading-[40px] md:text-[40px] md:leading-[52px]">
                <span className="text-accent">준비된 4단계로</span><br />
                <span className="text-foreground">채무 문제를 해결할 수 있어요.</span>
              </h2>
            </div>
            
            {/* 2단: 서비스 프로세스 (4단계) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* 단계 1: 자가진단 테스트 */}
              <div className="px-8 py-8 bg-card rounded-3xl shadow-xl">
                <div className="flex justify-between items-center">
                  {/* 1단: 텍스트 */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-heading-xl-css md:text-display-xs-css text-accent">
                      자가진단 테스트
                    </h3>
                    <p className="text-body-md-css md:text-body-lg-css text-card-foreground">
                      간단한 질문으로<br />현재 상황을 파악합니다.
                    </p>
                  </div>
                  {/* 2단: 이미지 */}
                  <div className="w-24 h-24 overflow-hidden">
                    <Image
                      src="/images/intro/guide/intro_guide_1.webp"
                      alt="자가진단 테스트"
                      width={96}
                      height={96}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* 단계 2: AI 사례 분석 */}
              <div className="px-8 py-8 bg-card rounded-3xl shadow-xl">
                <div className="flex justify-between items-center">
                  {/* 1단: 텍스트 */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-heading-xl-css md:text-display-xs-css text-accent">
                      {FEATURE_FLAGS.USE_TEMP_COPY 
                        ? "AI 상황 분석" // 임시 카피
                        : "AI 사례 분석" // 원본 카피
                      }
                    </h3>
                    <p className="text-body-md-css md:text-body-lg-css text-card-foreground">
                      {FEATURE_FLAGS.USE_TEMP_COPY 
                        ? <>데이터 분석을 통해<br />해결책을 제시합니다.</> // 임시 카피
                        : <>비슷한 사례를 분석해<br />최적의 방향을 제시합니다.</> // 원본 카피
                      }
                    </p>
                  </div>
                  {/* 2단: 이미지 */}
                  <div className="w-24 h-24 overflow-hidden">
                    <Image
                      src="/images/intro/guide/intro_guide_2.webp"
                      alt="AI 사례 분석"
                      width={96}
                      height={96}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* 단계 3: 전문가 매칭 */}
              <div className="px-8 py-8 bg-card rounded-3xl shadow-xl">
                <div className="flex justify-between items-center">
                  {/* 1단: 텍스트 */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-heading-xl-css md:text-display-xs-css text-accent">
                      전문가 매칭
                    </h3>
                    <p className="text-body-md-css md:text-body-lg-css text-card-foreground">
                      상황에 맞는 전문가와<br />연결됩니다.
                    </p>
                  </div>
                  {/* 2단: 이미지 */}
                  <div className="w-24 h-24 overflow-hidden">
                    <Image
                      src="/images/intro/guide/intro_guide_3.webp"
                      alt="전문가 매칭"
                      width={96}
                      height={96}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* 단계 4: 채무 해결 */}
              <div className="px-8 py-8 bg-card rounded-3xl shadow-xl">
                <div className="flex justify-between items-center">
                  {/* 1단: 텍스트 */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-heading-xl-css md:text-display-xs-css text-accent">
                      채무 해결
                    </h3>
                    <p className="text-body-md-css md:text-body-lg-css text-card-foreground">
                      전문가와 함께<br />채무 문제를 해결합니다.
                    </p>
                  </div>
                  {/* 2단: 이미지 */}
                  <div className="w-24 h-24 overflow-hidden">
                    <Image
                      src="/images/intro/guide/intro_guide_4.webp"
                      alt="채무 해결"
                      width={96}
                      height={96}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
        </section>
      )}

      {/* 섹션 6: 첫 번째 공통 레이아웃 */}
      {FEATURE_FLAGS.SHOW_STEP_SECTIONS && (
      <section className="bg-emerald-900 py-14 md:py-20">
        <Container>
          <div className="flex flex-col md:flex-row gap-6">
            {/* 1단: 텍스트 */}
            <div className="flex-1 flex flex-col gap-6 items-center md:items-start justify-center text-center md:text-left">
              {/* 1단: 뱃지 */}
              <div className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg w-fit text-heading-md-css md:text-heading-lg-css">
                1단계, 나의 상황 파악하기
              </div>
              {/* 2단: 타이틀 */}
              <h2 className="font-title font-black text-[30px] leading-[40px] sm:text-[36px] sm:leading-[44px] md:text-[48px] md:leading-[60px] text-white">
                {FEATURE_FLAGS.USE_TEMP_COPY 
                  ? "5번 터치로 자가진단" // 임시 카피
                  : "7번 터치로 자가진단" // 원본 카피
                }
              </h2>
              {/* 3단: 내용 */}
              <p className="text-body-md-css md:text-body-xl-css text-white">
                {FEATURE_FLAGS.USE_TEMP_COPY 
                  ? <>채무 문제 해결의 첫걸음은 정확한 상황 파악!<br />5번만 터치하면 해결 방향을 찾을 수 있습니다.</> // 임시 카피
                  : <>채무 문제 해결의 첫걸음은 정확한 상황 파악!<br />간단한 질문에 7번만 터치하면<br />나의 상황에 맞는 해결 방향을 찾을 수 있습니다.</> // 원본 카피
                }
              </p>
            </div>
            {/* 2단: 이미지 */}
            <div className="flex-1 flex items-center justify-center">
              <img 
                src="/images/intro/guide/intro_guide_5.webp" 
                alt="자가진단 가이드" 
                className="w-4/5 md:max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </Container>
      </section>
      )}

      {/* 섹션 7: 두 번째 공통 레이아웃 */}
      {FEATURE_FLAGS.SHOW_AI_CASE_ANALYSIS && (
      <section className="bg-blue-900 py-14 md:py-20">
        <Container>
          <div className="flex flex-col md:flex-row gap-6">
            {/* 1단: 텍스트 */}
            <div className="flex-1 flex flex-col gap-6 items-center md:items-start justify-center text-center md:text-left">
              {/* 1단: 뱃지 */}
              <div className="px-4 py-1.5 bg-blue-600 text-white rounded-lg w-fit text-heading-md-css md:text-heading-lg-css">
                {FEATURE_FLAGS.USE_TEMP_COPY 
                  ? "2단계, 축적된 데이터 분석하기" // 임시 카피
                  : "2단계, 나와 비슷한 사례 제안받기" // 원본 카피
                }
              </div>
              {/* 2단: 타이틀 */}
              <h2 className="font-title font-black text-[30px] leading-[40px] sm:text-[36px] sm:leading-[44px] md:text-[48px] md:leading-[60px] text-white">
                {FEATURE_FLAGS.USE_TEMP_COPY 
                  ? "AI 상황 분석" // 임시 카피
                  : "AI 사례 분석" // 원본 카피
                }
              </h2>
              {/* 3단: 내용 */}
              <p className="text-body-md-css md:text-body-xl-css text-white">
                {FEATURE_FLAGS.USE_TEMP_COPY 
                  ? <>데이터를 이용해 자가진단 내용을 분석합니다.<br />상황에 맞춰 변제금, 변제율 등을 예측하고<br />그에 맞는 해결 방향을 파악할 수 있습니다.</> // 임시 카피
                  : <>축적된 실제 해결 사례 데이터를 분석하여<br />자가진단 내용과 유사한 사례를 제시합니다.<br />어떤 방식으로 해결하고, 진행되었는지 파악하여<br />나의 상황의 해결 방향을 파악할 수 있습니다.</> // 원본 카피
                }
              </p>
            </div>
            {/* 2단: 이미지 */}
            <div className="flex-1 flex items-center justify-center">
              <img 
                src="/images/intro/guide/intro_guide_6.webp" 
                alt="AI 사례 분석 가이드" 
                className="w-4/5 md:max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </Container>
      </section>
      )}

      {/* 섹션 8: 세 번째 공통 레이아웃 */}
      {FEATURE_FLAGS.SHOW_CASE_MATCHING && (
      <section className="bg-gray-900 py-14 md:py-20">
        <Container>
          <div className="flex flex-col md:flex-row gap-6">
            {/* 1단: 텍스트 */}
            <div className="flex-1 flex flex-col gap-6 items-center md:items-start justify-center text-center md:text-left">
              {/* 1단: 뱃지 */}
              <div className="px-4 py-1.5 bg-gray-600 text-white rounded-lg w-fit text-heading-md-css md:text-heading-lg-css">
                3단계, 상황에 맞는 전문가 연결하기
              </div>
              {/* 2단: 타이틀 */}
              <h2 className="font-title font-black text-[30px] leading-[40px] sm:text-[36px] sm:leading-[44px] md:text-[48px] md:leading-[60px] text-white">
                전문가 매칭
              </h2>
              {/* 3단: 내용 */}
              <p className="text-body-md-css md:text-body-xl-css text-white">
                상황에 맞는 법률 전문가와 연결됩니다.<br />
                회생파산 분야의 검증된 전문 변호사 및 실무팀이<br />
                오랜 경력으로 최적의 솔루션을 제공합니다.
              </p>
            </div>
            {/* 2단: 이미지 */}
            <div className="flex-1 flex items-center justify-center">
              <img 
                src="/images/intro/guide/intro_guide_7.webp" 
                alt="전문가 매칭 가이드" 
                className="w-4/5 md:max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </Container>
      </section>
      )}

      {/* 섹션 9: 네 번째 공통 레이아웃 */}
      {FEATURE_FLAGS.SHOW_STEP_SECTIONS && (
      <section className="bg-indigo-900 py-14 md:py-20">
        <Container>
          <div className="flex flex-col md:flex-row gap-6">
            {/* 1단: 텍스트 */}
            <div className="flex-1 flex flex-col gap-6 items-center md:items-start justify-center text-center md:text-left">
              {/* 1단: 뱃지 */}
              <div className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg w-fit text-heading-md-css md:text-heading-lg-css">
                4단계, 맞춤형 해결책 실행
              </div>
              {/* 2단: 타이틀 */}
              <h2 className="font-title font-black text-[30px] leading-[40px] sm:text-[36px] sm:leading-[44px] md:text-[48px] md:leading-[60px] text-white">
                채무 해결
              </h2>
              {/* 3단: 내용 */}
              <p className="text-body-md-css md:text-body-xl-css text-white">
                서류 준비 등 사건진행에 대한 준비를 하고<br />
                회생파산 절차를 진행해 채무 문제를 해결합니다.<br />
                시작부터 결과까지 전문가가 끝까지 함께하니<br />
                걱정말고 새출발을 맞이할 준비를 해주세요!
              </p>
            </div>
            {/* 2단: 이미지 */}
            <div className="flex-1 flex items-center justify-center">
              <img 
                src="/images/intro/guide/intro_guide_8.webp" 
                alt="채무 해결 가이드" 
                className="w-4/5 md:max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </Container>
      </section>
      )}

      {/* 섹션 10: FAQ */}
      {FEATURE_FLAGS.SHOW_STEP_SECTIONS && (
      <section className="bg-gray-100 py-14 md:py-28">
        <Container>
          <div className="text-center mb-10 md:mb-12">
            <h2 className="font-title font-black text-[26px] leading-[36px] sm:text-[30px] sm:leading-[40px] md:text-[48px] md:leading-[60px] text-foreground">
              회생터치, 궁금해요!
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <Accordion items={faqItems.map(item => ({
              ...item,
              answer: item.answer.split('\n').map((line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                </span>
              ))
            }))} />
          </div>
        </Container>
      </section>
      )}

      {/* 섹션 11: CTA */}
      <section className="bg-gray-100 pb-24 md:pb-36">
        <Container>
          <div className="w-full rounded-4xl bg-emerald-800 px-8 py-16 flex flex-col items-center justify-center text-center">
            <h2 className="font-title font-black text-white text-[24px] leading-[32px] sm:text-[30px] sm:leading-[40px] md:text-[40px] md:leading-[52px] mb-4">
              지금 바로 회생터치로<br />채무 문제를 해결하세요
            </h2>
            <p className="hidden md:block text-body-xl-css text-primary-foreground mb-8">
              자가진단으로 나에게 맞는 해결책을 찾을 수 있습니다.<br />
              자가진단 후 전문가와의 상담도 놓치지 마세요.
            </p>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-xl mx-auto">
              <Link href="/diagnosis/test" className="flex-1">
                <Button 
                  colorVariant="white" 
                  styleVariant="fill" 
                  size="l" 
                  className="w-full"
                  rightIcon={<ArrowRight />}
                >
                  3분 자가진단 시작하기
                </Button>
              </Link>
              <div className="flex-1">
                <Button 
                  colorVariant="default" 
                  variant="secondary" 
                  styleVariant="fill" 
                  size="l" 
                  className="w-full"
                  rightIcon={<ArrowRight />}
                  onClick={() => setShowConsultationModal(true)}
                >
                  회생 상담 문의하기
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

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
                <form id="modalConsultationForm" onSubmit={handleSubmit} className="space-y-4">
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
                    <input
                      type="tel"
                      placeholder="연락처를 입력해주세요"
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
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
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
                        className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none"
                      >
                        <option value="">거주지역을 선택해주세요</option>
                        <option value="서울">서울</option>
                        <option value="인천">인천</option>
                        <option value="세종">세종</option>
                        <option value="대전">대전</option>
                        <option value="대구">대구</option>
                        <option value="울산">울산</option>
                        <option value="광주">광주</option>
                        <option value="부산">부산</option>
                        <option value="제주">제주</option>
                        <option value="강원도">강원도</option>
                        <option value="경기도">경기도</option>
                        <option value="충청북도">충청북도</option>
                        <option value="충청남도">충청남도</option>
                        <option value="경상북도">경상북도</option>
                        <option value="경상남도">경상남도</option>
                        <option value="전라북도">전라북도</option>
                        <option value="전라남도">전라남도</option>
                      </select>
                      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none">
                        <ChevronDown size={16} className="text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="base"
                  onClick={() => setShowConsultationModal(false)}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  variant="primary"
                  size="base"
                  onClick={handleSubmit}
                  disabled={!consultationType || !contact || !residence}
                  className="flex-1"
                >
                  상담 신청
                </Button>
              </div>

              {/* 개인정보 처리방침 동의 안내 */}
              <div className="text-xs text-muted-foreground text-center">
                상담 신청 시 개인정보 수집·이용에 동의합니다.
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
          <div className="relative bg-card border border-border rounded-xl shadow-lg w-full max-w-sm">
            <div className="p-6 space-y-4">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-heading-lg font-bold text-foreground">상담 신청 확인</h2>
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
              <div className="space-y-4">
                <p className="text-foreground">입력하신 정보로 상담을 신청하시겠습니까?</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">상담 유형</span>
                    <span className="font-medium text-foreground">{consultationType === 'phone' ? '전화상담' : '방문상담'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">연락처</span>
                    <span className="font-medium text-foreground">{contact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">거주지역</span>
                    <span className="font-medium text-foreground">{residence}</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  size="base"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  variant="primary"
                  size="base"
                  onClick={handleConfirmSubmit}
                  disabled={isSubmittingContact}
                  className="flex-1"
                >
                  {isSubmittingContact ? '신청 중...' : '확인'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 