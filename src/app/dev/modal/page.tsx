'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';

export default function ModalDemo() {
  const [isBasicOpen, setIsBasicOpen] = useState(false);
  const [isTitleOpen, setIsTitleOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isXsOpen, setIsXsOpen] = useState(false);
  const [isSmOpen, setIsSmOpen] = useState(false);
  const [isLOpen, setIsLOpen] = useState(false);
  const [isXlOpen, setIsXlOpen] = useState(false);
  const [isFullOpen, setIsFullOpen] = useState(false);
  const [isNoCloseOpen, setIsNoCloseOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <Container className="py-8">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-display-lg-css mb-4">Modal Component Demo</h1>
          <p className="text-body-lg-css text-muted-foreground">
            다양한 모달 스타일과 옵션을 테스트해보세요
          </p>
        </div>

        {/* Basic Modals */}
        <section className="space-y-6">
          <h2 className="text-heading-xl-css">기본 모달</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => setIsBasicOpen(true)}>
              기본 모달 열기
            </Button>
            <Button onClick={() => setIsTitleOpen(true)} variant="secondary">
              제목 있는 모달
            </Button>
            <Button onClick={() => setIsDrawerOpen(true)} variant="tertiary">
              드로어 모달
            </Button>
          </div>
        </section>

        {/* Size Variants */}
        <section className="space-y-6">
          <h2 className="text-heading-xl-css">사이즈 변형</h2>
          <div className="flex flex-wrap gap-4">
            <Button size="sm" onClick={() => setIsXsOpen(true)}>
              XS 모달
            </Button>
            <Button size="sm" onClick={() => setIsSmOpen(true)} variant="secondary">
              SM 모달
            </Button>
            <Button onClick={() => setIsLOpen(true)} variant="tertiary">
              L 모달
            </Button>
            <Button onClick={() => setIsXlOpen(true)} variant="outline">
              XL 모달
            </Button>
            <Button onClick={() => setIsFullOpen(true)} variant="destructive">
              전체 화면 모달
            </Button>
          </div>
        </section>

        {/* Advanced Options */}
        <section className="space-y-6">
          <h2 className="text-heading-xl-css">고급 옵션</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => setIsNoCloseOpen(true)} variant="outline">
              닫기 버튼 없는 모달
            </Button>
            <Button onClick={() => setIsFormOpen(true)} variant="secondary">
              폼 모달 예시
            </Button>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="space-y-6">
          <h2 className="text-heading-xl-css">사용법</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <pre className="text-body-sm-css text-gray-700 overflow-x-auto">
{`// 기본 사용법
const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <p>모달 내용</p>
</Modal>

// 제목과 함께
<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="모달 제목"
>
  <p>모달 내용</p>
</Modal>

// 드로어 스타일
<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  variant="drawer"
>
  <p>드로어 내용</p>
</Modal>

// 사이즈 조절
<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  size="xl"
>
  <p>큰 모달</p>
</Modal>`}
            </pre>
          </div>
        </section>
      </div>

      {/* 모든 모달들 */}
      
      {/* 기본 모달 */}
      <Modal isOpen={isBasicOpen} onClose={() => setIsBasicOpen(false)}>
        <div className="space-y-4">
          <h3 className="text-label-lg-css font-semibold">기본 모달</h3>
          <p className="text-body-md-css text-muted-foreground">
            이것은 기본 모달입니다. ESC 키를 누르거나 배경을 클릭하여 닫을 수 있습니다.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => setIsBasicOpen(false)}>
              확인
            </Button>
            <Button variant="outline" onClick={() => setIsBasicOpen(false)}>
              취소
            </Button>
          </div>
        </div>
      </Modal>

      {/* 제목 있는 모달 */}
      <Modal 
        isOpen={isTitleOpen} 
        onClose={() => setIsTitleOpen(false)}
        title="알림"
      >
        <div className="space-y-4">
          <p className="text-body-md-css">
            제목이 있는 모달입니다. 헤더에 제목과 닫기 버튼이 표시됩니다.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => setIsTitleOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>

      {/* 드로어 모달 */}
      <Modal 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        variant="drawer"
        title="설정"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-label-md-css font-medium">알림 설정</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-body-sm-css">이메일 알림</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-body-sm-css">푸시 알림</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsDrawerOpen(false)}>
              저장
            </Button>
            <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
              취소
            </Button>
          </div>
        </div>
      </Modal>

      {/* 사이즈별 모달들 */}
      <Modal isOpen={isXsOpen} onClose={() => setIsXsOpen(false)} size="xs" title="XS 모달">
        <p className="text-body-sm-css">아주 작은 모달입니다.</p>
        <Button size="sm" onClick={() => setIsXsOpen(false)} className="mt-4">
          닫기
        </Button>
      </Modal>

      <Modal isOpen={isSmOpen} onClose={() => setIsSmOpen(false)} size="sm" title="SM 모달">
        <p className="text-body-md-css">작은 모달입니다.</p>
        <Button onClick={() => setIsSmOpen(false)} className="mt-4">
          닫기
        </Button>
      </Modal>

      <Modal isOpen={isLOpen} onClose={() => setIsLOpen(false)} size="l" title="L 모달">
        <div className="space-y-4">
          <p className="text-body-md-css">큰 모달입니다. 더 많은 내용을 담을 수 있습니다.</p>
          <p className="text-body-md-css text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
            exercitation ullamco laboris.
          </p>
          <Button onClick={() => setIsLOpen(false)}>
            닫기
          </Button>
        </div>
      </Modal>

      <Modal isOpen={isXlOpen} onClose={() => setIsXlOpen(false)} size="xl" title="XL 모달">
        <div className="space-y-6">
          <p className="text-body-lg-css">아주 큰 모달입니다.</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-label-md-css font-medium">왼쪽 컬럼</h4>
              <p className="text-body-sm-css text-muted-foreground">
                여러 컬럼으로 구성된 레이아웃을 사용할 수 있습니다.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-label-md-css font-medium">오른쪽 컬럼</h4>
              <p className="text-body-sm-css text-muted-foreground">
                더 복잡한 내용을 구성할 수 있습니다.
              </p>
            </div>
          </div>
          <Button onClick={() => setIsXlOpen(false)}>
            닫기
          </Button>
        </div>
      </Modal>

      <Modal isOpen={isFullOpen} onClose={() => setIsFullOpen(false)} size="full" title="전체 화면 모달">
        <div className="space-y-6">
          <p className="text-body-lg-css">전체 화면을 사용하는 모달입니다.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="text-label-md-css font-medium">섹션 1</h4>
              <p className="text-body-sm-css text-muted-foreground">
                전체 화면 모달에서는 더 복잡한 레이아웃을 구성할 수 있습니다.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-label-md-css font-medium">섹션 2</h4>
              <p className="text-body-sm-css text-muted-foreground">
                여러 섹션으로 나누어 정보를 체계적으로 표시할 수 있습니다.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-label-md-css font-medium">섹션 3</h4>
              <p className="text-body-sm-css text-muted-foreground">
                대시보드나 상세 페이지 같은 복잡한 UI에 적합합니다.
              </p>
            </div>
          </div>
          <Button onClick={() => setIsFullOpen(false)}>
            닫기
          </Button>
        </div>
      </Modal>

      {/* 닫기 버튼 없는 모달 */}
      <Modal 
        isOpen={isNoCloseOpen} 
        onClose={() => setIsNoCloseOpen(false)}
        showCloseButton={false}
        closeOnOverlayClick={false}
        closeOnEscape={false}
        title="중요한 알림"
      >
        <div className="space-y-4">
          <p className="text-body-md-css">
            이 모달은 반드시 버튼을 통해서만 닫을 수 있습니다. 
            ESC 키나 배경 클릭으로는 닫히지 않습니다.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => setIsNoCloseOpen(false)}>
              확인
            </Button>
            <Button variant="outline" onClick={() => setIsNoCloseOpen(false)}>
              취소
            </Button>
          </div>
        </div>
      </Modal>

      {/* 폼 모달 */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        title="새 항목 추가"
        size="l"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-label-sm-css font-medium">제목</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="제목을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <label className="text-label-sm-css font-medium">설명</label>
              <textarea 
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
                placeholder="설명을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <label className="text-label-sm-css font-medium">카테고리</label>
              <select className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                <option>카테고리를 선택하세요</option>
                <option>업무</option>
                <option>개인</option>
                <option>기타</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsFormOpen(false)}>
              저장
            </Button>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              취소
            </Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
} 