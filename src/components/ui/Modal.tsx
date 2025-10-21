'use client';

import React, { useEffect } from 'react';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'l' | 'xl' | 'full';
  variant?: 'default' | 'centered' | 'drawer';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  // Modal Header 제어
  showTitle?: boolean;
  title?: string;
  // Modal Body & Footer
  showExclamation?: boolean;
  content?: string;
  leftButtonText?: string;
  rightButtonText?: string;
  onLeftButtonClick?: () => void;
  onRightButtonClick?: () => void;
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
    showTitle = true,
    title,
    showExclamation = true,
    content,
    leftButtonText,
    rightButtonText,
    onLeftButtonClick,
    onRightButtonClick,
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

    // 사이즈별 클래스 (최소 사이즈 343px×230px 적용)
    const sizeClasses = {
      xs: 'w-[343px] max-w-xs',
      sm: 'w-full max-w-sm',
      base: 'w-full max-w-md',
      l: 'w-full max-w-lg',
      xl: 'w-full max-w-xl',
      full: 'w-full max-w-full mx-4'
    };

    // Variant별 클래스
    const variantClasses = {
      default: 'fixed inset-0 z-50 flex items-center justify-center p-4',
      centered: 'fixed inset-0 z-50 flex items-center justify-center p-4',
      drawer: 'fixed inset-0 z-50 flex items-end justify-center'
    };

    // 모달 콘텐츠 클래스 (가로 최소 사이즈만 적용, 세로는 컨텐츠에 맞춰 자동 조절)
    const contentClasses = {
      default: 'bg-card border border-border rounded-lg shadow-lg min-w-[343px]',
      centered: 'bg-card border border-border rounded-lg shadow-lg min-w-[343px]',
      drawer: 'bg-card border-t border-border rounded-t-lg shadow-lg w-full max-h-[80vh] min-w-[343px]'
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onClose();
      }
    };

    // 기본 왼쪽/오른쪽 버튼 핸들러
    const handleLeftButton = () => {
      if (onLeftButtonClick) {
        onLeftButtonClick();
      } else {
        onClose();
      }
    };

    const handleRightButton = () => {
      if (onRightButtonClick) {
        onRightButtonClick();
      } else {
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
          <div className={`${((showTitle && title) || showCloseButton) ? 'pt-4' : 'pt-8'} pr-4 pb-7 pl-4 space-y-6`}>
            
            {/* Modal Header */}
            {((showTitle && title) || showCloseButton) && (
              <div className={`flex items-center ${(showTitle && title) ? 'justify-between' : 'justify-end'}`}>
                {showTitle && title && (
                  <h2 className="text-heading-md-css font-semibold text-card-foreground">
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

            {/* Modal Body */}
            {(content || children) && (
              <div className="flex flex-col items-center space-y-4">
                {/* Exclamation Icon */}
                {showExclamation && (
                  <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center">
                    <svg 
                      className="w-6 h-6 text-white" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM12 7a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1zm0 8a1 1 0 100 2 1 1 0 000-2z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </div>
                )}
                
                {/* Content */}
                {content && (
                  <div className="text-center">
                    <p className="text-body-md-css text-card-foreground">
                      {content}
                    </p>
                  </div>
                )}
                
                {/* Custom children content */}
                {children && !content && (
                  <div className="text-center">
                    {children}
                  </div>
                )}
              </div>
            )}

            {/* Modal Footer */}
            {(leftButtonText || rightButtonText) && (
              <div className="flex gap-2 justify-center">
                {leftButtonText && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleLeftButton}
                  >
                    {leftButtonText}
                  </Button>
                )}
                {rightButtonText && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleRightButton}
                  >
                    {rightButtonText}
                  </Button>
                )}
              </div>
            )}

            {/* Custom children when no structured content */}
            {!content && !leftButtonText && !rightButtonText && children && (
              <div>
                {children}
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

export { Modal }; 