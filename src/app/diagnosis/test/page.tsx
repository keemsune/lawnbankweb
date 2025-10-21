'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DiagnosisService } from '@/lib/diagnosis';

// 비활성화된 질문에 대한 기본값 제공
const getDefaultAnswerForDisabledQuestion = (questionId: number): string | string[] => {
  switch (questionId) {
    case 1: return '미혼'; // 혼인여부 기본값
    case 2: return '없다'; // 미성년 자녀 기본값
    case 3: return '소득이 없다'; // 소득활동 기본값
    case 5: return []; // 재산 기본값 (빈 배열)
    case 6: return '1천만원 이하'; // 총 채무금액 기본값
    default: return '';
  }
};

// 비활성화된 추가질문에 대한 기본값 제공
const getDefaultAnswerForDisabledAdditionalQuestion = (questionId: number): string => {
  switch (questionId) {
    case 2: return '1명'; // 자녀 수 기본값
    case 3: return '200만원 미만'; // 월 평균 소득액 기본값
    default: return '';
  }
};

// 테스트 질문 데이터
const questions = [
  {
    id: 1,
    question: (
      <>
        현재 <span className="text-accent">혼인여부</span>를 알려주세요.
      </>
    ),
    options: [
      '혼인',
      '미혼',
      '이혼'
    ],
    disabled: false // 질문 비활성화 여부 (true: 숨김, false: 노출)
  },
  {
    id: 2,
    question: (
      <>
        양육하고 계신 <span className="text-accent">미성년 자녀</span>가 있으신가요?
      </>
    ),
    options: [
      '있다',
      '없다'
    ],
    disabled: false,
    additionalQuestionDisabled: true // 추가질문(자녀 수) 비활성화
  },
  {
    id: 3,
    question: (
      <>
        현재 <span className="text-accent">소득활동</span>은 어떻게 하고 계세요?
      </>
    ),
    options: [
      '소득이 없다',
      '직장인(급여소득)',
      '자영업(사업소득)',
      '기타소득'
    ],
    disabled: false,
    additionalQuestionDisabled: false // 추가질문(월 평균 소득액) 활성화 유지
  },
  {
    id: 5,
    question: (
      <>
        가지고 계신 <span className="text-accent">재산</span>을 모두 알려주세요.{'\n'}여러가지 선택도 가능해요!
      </>
    ),
    options: [
      '재산이 없다',
      '예금/적금',
      '보험',
      '임차보증금',
      '자동차/오토바이',
      '부동산',
      '기타'
    ],
    multiSelect: true,
    disabled: false
  },
  {
    id: 6,
    question: (
      <>
        마지막 질문이에요!{'\n'}<span className="text-accent">총 채무금액</span>이 얼마인가요?
      </>
    ),
    options: [
      '1천만원 이하',
      '1천만~5천만원',
      '5천만~1억원',
      '1억~3억원',
      '3억~5억원',
      '5억원 이상'
    ],
    disabled: false
  }
];

