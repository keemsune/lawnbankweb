"use client"

import { useState } from 'react'
import { Container } from '@/components/layout/Container'
import { Input } from '@/components/ui/Input'
import DemoBox from '@/components/ui/DemoBox'
import { Mail, Lock, Search, User, Eye, EyeOff, Calendar, Phone } from 'lucide-react'

export default function InputPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [inputValues, setInputValues] = useState({
    email: '',
    password: '',
    search: '',
    name: '',
    phone: '',
    date: ''
  })

  return (
    <div className="bg-background min-h-screen">
      <Container className="py-10">
        <div className="space-y-12">
          {/* 페이지 헤더 */}
          <div className="text-center">
            <h1 className="text-display-lg-css font-bold text-foreground mb-4">
              Input 컴포넌트
            </h1>
            <p className="text-body-lg-css text-muted-foreground">
              다양한 크기와 상태의 Input 컴포넌트들을 확인할 수 있습니다.
            </p>
          </div>

          {/* 기본 사이즈 */}
          <DemoBox title="사이즈 (Sizes)" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-heading-sm-css font-medium mb-3">Extra Small (xs)</h3>
                <Input 
                  size="xs"
                  placeholder="Extra Small Input"
                  fullWidth
                />
              </div>
              <div>
                <h3 className="text-heading-sm-css font-medium mb-3">Small (sm)</h3>
                <Input 
                  size="sm"
                  placeholder="Small Input"
                  fullWidth
                />
              </div>
              <div>
                <h3 className="text-heading-sm-css font-medium mb-3">Base (default)</h3>
                <Input 
                  size="base"
                  placeholder="Base Input"
                  fullWidth
                />
              </div>
              <div>
                <h3 className="text-heading-sm-css font-medium mb-3">Large (l)</h3>
                <Input 
                  size="l"
                  placeholder="Large Input"
                  fullWidth
                />
              </div>
              <div>
                <h3 className="text-heading-sm-css font-medium mb-3">Extra Large (xl)</h3>
                <Input 
                  size="xl"
                  placeholder="Extra Large Input"
                  fullWidth
                />
              </div>
            </div>
          </DemoBox>

          {/* 라벨과 도움말 */}
          <DemoBox title="라벨과 메시지" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="이메일 주소"
                placeholder="이메일을 입력하세요"
                type="email"
                helperText="로그인에 사용할 이메일 주소를 입력해주세요."
                fullWidth
              />
              <Input 
                label="비밀번호"
                placeholder="비밀번호를 입력하세요"
                type="password"
                errorMessage="비밀번호는 8자 이상이어야 합니다."
                fullWidth
              />
            </div>
          </DemoBox>

          {/* 아이콘이 있는 Input */}
          <DemoBox title="아이콘 (Icons)" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="이메일"
                placeholder="이메일을 입력하세요"
                leftIcon={<Mail />}
                value={inputValues.email}
                onChange={(e) => setInputValues(prev => ({ ...prev, email: e.target.value }))}
                fullWidth
              />
              <Input 
                label="검색"
                placeholder="검색어를 입력하세요"
                leftIcon={<Search />}
                value={inputValues.search}
                onChange={(e) => setInputValues(prev => ({ ...prev, search: e.target.value }))}
                fullWidth
              />
              <Input 
                label="비밀번호"
                placeholder="비밀번호를 입력하세요"
                type={showPassword ? "text" : "password"}
                leftIcon={<Lock />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                }
                value={inputValues.password}
                onChange={(e) => setInputValues(prev => ({ ...prev, password: e.target.value }))}
                fullWidth
              />
              <Input 
                label="이름"
                placeholder="이름을 입력하세요"
                rightIcon={<User />}
                value={inputValues.name}
                onChange={(e) => setInputValues(prev => ({ ...prev, name: e.target.value }))}
                fullWidth
              />
            </div>
          </DemoBox>

          {/* 상태별 Input */}
          <DemoBox title="상태 (States)" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="기본 상태"
                placeholder="기본 상태 Input"
                fullWidth
              />
              <Input 
                label="포커스된 상태"
                placeholder="이 Input을 클릭해보세요"
                fullWidth
                autoFocus
              />
              <Input 
                label="에러 상태"
                placeholder="에러가 있는 Input"
                errorMessage="필수 입력 항목입니다."
                fullWidth
              />
              <Input 
                label="비활성화 상태"
                placeholder="비활성화된 Input"
                disabled
                fullWidth
              />
              <Input 
                label="로딩 상태"
                placeholder="로딩 중..."
                isLoading
                fullWidth
              />
              <Input 
                label="값이 있는 상태"
                placeholder="값 입력됨"
                defaultValue="입력된 값"
                fullWidth
              />
            </div>
          </DemoBox>

          {/* 입력 타입별 */}
          <DemoBox title="입력 타입 (Input Types)" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="텍스트 입력"
                type="text"
                placeholder="텍스트를 입력하세요"
                leftIcon={<User />}
                fullWidth
              />
              <Input 
                label="이메일 입력"
                type="email"
                placeholder="email@example.com"
                leftIcon={<Mail />}
                fullWidth
              />
              <Input 
                label="비밀번호 입력"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock />}
                fullWidth
              />
              <Input 
                label="전화번호 입력"
                type="tel"
                placeholder="010-1234-5678"
                leftIcon={<Phone />}
                value={inputValues.phone}
                onChange={(e) => setInputValues(prev => ({ ...prev, phone: e.target.value }))}
                fullWidth
              />
              <Input 
                label="숫자 입력"
                type="number"
                placeholder="숫자를 입력하세요"
                fullWidth
              />
              <Input 
                label="날짜 선택"
                type="date"
                leftIcon={<Calendar />}
                value={inputValues.date}
                onChange={(e) => setInputValues(prev => ({ ...prev, date: e.target.value }))}
                fullWidth
              />
            </div>
          </DemoBox>

          {/* 폼 예시 */}
          <DemoBox title="실제 폼 예시" className="space-y-6">
            <div className="max-w-md mx-auto space-y-4">
              <h3 className="text-heading-lg-css font-bold text-center mb-6">로그인</h3>
              <Input 
                label="이메일 주소"
                type="email"
                placeholder="이메일을 입력하세요"
                leftIcon={<Mail />}
                required
                fullWidth
              />
              <Input 
                label="비밀번호"
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력하세요"
                leftIcon={<Lock />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                }
                required
                fullWidth
              />
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors text-label-md-css font-medium"
                >
                  로그인
                </button>
              </div>
            </div>
          </DemoBox>

        </div>
      </Container>
    </div>
  )
}