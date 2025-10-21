import React from 'react'
import { Container } from '@/components/layout/Container'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background select-none">
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          {/* 페이지 헤더 */}
          <div className="text-center mb-12">
            <h1 className="text-heading-xl font-bold text-foreground mb-4">
              개인정보 처리방침
            </h1>
            <p className="text-body-lg text-muted-foreground">
              법무법인 로앤의 개인정보 처리방침을 안내드립니다.
            </p>
          </div>

          {/* 본문 콘텐츠 */}
          <div className="bg-card border border-border rounded-lg p-8 space-y-8">
            
            {/* 서문 */}
            <div className="space-y-4">
              <p className="text-body-md text-foreground leading-relaxed">
                법무법인 로앤(이하 "회사")는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 
                이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을 수립·공개합니다.
              </p>
            </div>

            {/* 제1조 */}
            <div className="space-y-4">
              <h2 className="text-heading-lg font-bold text-foreground">
                제1조(개인정보의 처리 목적)
              </h2>
              <p className="text-body-md text-foreground leading-relaxed">
                회사는 개인회생, 파산 등 법률 상담 제공을 목적으로 최소한의 개인정보를 수집·이용하며, 
                아래의 목적 외에는 사용하지 않습니다.
              </p>
              <ul className="space-y-2 ml-6">
                <li className="text-body-md text-foreground">① 전화상담 요청 접수 및 상담 서비스 제공</li>
                <li className="text-body-md text-foreground">② 상담 진행 및 필요시 법률 절차 안내</li>
                <li className="text-body-md text-foreground">③ 상담 내용에 대한 기록 및 관리</li>
              </ul>
            </div>

            {/* 제2조 */}
            <div className="space-y-4">
              <h2 className="text-heading-lg font-bold text-foreground">
                제2조(수집 항목 및 수집 방법)
              </h2>
              <p className="text-body-md text-foreground leading-relaxed">
                회사는 다음의 항목을 익명 또는 최소 수집 원칙에 따라 수집합니다.
              </p>
              <ul className="space-y-2 ml-6">
                <li className="text-body-md text-foreground">① 필수 수집 항목: 지역(시/도), 연락처(휴대전화번호)</li>
                <li className="text-body-md text-foreground">② 선택 수집 항목: 상담 희망 분야, 신청 배경</li>
                <li className="text-body-md text-foreground">③ 수집 방법: 홈페이지 상담 신청서 또는 온라인 양식 입력</li>
              </ul>
            </div>

            {/* 제3조 */}
            <div className="space-y-4">
              <h2 className="text-heading-lg font-bold text-foreground">
                제3조(개인정보의 처리 및 보유 기간)
              </h2>
              <ul className="space-y-3 ml-6">
                <li className="text-body-md text-foreground">
                  ① 회사는 개인정보 내부 보존 기간의 경과, 처리목적 달성 시 즉시 파기합니다.
                </li>
                <li className="text-body-md text-foreground">
                  ② 정보주체의 요청 시 지체 없이 삭제 조치 -파기절차 : 이용자가 입력한 정보는 처리목적 달성 후 
                  별도의 DB에 옮겨져 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다. 
                  이 때, DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 다른 목적으로 이용되지 않습니다.
                </li>
              </ul>
            </div>

            {/* 제4조 */}
            <div className="space-y-4">
              <h2 className="text-heading-lg font-bold text-foreground">
                제4조(개인정보의 제3자 제공)
              </h2>
              <p className="text-body-md text-foreground leading-relaxed">
                회사는 고객의 개인정보를 외부에 제공하거나 위탁하지 않으며, 상담 내용은 철저히 내부 보안 하에 관리됩니다.
              </p>
            </div>

            {/* 제5조 */}
            <div className="space-y-4">
              <h2 className="text-heading-lg font-bold text-foreground">
                제5조(정보주체의 권리와 행사방법)
              </h2>
              <p className="text-body-md text-foreground leading-relaxed">
                정보주체는 언제든지 다음과 같은 권리를 행사할 수 있습니다.
              </p>
              <ul className="space-y-2 ml-6">
                <li className="text-body-md text-foreground">① 개인정보 열람, 수정, 삭제 요청</li>
                <li className="text-body-md text-foreground">② 수집·이용에 대한 동의 철회</li>
                <li className="text-body-md text-foreground">③ 전화, 이메일 등을 통한 요청 가능 (본인 확인 필요)</li>
              </ul>
            </div>

            {/* 제6조 */}
            <div className="space-y-4">
              <h2 className="text-heading-lg font-bold text-foreground">
                제6조(개인정보의 안전성 확보 조치)
              </h2>
              <p className="text-body-md text-foreground leading-relaxed">
                회사는 다음과 같은 기술적·관리적 보호 조치를 시행하고 있습니다.
              </p>
              <ul className="space-y-2 ml-6">
                <li className="text-body-md text-foreground">① 상담정보의 접근 제한 및 암호화</li>
                <li className="text-body-md text-foreground">② 내부 접근 권한 통제 및 직원 보안교육</li>
                <li className="text-body-md text-foreground">③ 정보 유출 방지를 위한 비공개 저장</li>
              </ul>
            </div>

            {/* 제7조 */}
            <div className="space-y-4">
              <h2 className="text-heading-lg font-bold text-foreground">
                제7조(개인정보 보호책임자)
              </h2>
              <p className="text-body-md text-foreground leading-relaxed mb-4">
                회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 
                불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <ul className="space-y-2 ml-6">
                <li className="text-body-md text-foreground">① 이름: 관리자</li>
                <li className="text-body-md text-foreground">② 연락처: 02-555-7455</li>
                <li className="text-body-md text-foreground">③ 이메일: lawand@lawandfirm.com</li>
              </ul>
              <p className="text-body-sm text-muted-foreground mt-3">
                ※ 개인정보 보호책임 담당부서로 연결됩니다.
              </p>
            </div>

            {/* 제8조 */}
            <div className="space-y-4">
              <h2 className="text-heading-lg font-bold text-foreground">
                제8조(개인정보 처리방침 변경)
              </h2>
              <p className="text-body-md text-foreground leading-relaxed">
                본 개인정보 처리방침은 2025년 4월 10일부터 적용되며, 관련 법령 또는 내부 정책 변경 시에는 
                즉시 공지사항을 통해 안내드립니다.
              </p>
            </div>

          </div>

          {/* 하단 안내 */}
          <div className="text-center mt-12">
            <p className="text-body-sm text-muted-foreground">
              개인정보 처리방침에 대한 문의사항이 있으시면 언제든지 연락주시기 바랍니다.
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}
