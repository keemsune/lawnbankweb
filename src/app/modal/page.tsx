'use client';

import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export default function ModalDevPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (modalId: string) => setActiveModal(modalId);
  const closeModal = () => setActiveModal(null);

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-display-lg-css font-bold text-foreground mb-8">
          Modal Component Development
        </h1>

        {/* 새로운 디자인 스펙 정보 */}
        <div className="mb-12 p-6 bg-muted rounded-lg">
          <h2 className="text-heading-md-css font-semibold text-foreground mb-4">
            디자인 스펙
          </h2>
          <div className="space-y-3 text-body-sm-css text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">기본 스펙</h3>
              <ul className="space-y-1 ml-4">
                <li>• 최소 사이즈: 가로 343px, 세로 230px</li>
                <li>• 모달 박스 컬러: card</li>
                <li>• 모서리 반지름: rounded-lg (8px)</li>
                <li>• 테두리 컬러: border</li>
                <li>• 세 영역 간격: space-6 (24px)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-2">Modal Header</h3>
              <ul className="space-y-1 ml-4">
                <li>• 타이틀: 왼쪽 정렬, heading-md, card-foreground</li>
                <li>• 닫기 버튼: 우측 정렬, 20×20px, muted 컬러</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Modal Body</h3>
              <ul className="space-y-1 ml-4">
                <li>• Exclamation 아이콘: 40×40px, gray-400</li>
                <li>• 콘텐츠: body-md, card-foreground</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Modal Footer</h3>
              <ul className="space-y-1 ml-4">
                <li>• 왼쪽 버튼: sm 사이즈, outline</li>
                <li>• 오른쪽 버튼: sm 사이즈, fill</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 구조화된 모달 데모 */}
        <section className="mb-12">
          <h2 className="text-heading-md-css font-semibold text-foreground mb-6">
            Structured Modal Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openModal('delete-confirm')}
              className="w-full"
            >
              삭제 확인 모달
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openModal('save-confirm')}
              className="w-full"
            >
              저장 확인 모달
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openModal('warning')}
              className="w-full"
            >
              경고 모달
            </Button>
          </div>
        </section>

        {/* Modal Header 제어 데모 */}
        <section className="mb-12">
          <h2 className="text-heading-md-css font-semibold text-foreground mb-6">
            Modal Header Control Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openModal('title-only')}
              className="w-full"
            >
              타이틀만 표시
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openModal('close-only')}
              className="w-full"
            >
              닫기 버튼만 표시
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openModal('no-header')}
              className="w-full"
            >
              헤더 없음
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openModal('full-header')}
              className="w-full"
            >
              전체 헤더
            </Button>
          </div>
        </section>

        {/* Modal Body Control Examples */}
        <section className="mb-12">
          <h2 className="text-heading-md-css font-semibold text-foreground mb-6">
            Modal Body Control Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openModal('with-exclamation')}
              className="w-full"
            >
              아이콘 있음
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openModal('without-exclamation')}
              className="w-full"
            >
              아이콘 없음
            </Button>
          </div>
        </section>

        {/* 사이즈 데모 */}
        <section className="mb-12">
          <h2 className="text-heading-md-css font-semibold text-foreground mb-6">
            Modal Sizes
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {(['xs', 'sm', 'base', 'l', 'xl', 'full'] as const).map((size) => (
              <Button
                key={size}
                size="sm"
                variant="outline"
                onClick={() => openModal(`size-${size}`)}
                className="w-full"
              >
                {size}
              </Button>
            ))}
          </div>
        </section>

        {/* 커스텀 컨텐츠 데모 */}
        <section className="mb-12">
          <h2 className="text-heading-md-css font-semibold text-foreground mb-6">
            Custom Content Modal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openModal('custom-form')}
              className="w-full"
            >
              커스텀 폼 모달
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openModal('custom-list')}
              className="w-full"
            >
              커스텀 리스트 모달
            </Button>
          </div>
        </section>

        {/* Structured Modal Examples */}
        <Modal
          isOpen={activeModal === 'delete-confirm'}
          onClose={closeModal}
          title="삭제 확인"
          content="정말로 이 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
          leftButtonText="취소"
          rightButtonText="삭제"
          onLeftButtonClick={closeModal}
          onRightButtonClick={() => {
            alert('삭제되었습니다!');
            closeModal();
          }}
        />

        <Modal
          isOpen={activeModal === 'save-confirm'}
          onClose={closeModal}
          title="저장 확인"
          content="변경사항을 저장하시겠습니까?"
          leftButtonText="취소"
          rightButtonText="저장"
          onLeftButtonClick={closeModal}
          onRightButtonClick={() => {
            alert('저장되었습니다!');
            closeModal();
          }}
        />

        <Modal
          isOpen={activeModal === 'warning'}
          onClose={closeModal}
          title="경고"
          content="시스템에 문제가 발생했습니다. 나중에 다시 시도해주세요."
          rightButtonText="확인"
          onRightButtonClick={closeModal}
        />

        {/* Modal Header Control Examples */}
        <Modal
          isOpen={activeModal === 'title-only'}
          onClose={closeModal}
          showTitle={true}
          showCloseButton={false}
          title="타이틀만 있는 모달"
          content="이 모달은 타이틀은 표시하지만 닫기 버튼은 숨겨져 있습니다. 배경 클릭이나 ESC 키로 닫을 수 있습니다."
          rightButtonText="확인"
          onRightButtonClick={closeModal}
        />

        <Modal
          isOpen={activeModal === 'close-only'}
          onClose={closeModal}
          showTitle={false}
          showCloseButton={true}
          title="이 타이틀은 보이지 않습니다"
          content="이 모달은 닫기 버튼만 표시하고 타이틀은 숨겨져 있습니다."
          rightButtonText="확인"
          onRightButtonClick={closeModal}
        />

        <Modal
          isOpen={activeModal === 'no-header'}
          onClose={closeModal}
          showTitle={false}
          showCloseButton={false}
          title="이 타이틀은 보이지 않습니다"
          content="이 모달은 헤더가 완전히 숨겨져 있습니다. 버튼이나 배경 클릭, ESC 키로만 닫을 수 있습니다."
          rightButtonText="확인"
          onRightButtonClick={closeModal}
        />

        <Modal
          isOpen={activeModal === 'full-header'}
          onClose={closeModal}
          showTitle={true}
          showCloseButton={true}
          title="전체 헤더 모달"
          content="이 모달은 타이틀과 닫기 버튼을 모두 표시합니다. (기본 설정)"
          leftButtonText="취소"
          rightButtonText="확인"
          onLeftButtonClick={closeModal}
          onRightButtonClick={closeModal}
        />

        {/* Modal Body Control Examples */}
        <Modal
          isOpen={activeModal === 'with-exclamation'}
          onClose={closeModal}
          title="아이콘이 있는 모달"
          showExclamation={true}
          content="이 모달은 exclamation 아이콘을 표시합니다. (기본 설정)"
          rightButtonText="확인"
          onRightButtonClick={closeModal}
        />

        <Modal
          isOpen={activeModal === 'without-exclamation'}
          onClose={closeModal}
          title="아이콘이 없는 모달"
          showExclamation={false}
          content="이 모달은 exclamation 아이콘을 숨깁니다. 텍스트만 표시됩니다."
          rightButtonText="확인"
          onRightButtonClick={closeModal}
        />

        {/* Size Modals with structured content */}
        {(['xs', 'sm', 'base', 'l', 'xl', 'full'] as const).map((size) => (
          <Modal
            key={`size-${size}`}
            isOpen={activeModal === `size-${size}`}
            onClose={closeModal}
            size={size}
            title={`${size.toUpperCase()} 모달`}
            content={`이것은 ${size} 사이즈 모달입니다. 최소 사이즈 343px × 230px가 적용되어 있습니다.`}
            leftButtonText="취소"
            rightButtonText="확인"
            onLeftButtonClick={closeModal}
            onRightButtonClick={closeModal}
          />
        ))}

        {/* Custom Content Modals */}
        <Modal
          isOpen={activeModal === 'custom-form'}
          onClose={closeModal}
          title="새 항목 추가"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-label-sm-css font-medium text-card-foreground">제목</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-card text-card-foreground"
                placeholder="제목을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <label className="text-label-sm-css font-medium text-card-foreground">설명</label>
              <textarea 
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-card text-card-foreground"
                rows={3}
                placeholder="설명을 입력하세요"
              />
            </div>
                         <div className="flex gap-2 justify-center pt-2">
               <Button
                 size="sm"
                 variant="outline"
                 onClick={closeModal}
               >
                 취소
               </Button>
               <Button
                 size="sm"
                 variant="primary"
                 onClick={closeModal}
               >
                 저장
               </Button>
             </div>
          </div>
        </Modal>

        <Modal
          isOpen={activeModal === 'custom-list'}
          onClose={closeModal}
          title="옵션 선택"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              {['옵션 1', '옵션 2', '옵션 3', '옵션 4'].map((option, index) => (
                <label key={index} className="flex items-center space-x-3 p-2 hover:bg-muted rounded cursor-pointer">
                  <input 
                    type="radio" 
                    name="option" 
                    className="text-primary"
                  />
                  <span className="text-body-sm-css text-card-foreground">{option}</span>
                </label>
              ))}
            </div>
                         <div className="flex gap-2 justify-center pt-2">
               <Button
                 size="sm"
                 variant="outline"
                 onClick={closeModal}
               >
                 취소
               </Button>
               <Button
                 size="sm"
                 variant="primary"
                 onClick={closeModal}
               >
                 선택
               </Button>
             </div>
          </div>
        </Modal>
      </div>
    </Container>
  );
} 