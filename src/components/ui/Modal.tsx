'use client';

import React, { useEffect } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'l' | 'xl' | 'full';
  variant?: 'default' | 'centered' | 'drawer';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  title?: string;
  className?: string;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({
    isOpen,
    onClose,
    children,
    size = 'base',
    variant = 'default',
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    title,
    className = '',
    ...props
  }, ref) => {

    // ESC 키로 모달 닫기
    useEffect(() => {
      if (!closeOnEscape || !isOpen) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeOnEscape, onClose]);

    // 모달이 열릴 때 body 스크롤 방지
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }

      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]);

    if (!isOpen) return null;

    // 사이즈별 클래스
    const sizeClasses = {
      xs: 'max-w-xs',
      sm: 'max-w-sm',
      base: 'max-w-md',
      l: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'max-w-full mx-4'
    };

    // Variant별 클래스
    const variantClasses = {
      default: 'fixed inset-0 z-50 flex items-center justify-center p-4',
      centered: 'fixed inset-0 z-50 flex items-center justify-center p-4',
      drawer: 'fixed inset-0 z-50 flex items-end justify-center'
    };

    // 모달 콘텐츠 클래스
    const contentClasses = {
      default: 'bg-background border border-border rounded-lg shadow-lg',
      centered: 'bg-background border border-border rounded-lg shadow-lg',
      drawer: 'bg-background border-t border-border rounded-t-lg shadow-lg w-full max-h-[80vh]'
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onClose();
      }
    };

    return (
      <div
        className={variantClasses[variant]}
        onClick={handleOverlayClick}
        ref={ref}
        {...props}
      >
        {/* 배경 오버레이 */}
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        
        {/* 모달 콘텐츠 */}
        <div className={`relative ${sizeClasses[size]} ${contentClasses[variant]} ${className}`}>
          {/* 헤더 (타이틀이나 닫기 버튼이 있을 때) */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-border">
              {title && (
                <h2 className="text-label-lg-css font-semibold text-foreground">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
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
              )}
            </div>
          )}
          
          {/* 모달 본문 */}
          <div className={`${(title || showCloseButton) ? 'p-6' : 'p-6'}`}>
            {children}
          </div>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

export { Modal }; 