export default function DiagnosisTest() {
  const [isMounted, setIsMounted] = useState(true); // 일단 true로 시작
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 활성화된 질문들만 필터링
  const activeQuestions = questions.filter(q => !q.disabled);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string | string[]}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  const isSavingRef = useRef(false); // 중복 저장 방지 플래그
  
  // 임시 연락처 입력 상태 (전환 테스트용)
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: ''
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // localStorage에서 진행 상태 복원 (컴포넌트 마운트 시 한 번만)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem('diagnosisTestProgress');
      if (savedProgress) {
        try {
          const { currentQuestion: savedQuestion, answers: savedAnswers } = JSON.parse(savedProgress);

          setCurrentQuestion(savedQuestion || 0);
          setAnswers(savedAnswers || {});
        } catch (error) {
          console.error('진행 상태 복원 중 오류:', error);
        }
      }
      setIsInitialized(true);
      setIsMounted(true); // 초기화가 완료된 후에 마운트 상태로 설정
    }
  }, []);

  // 진행 상태를 localStorage에 저장 (초기화 완료 후에만)
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      const progressData = {
        currentQuestion,
        answers
      };
      localStorage.setItem('diagnosisTestProgress', JSON.stringify(progressData));
    }
  }, [isInitialized, currentQuestion, answers]);

  // 처음으로 돌아가기 (첫 번째 질문으로 이동 + 모든 답변 초기화)
  const handleGoToFirst = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setSubmitted(false);
    setSubmissionError(null);
  };

  const handleSingleSelect = (option: string) => {
    // 원래 질문 ID를 사용 (비활성화된 질문 고려)
    const originalQuestionId = activeQuestions[currentQuestion].id;
    const currentAnswer = answers[originalQuestionId];
    
    // 이미 선택된 옵션을 다시 클릭하면 선택 해제 (토글)
    if (currentAnswer === option) {
      setAnswers({
        ...answers,
        [originalQuestionId]: undefined
      });
    } else {
      setAnswers({
        ...answers,
        [originalQuestionId]: option
      });
    }
  };

  const handleMultiSelect = (option: string) => {
    // 원래 질문 ID를 사용 (비활성화된 질문 고려)
    const originalQuestionId = activeQuestions[currentQuestion].id;
    const currentAnswers = answers[originalQuestionId] as string[] || [];
    
    // 재산 질문(id: 5)에 대한 특별한 로직
    if (originalQuestionId === 5) {
      if (option === '재산이 없다') {
        // '재산이 없다'를 선택한 경우
        if (currentAnswers.includes('재산이 없다')) {
          // 이미 선택되어 있으면 선택 해제
          setAnswers({
            ...answers,
            [originalQuestionId]: []
          });
        } else {
          // 다른 모든 선택을 해제하고 '재산이 없다'만 선택
          setAnswers({
            ...answers,
            [originalQuestionId]: ['재산이 없다']
          });
        }
      } else {
        // 다른 재산 항목을 선택한 경우
        let newAnswers;
        if (currentAnswers.includes(option)) {
          // 이미 선택된 항목이면 선택 해제
          newAnswers = currentAnswers.filter(item => item !== option);
        } else {
          // '재산이 없다'가 선택되어 있으면 제거하고 새 항목 추가
          const filteredAnswers = currentAnswers.filter(item => item !== '재산이 없다');
          newAnswers = [...filteredAnswers, option];
        }
        
        setAnswers({
          ...answers,
          [originalQuestionId]: newAnswers
        });
      }
    } else {
      // 다른 질문들은 기존 로직 사용
      const newAnswers = currentAnswers.includes(option)
        ? currentAnswers.filter(item => item !== option)
        : [...currentAnswers, option];
      
      setAnswers({
        ...answers,
        [originalQuestionId]: newAnswers
      });
    }
  };
  
  const isOptionSelected = (option: string) => {
    // 원래 질문 ID를 사용 (비활성화된 질문 고려)
    const originalQuestionId = activeQuestions[currentQuestion].id;
    const currentAnswer = answers[originalQuestionId];
    if (Array.isArray(currentAnswer)) {
      return currentAnswer.includes(option);
    }
    return currentAnswer === option;
  };

  const goToNextQuestion = () => {
    if (currentQuestion < activeQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentQuestion === activeQuestions.length - 1) {
      // 마지막 질문에서 "결과 확인하기" 클릭 시 로딩 화면 표시
      setIsLoadingResult(true);
      
      // 3초 후 테스트 완료 및 데이터 저장
      setTimeout(async () => {
        // 중복 저장 방지
        if (isSavingRef.current) {
          console.log('이미 저장 중입니다. 중복 실행을 건너뜁니다.');
          return;
        }
        isSavingRef.current = true;
        
        try {
          // 현재는 모든 테스트를 'test' 상태로 저장 (연락처 UI 구현 전까지)
          const testContactInfo = {
            name: '익명 사용자',
            phone: 'test-user', // 테스트용 더미 값 (저장 조건 만족)
            email: ''
          };
          
          console.log('=== 진단 데이터 저장 시작 ===');
          console.log('전환 상태: test (연락처 UI 구현 전)');
          console.log('답변 데이터:', answers);
          console.log('testContactInfo:', testContactInfo);
          
          // 비활성화된 질문에 대한 기본값 추가
          const completeAnswers = { ...answers };
          questions.forEach(question => {
            // 비활성화된 질문의 기본값 추가
            if (question.disabled && !completeAnswers[question.id]) {
              completeAnswers[question.id] = getDefaultAnswerForDisabledQuestion(question.id);
            }
            
            // 비활성화된 추가질문의 기본값 추가
            if (question.additionalQuestionDisabled && !completeAnswers[`${question.id}_additional`]) {
              const additionalKey = `${question.id}_additional`;
              completeAnswers[additionalKey] = getDefaultAnswerForDisabledAdditionalQuestion(question.id);
            }
          });
          
          console.log('완성된 답변 데이터 (기본값 포함):', completeAnswers);
          
          // 진단 결과 계산
          console.log('DiagnosisService.processDiagnosis 호출 시작...');
          const diagnosisResult = await DiagnosisService.processDiagnosis(completeAnswers as any, testContactInfo);
          console.log('진단 결과 계산 완료:', diagnosisResult);
          
          // 로컬 스토리지에 결과 저장 (기존 방식 유지)
          DiagnosisService.saveDiagnosisResult(diagnosisResult);
          
          // 저장 후 즉시 확인
          const savedRecords = JSON.parse(localStorage.getItem('diagnosis_records') || '[]');
          console.log('저장 후 로컬 스토리지 확인:', savedRecords);
          console.log('저장된 기록 수:', savedRecords.length);
          
          console.log('=== 진단 데이터 저장 완료 ===');
          console.log('관리자 대시보드에서 확인 가능: /diagnosis/admin');
          
        } catch (error) {
          console.error('진단 데이터 저장 중 오류:', error);
        } finally {
          // 저장 완료 후 플래그 리셋
          isSavingRef.current = false;
        }
        
        setIsLoadingResult(false);
        
        // 테스트 완료 시 저장된 진행 상태 삭제
        if (typeof window !== 'undefined') {
          localStorage.removeItem('diagnosisTestProgress');
        }
        
        // 진단 결과 페이지로 이동
        window.location.href = '/diagnosis/result';
      }, 3000);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };


  const canProceed = () => {
    // 원래 질문 ID를 사용 (비활성화된 질문 고려)
    const originalQuestionId = activeQuestions[currentQuestion]?.id;
    if (!originalQuestionId) return false;
    
    const currentAnswer = answers[originalQuestionId];
    const currentQuestionData = activeQuestions[currentQuestion];
    
    // 메인 질문이 답변되지 않은 경우
    if (currentAnswer === undefined || 
        (Array.isArray(currentAnswer) && currentAnswer.length === 0)) {
      return false;
    }
    
    // 추가 질문이 필요한 경우 확인
    const needsAdditionalAnswer = () => {
      // Q2: 양육하고 계신 미성년 자녀가 있으신가요?
      if (originalQuestionId === 2 && currentAnswer === '있다') {
        // 추가질문이 비활성화된 경우 추가 답변 불필요
        if (currentQuestionData.additionalQuestionDisabled) return false;
        return answers[`${originalQuestionId}_additional`] === undefined;
      }
      
      // Q3: 현재 소득활동은 어떻게 하고 계세요?
      if (originalQuestionId === 3 && (currentAnswer === '직장인(급여소득)' || currentAnswer === '자영업(사업소득)')) {
        // 추가질문이 비활성화된 경우 추가 답변 불필요
        if (currentQuestionData.additionalQuestionDisabled) return false;
        return answers[`${originalQuestionId}_additional`] === undefined;
      }
      
      return false;
    };
    
    // 추가 질문이 필요한데 답변하지 않은 경우
    if (needsAdditionalAnswer()) {
      return false;
    }
    
    return true;
  };

  const allQuestionsAnswered = () => {
    return questions.every((q, index) => answers[index + 1] !== undefined);
  };

  // 임시 연락처 제출 함수 (전환 테스트용)
  const handleContactSubmit = async () => {
    console.log('handleContactSubmit 호출됨');
    console.log('contactInfo:', contactInfo);
    
    if (!contactInfo.name.trim() || !contactInfo.phone.trim()) {
      console.log('이름 또는 전화번호가 비어있음');
      return;
    }

    setIsSubmittingContact(true);
    
    try {
      // 가장 최근 테스트 기록을 찾아서 전환 상태로 업데이트
      const records = JSON.parse(localStorage.getItem('diagnosis_records') || '[]');
      console.log('현재 저장된 기록들:', records);
      console.log('기록 개수:', records.length);
      
      if (records.length > 0) {
        // 가장 최근 기록 (첫 번째 요소)
        const latestRecord = records[0];
        console.log('업데이트할 기록:', latestRecord);
        
        // 연락처 정보 업데이트
        latestRecord.contactInfo.name = contactInfo.name;
        latestRecord.contactInfo.phone = contactInfo.phone;
        latestRecord.conversionStatus = 'converted';
        
        // 로컬 스토리지에 저장
        localStorage.setItem('diagnosis_records', JSON.stringify(records));
        
        console.log('전환 상태 업데이트 완료:', latestRecord);
        
        // 성공 상태로 변경
        setContactSubmitted(true);
        setShowContactForm(false);
        setContactInfo({ name: '', phone: '' });
      } else {
        console.log('업데이트할 테스트 기록이 없습니다');
      }
    } catch (error) {
      console.error('연락처 등록 중 오류:', error);
    } finally {
      setIsSubmittingContact(false);
    }
  };

  // 추가 질문 렌더링 함수
  const renderAdditionalQuestion = () => {
    // 원래 질문 ID를 사용 (비활성화된 질문 고려)
    const originalQuestionId = activeQuestions[currentQuestion].id;
    const currentAnswer = answers[originalQuestionId];
    const currentQuestionData = activeQuestions[currentQuestion];
    
    // Q2: 양육하고 계신 미성년 자녀가 있으신가요?
    if (originalQuestionId === 2 && currentAnswer === '있다') {
      // 추가질문이 비활성화된 경우 기본값 자동 설정 후 null 반환
      if (currentQuestionData.additionalQuestionDisabled) {
        // 기본값 자동 설정 (1명으로 설정)
        if (!answers[`${originalQuestionId}_additional`]) {
          setTimeout(() => {
            setAnswers(prev => ({
              ...prev,
              [`${originalQuestionId}_additional`]: '1명'
            }));
          }, 0);
        }
        return null; // 추가질문 UI는 렌더링하지 않음
      }
      
      return (
        <div className="mt-8 p-6 bg-muted rounded-2xl">
          <h3 className="text-heading-xl text-foreground mb-6">
            <span className="text-accent">있다면</span>,<br/>
            <span className="text-accent">몇 명</span>을 양육하고 계신가요?
          </h3>
          <div className="flex flex-wrap gap-2">
            {['1명', '2명', '3명', '4명', '5명 이상'].map((option) => (
              <div 
                key={option}
                onClick={() => setAnswers({
                  ...answers,
                  [`${originalQuestionId}_additional`]: option
                })}
                className={`px-6 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  answers[`${originalQuestionId}_additional`] === option
                    ? 'bg-[#059669]/15 border border-[#059669]/15' 
                    : 'bg-card border border-border hover:bg-muted'
                }`}
              >
                <span className={`${
                  answers[`${originalQuestionId}_additional`] === option
                    ? 'text-heading-md text-accent' 
                    : 'text-label-md text-foreground'
                }`}>
                  {option}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // Q3: 현재 소득활동은 어떻게 하고 계세요?
    if (originalQuestionId === 3 && (currentAnswer === '직장인(급여소득)' || currentAnswer === '자영업(사업소득)')) {
      // 추가질문이 비활성화된 경우 기본값 자동 설정 후 null 반환
      if (currentQuestionData.additionalQuestionDisabled) {
        // 기본값 자동 설정 (200만원 미만으로 설정)
        if (!answers[`${originalQuestionId}_additional`]) {
          setTimeout(() => {
            setAnswers(prev => ({
              ...prev,
              [`${originalQuestionId}_additional`]: '200만원 미만'
            }));
          }, 0);
        }
        return null; // 추가질문 UI는 렌더링하지 않음
      }
      
      return (
        <div className="mt-8 p-6 bg-muted rounded-2xl">
          <h3 className="text-heading-xl text-foreground mb-6">
            <span className="text-accent">소득이 있다면</span>,<br/>
            <span className="text-accent">월 평균 소득액</span>이 어떻게 되시나요?
          </h3>
          <div className="flex flex-wrap gap-2">
            {['200만원 미만', '200만~300만원', '300만~400만원', '400만~500만원', '500만원 이상'].map((option) => (
              <div 
                key={option}
                onClick={() => setAnswers({
                  ...answers,
                  [`${originalQuestionId}_additional`]: option
                })}
                className={`px-6 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  answers[`${originalQuestionId}_additional`] === option
                    ? 'bg-[#059669]/15 border border-[#059669]/15' 
                    : 'bg-card border border-border hover:bg-muted'
                }`}
              >
                <span className={`${
                  answers[`${originalQuestionId}_additional`] === option
                    ? 'text-heading-md text-accent' 
                    : 'text-label-md text-foreground'
                }`}>
                  {option}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return null;
  };

  // 클라이언트 사이드에서만 렌더링
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-foreground">테스트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 로딩 화면 렌더링
  if (isLoadingResult) {
    return (
      <div className="h-screen bg-background-1 relative md:h-[calc(100vh-72px)] lg:h-[calc(100vh-80px)] md:bg-background-2 md:px-4">
        {/* 배경 이미지 - 데스크탑에서만 */}
        <div className="absolute inset-0 z-0 flex items-center justify-center hidden md:flex">
          <div className="w-[90%] h-[90%] relative">
            <Image
              src="/images/diagnosis/test/diagnosis_test_bg.webp"
              alt="테스트 배경 이미지"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        
        {/* 컨텐츠 박스 */}
        <div className="relative z-20 flex items-start justify-center h-full py-0 md:items-center md:py-8 md:h-full">
          <div className="w-full h-mobile-full flex items-center justify-center md:w-[588px] md:h-[calc(100%-60px)] md:bg-card md:rounded-3xl md:shadow-xl">
            <div className="flex flex-col items-center justify-center gap-10 px-6">
              {/* 1단: 텍스트 */}
              <div className="text-center">
                <h1 
                  className="text-accent font-extrabold"
                  style={{ 
                    fontSize: '30px', 
                    lineHeight: '40px',
                    fontFamily: 'var(--font-title), sans-serif' 
                  }}
                >
                  테스트 완료!
                </h1>
              </div>
              
              {/* 2단: 이미지 */}
              <div className="relative w-36 h-36">
                <Image
                  src="/images/diagnosis/test/diagnosis_test_1.webp"
                  alt="결과 로딩 이미지"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              {/* 3단: 스피너 */}
              <div className="flex justify-center">
                <svg 
                  className="animate-spin w-8 h-8 text-accent" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              
              {/* 4단: 텍스트 */}
              <div className="text-center">
                <p className="text-heading-lg text-foreground">
                  잠시 기다려주세요<br/>
                  진단결과를 위해<br/>
                  입력하신 데이터를 전송중입니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background-1 relative md:h-[calc(100vh-72px)] lg:h-[calc(100vh-80px)] md:bg-background-2 md:px-4">
      {/* 배경 이미지 - 데스크탑에서만 */}
      <div className="absolute inset-0 z-0 flex items-center justify-center hidden md:flex">
        <div className="w-[90%] h-[90%] relative">
          <Image
            src="/images/diagnosis/test/diagnosis_test_bg.webp"
            alt="테스트 배경 이미지"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
      
      {/* 콘텐츠 */}
      <div className="relative z-20 flex items-start justify-center h-full py-0 md:items-center md:py-8 md:h-full">
        <div className="w-full flex flex-col pointer-events-auto md:w-[588px] md:h-[calc(100%-60px)] md:bg-card md:rounded-3xl md:shadow-xl md:overflow-hidden">
          {/* 1단: 네비게이션 버튼 */}
          <div className="px-6 pt-6 pb-4 flex justify-between items-center">
            <button 
              onClick={handleGoToFirst}
              className="flex items-center gap-1 text-label-sm-css text-foreground hover:opacity-80 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
              처음으로
            </button>
            
            <Link 
              href="/diagnosis"
              className="text-label-sm text-gray-400 hover:opacity-80 transition-opacity"
            >
              나가기
            </Link>
          </div>
          
          {/* 2단: 컨텐츠 */}
          <div className="flex-1 px-6 py-4 flex flex-col pb-28 md:pb-4 md:overflow-y-auto">
          
          {isLoadingResult ? (
            /* 로딩 화면 */
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-6">
                <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                진단 결과를 분석하고 있습니다...
              </h2>
              
              <p className="text-sm text-gray-500">
                잠시만 기다려주세요.
              </p>
            </div>
          ) : !submitted && currentQuestion < activeQuestions.length ? (
                <>
                  {/* 1. 프로그레스바 */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3">
                      {/* 막대 */}
                      <div className="flex-1 bg-muted rounded-full h-[10px]">
                        <div 
                          className="bg-accent h-[10px] rounded-full transition-all duration-300" 
                        style={{ width: `${(currentQuestion / activeQuestions.length) * 100}%` }}
                      ></div>
                      </div>
                      {/* 텍스트 */}
                      <p className="text-caption-lg text-foreground">
                        {currentQuestion + 1}/{activeQuestions.length}
                      </p>
                    </div>
                  </div>
                  
                  {/* 2. 질문 */}
                  <div className="mb-6 space-y-2">
                    {/* 질문번호 */}
                    <h2 
                      className="text-foreground font-extrabold"
                      style={{ 
                        fontSize: '24px', 
                        lineHeight: '34px',
                        fontFamily: 'var(--font-title), sans-serif' 
                      }}
                    >
                      Q{currentQuestion + 1}.
                    </h2>
                    
                    {/* 질문내용 */}
                    <h2 className="text-display-xs text-foreground whitespace-pre-line">
                      {activeQuestions[currentQuestion].question}
                    </h2>
                  </div>
                    
                  {/* 3. 선택옵션 */}
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2">
                      {activeQuestions[currentQuestion] && activeQuestions[currentQuestion].options ? activeQuestions[currentQuestion].options.map((option, index) => (
                        <div 
                          key={index}
                          onClick={() => {
                            if (activeQuestions[currentQuestion]?.multiSelect) {
                              handleMultiSelect(option);
                            } else {
                              handleSingleSelect(option);
                            }
                          }}
                          className={`px-6 py-3 rounded-lg cursor-pointer transition-all duration-200 touch-manipulation pointer-events-auto ${
                            isOptionSelected(option) 
                              ? 'bg-[#059669]/15 border border-[#059669]/15' 
                              : 'bg-card border border-border hover:bg-muted'
                          }`}
                        >
                          <span className={`${
                            isOptionSelected(option) 
                              ? 'text-heading-md text-accent' 
                              : 'text-label-md text-foreground'
                          }`}>
                            {option}
                          </span>
                        </div>
                      )) : (
                        <div>질문을 불러올 수 없습니다.</div>
                      )}
                    </div>
                    
                    {/* 조건부 추가 질문 */}
                    {renderAdditionalQuestion()}
                  </div>
                  
                  {/* 4. 데스크탑 하단 고정 버튼 */}
                  <div className="hidden md:block mt-auto pt-6 pb-6">
                    <div className="flex gap-6">
                      {currentQuestion > 0 && currentQuestion < 5 && (
                        <Button
                          onClick={goToPreviousQuestion}
                          colorVariant="alternative"
                          styleVariant="outline"
                          size="base"
                          leftIcon={<ChevronLeft />}
                          className="flex-1"
                        >
                          이전
                        </Button>
                      )}
                      
                      <Button
                        onClick={goToNextQuestion}
                        colorVariant="default"
                        styleVariant="fill"
                        size="base"
                        rightIcon={<ChevronRight />}
                        disabled={!canProceed()}
                        className={(currentQuestion === 0 || currentQuestion === 5) ? "w-full" : "flex-1"}
                      >
                        {currentQuestion === activeQuestions.length - 1 ? "결과보기" : "다음"}
                      </Button>
                    </div>
                  </div>
                </>
          ) : submitted ? (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                진단이 완료되었습니다!
                  </h2>
                  
              <p className="text-sm text-gray-500 mb-6">
                테스트 결과가 저장되었습니다.<br />
                관리자 대시보드에서 결과를 확인할 수 있습니다.
              </p>

              {/* 디버깅 정보 */}
              <div className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg text-xs">
                <p><strong>디버깅 정보:</strong></p>
                <p>저장된 기록 수: {(() => {
                  try {
                    const records = JSON.parse(localStorage.getItem('diagnosis_records') || '[]');
                    return records.length;
                  } catch {
                    return '오류';
                  }
                })()}</p>
                <p>연락처 입력 상태: {showContactForm ? '표시됨' : '숨김'}</p>
                <p>제출 완료 상태: {contactSubmitted ? '완료' : '미완료'}</p>
                    </div>

              {/* 임시 연락처 입력 폼 (전환 테스트용) */}
              {contactSubmitted ? (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm text-green-800">
                      <strong>연락처가 등록되었습니다!</strong> 전환 상태로 변경되었습니다.
                    </p>
                  </div>
                </div>
              ) : !showContactForm ? (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 mb-3">
                    <strong>[테스트용]</strong> 전환 상태 테스트를 위해 연락처를 입력하시겠습니까?
                  </p>
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-md hover:bg-yellow-700"
                  >
                    연락처 입력하기
                  </button>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-4">연락처 정보 입력</h3>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="이름"
                        value={contactInfo.name}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="전화번호 (예: 010-1234-5678)"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('버튼 클릭됨');
                          handleContactSubmit();
                        }}
                        disabled={isSubmittingContact || !contactInfo.name.trim() || !contactInfo.phone.trim()}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmittingContact ? '등록 중...' : '연락처 등록'}
                      </button>
                      <button
                        onClick={() => setShowContactForm(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 space-y-3">
                <div>
                  <Link
                    href="/diagnosis/admin"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    관리자 대시보드에서 결과 확인
                  </Link>
                </div>
                <div>
                <Link
                  href="/"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  홈으로 돌아가기
                </Link>
              </div>
            </div>
            </div>
          ) : null}
          </div>
        </div>
      </div>
      
      {/* 모바일 플로팅 버튼 - 질문 화면에서만 표시 */}
      {!submitted && currentQuestion < activeQuestions.length && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background-1 border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
          <div className="flex gap-4">
                {currentQuestion > 0 && currentQuestion < 5 && (
                  <Button
                    onClick={goToPreviousQuestion}
                    colorVariant="alternative"
                    styleVariant="outline"
                    size="base"
                    leftIcon={<ChevronLeft />}
                    className="flex-1"
                  >
                    이전
                  </Button>
                )}
                
                <Button
                  onClick={goToNextQuestion}
                  colorVariant="default"
                  styleVariant="fill"
                  size="base"
                  rightIcon={<ChevronRight />}
                  disabled={!canProceed()}
                  className={(currentQuestion === 0 || currentQuestion === 5) ? "w-full" : "flex-1"}
                >
                  {currentQuestion === 5 ? "결과 확인하기" : "다음"}
                </Button>
          </div>
        </div>
      )}
    </div>
  );
}