'use client';

import { useState } from 'react';
import Link from 'next/link';

// 테스트 질문 데이터
const questions = [
  {
    id: 1,
    question: '현재 보유하신 채무의 총액은 얼마인가요?',
    options: [
      '1천만원 미만',
      '1천만원 ~ 3천만원',
      '3천만원 ~ 5천만원',
      '5천만원 ~ 1억원',
      '1억원 이상'
    ]
  },
  {
    id: 2,
    question: '채무 발생 주요 원인은 무엇인가요?',
    options: [
      '생활비',
      '사업 실패',
      '실직/취업 실패',
      '주택자금',
      '의료비',
      '교육비',
      '투자 실패',
      '기타'
    ]
  },
  {
    id: 3,
    question: '현재 정기적인 수입이 있으신가요?',
    options: [
      '없음',
      '월 100만원 미만',
      '월 100만원 ~ 200만원',
      '월 200만원 ~ 300만원',
      '월 300만원 ~ 500만원',
      '월 500만원 이상'
    ]
  },
  {
    id: 4,
    question: '현재 보유하신 주요 자산은 무엇인가요? (다중 선택 가능)',
    options: [
      '없음',
      '주택/부동산',
      '차량',
      '예금/적금',
      '주식/펀드',
      '기타'
    ],
    multiSelect: true
  },
  {
    id: 5,
    question: '채무 연체 기간은 얼마나 되었나요?',
    options: [
      '연체 없음',
      '3개월 미만',
      '3개월 ~ 6개월',
      '6개월 ~ 1년',
      '1년 ~ 3년',
      '3년 이상'
    ]
  }
];

export default function DiagnosisTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string | string[]}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState({ name: '', phone: '', email: '' });

  const handleSingleSelect = (option: string) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: option
    });
  };

  const handleMultiSelect = (option: string) => {
    const currentAnswers = answers[questions[currentQuestion].id] as string[] || [];
    const newAnswers = currentAnswers.includes(option)
      ? currentAnswers.filter(item => item !== option)
      : [...currentAnswers, option];
    
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: newAnswers
    });
  };
  
  const isOptionSelected = (option: string) => {
    const currentAnswer = answers[questions[currentQuestion].id];
    if (Array.isArray(currentAnswer)) {
      return currentAnswer.includes(option);
    }
    return currentAnswer === option;
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo({
      ...contactInfo,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      const submissionData = {
        answers,
        contactInfo,
        timestamp: new Date().toISOString()
      };
      
      console.log('제출된 데이터:', submissionData);
      
      // 실제 API 호출
      const response = await fetch('/api/diagnosis/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '제출 중 오류가 발생했습니다.');
      }
      
      setIsSubmitting(false);
      setSubmitted(true);
    } catch (error) {
      console.error('제출 오류:', error);
      setSubmissionError(error instanceof Error ? error.message : '제출 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    const currentQuestionId = questions[currentQuestion].id;
    return answers[currentQuestionId] !== undefined && 
      (Array.isArray(answers[currentQuestionId]) 
        ? (answers[currentQuestionId] as string[]).length > 0 
        : true);
  };

  const allQuestionsAnswered = () => {
    return questions.every(q => answers[q.id] !== undefined);
  };

  const isContactInfoComplete = () => {
    return contactInfo.name.trim() !== '' && 
           contactInfo.phone.trim() !== '' && 
           contactInfo.email.trim() !== '';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              3분 테스트로 찾는 나만의 채무 해결책
            </h1>
            
            <Link href="/dev" className="text-sm text-blue-600 hover:text-blue-800">
              ← 돌아가기
            </Link>
          </div>
          
          {!submitted ? (
            <>
              {currentQuestion < questions.length ? (
                <>
                  <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 text-right">
                      {currentQuestion + 1} / {questions.length}
                    </p>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      {questions[currentQuestion].question}
                    </h2>
                    
                    <div className="space-y-3">
                      {questions[currentQuestion].options.map((option, index) => (
                        <div 
                          key={index}
                          onClick={() => questions[currentQuestion].multiSelect 
                            ? handleMultiSelect(option) 
                            : handleSingleSelect(option)
                          }
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            isOptionSelected(option) 
                              ? 'bg-blue-50 border-blue-500' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center">
                            {questions[currentQuestion].multiSelect ? (
                              <div className={`w-5 h-5 border rounded mr-3 flex items-center justify-center ${
                                isOptionSelected(option) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                              }`}>
                                {isOptionSelected(option) && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                            ) : (
                              <div className={`w-5 h-5 border rounded-full mr-3 ${
                                isOptionSelected(option) ? 'border-4 border-blue-500' : 'border-gray-300'
                              }`}></div>
                            )}
                            <span>{option}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      onClick={goToPreviousQuestion}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        currentQuestion === 0
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      disabled={currentQuestion === 0}
                    >
                      이전
                    </button>
                    
                    <button
                      onClick={goToNextQuestion}
                      disabled={!canProceed()}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        canProceed()
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      다음
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    연락처 정보
                  </h2>
                  
                  {submissionError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                      {submissionError}
                    </div>
                  )}
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        이름 *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={contactInfo.name}
                        onChange={handleContactChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        연락처 *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={contactInfo.phone}
                        onChange={handleContactChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        이메일 *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={contactInfo.email}
                        onChange={handleContactChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-6">
                    <p>
                      * 입력하신 정보는 채무 상담 목적으로만 사용되며, 동의 없이 다른 목적으로 사용되지 않습니다.
                    </p>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      onClick={goToPreviousQuestion}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      이전
                    </button>
                    
                    <button
                      onClick={handleSubmit}
                      disabled={!allQuestionsAnswered() || !isContactInfoComplete() || isSubmitting}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        allQuestionsAnswered() && isContactInfoComplete() && !isSubmitting
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isSubmitting ? '제출 중...' : '진단 결과 보기'}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
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
                제출해주신 정보를 바탕으로 맞춤형 채무 해결책을 준비 중입니다.<br />
                곧 상담사가 연락드릴 예정입니다.
              </p>
              
              <div className="mt-6">
                <Link
                  href="/dev"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  홈으로 돌아가기
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 