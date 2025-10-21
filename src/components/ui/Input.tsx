import React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  // 기본 props
  size?: 'xs' | 'sm' | 'base' | 'l' | 'xl';
  variant?: 'default' | 'destructive';
  
  // 스타일 관련
  fullWidth?: boolean;
  
  // 아이콘 관련
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // 라벨 및 메시지
  label?: string;
  helperText?: string;
  errorMessage?: string;
  
  // 상태
  isLoading?: boolean;
  hasError?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className = '', 
    size = 'base',
    variant = 'default',
    fullWidth = false,
    leftIcon,
    rightIcon,
    label,
    helperText,
    errorMessage,
    isLoading = false,
    hasError = false,
    disabled,
    id,
    ...props 
  }, ref) => {
    
    // 에러 상태는 hasError prop 또는 errorMessage 존재 여부로 결정
    const isError = hasError || !!errorMessage;
    
    // 실제 variant 결정 (에러가 있으면 destructive)
    const finalVariant = isError ? 'destructive' : variant;
    
    // 고유 ID 생성 (label과 연결용)
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    // 기본 클래스
    const baseClasses = 'border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 bg-background text-foreground placeholder:text-muted-foreground';
    
    // 사이즈별 클래스 (패딩, 폰트 크기)
    const sizeClasses = {
      xs: 'py-1.5 px-3 text-body-xs-css min-h-[32px]',
      sm: 'py-2 px-3 text-body-sm-css min-h-[36px]',
      base: 'py-2.5 px-4 text-body-md-css min-h-[40px]',
      l: 'py-3 px-4 text-body-lg-css min-h-[48px]',
      xl: 'py-3.5 px-5 text-body-xl-css min-h-[52px]'
    };
    
    // 아이콘이 있을 때 패딩 조정
    const iconPadding = {
      xs: leftIcon ? 'pl-9' : rightIcon ? 'pr-9' : '',
      sm: leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '',
      base: leftIcon ? 'pl-11' : rightIcon ? 'pr-11' : '',
      l: leftIcon ? 'pl-12' : rightIcon ? 'pr-12' : '',
      xl: leftIcon ? 'pl-14' : rightIcon ? 'pr-14' : ''
    };
    
    // Variant별 색상 스타일
    const variantStyles = {
      default: {
        default: 'border-border',
        hover: 'hover:border-gray-400',
        focus: 'focus:border-primary focus:ring-primary/20',
        disabled: 'disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:border-border'
      },
      destructive: {
        default: 'border-destructive',
        hover: 'hover:border-red-700',
        focus: 'focus:border-destructive focus:ring-destructive/20',
        disabled: 'disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:border-border'
      }
    };
    
    // 아이콘 크기
    const iconSizes = {
      xs: 'w-4 h-4',
      sm: 'w-4 h-4',
      base: 'w-5 h-5',
      l: 'w-5 h-5',
      xl: 'w-6 h-6'
    };
    
    // 아이콘 위치
    const iconPositions = {
      xs: { left: 'left-2.5', right: 'right-2.5' },
      sm: { left: 'left-3', right: 'right-3' },
      base: { left: 'left-3', right: 'right-3' },
      l: { left: 'left-4', right: 'right-4' },
      xl: { left: 'left-4', right: 'right-4' }
    };
    
    const currentVariantStyles = variantStyles[finalVariant];
    const currentSizeClasses = sizeClasses[size];
    const currentIconPadding = iconPadding[size];
    
    const allClasses = [
      baseClasses,
      currentSizeClasses,
      currentIconPadding,
      currentVariantStyles.default,
      currentVariantStyles.hover,
      currentVariantStyles.focus,
      currentVariantStyles.disabled,
      fullWidth && 'w-full',
      disabled && 'cursor-not-allowed',
      className
    ].filter(Boolean).join(' ');
    
    // 라벨 크기 (input 크기에 맞춤)
    const labelSizes = {
      xs: 'text-label-xs-css',
      sm: 'text-label-sm-css',
      base: 'text-label-sm-css',
      l: 'text-label-md-css',
      xl: 'text-label-lg-css'
    };
    
    // 도움말/에러 메시지 크기
    const messageSizes = {
      xs: 'text-caption-sm-css',
      sm: 'text-caption-md-css',
      base: 'text-caption-md-css',
      l: 'text-caption-lg-css',
      xl: 'text-caption-lg-css'
    };

    return (
      <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
        {/* 라벨 */}
        {label && (
          <label 
            htmlFor={inputId}
            className={`${labelSizes[size]} font-medium ${isError ? 'text-destructive' : 'text-foreground'} ${disabled ? 'text-muted-foreground' : ''}`}
          >
            {label}
          </label>
        )}
        
        {/* Input 컨테이너 */}
        <div className="relative">
          {/* 왼쪽 아이콘 */}
          {leftIcon && !isLoading && (
            <div className={`absolute ${iconPositions[size].left} top-1/2 transform -translate-y-1/2 ${iconSizes[size]} flex items-center justify-center ${isError ? 'text-destructive' : 'text-muted-foreground'} ${disabled ? 'text-muted-foreground' : ''}`}>
              {leftIcon}
            </div>
          )}
          
          {/* 로딩 스피너 (왼쪽 아이콘 위치) */}
          {isLoading && (
            <div className={`absolute ${iconPositions[size].left} top-1/2 transform -translate-y-1/2 ${iconSizes[size]} flex items-center justify-center`}>
              <svg 
                className={`animate-spin ${iconSizes[size]} text-muted-foreground`} 
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
          )}
          
          {/* Input 요소 */}
          <input
            id={inputId}
            className={allClasses}
            disabled={disabled || isLoading}
            ref={ref}
            {...props}
          />
          
          {/* 오른쪽 아이콘 */}
          {rightIcon && !isLoading && (
            <div className={`absolute ${iconPositions[size].right} top-1/2 transform -translate-y-1/2 ${iconSizes[size]} flex items-center justify-center ${isError ? 'text-destructive' : 'text-muted-foreground'} ${disabled ? 'text-muted-foreground' : ''}`}>
              {rightIcon}
            </div>
          )}
        </div>
        
        {/* 도움말 또는 에러 메시지 */}
        {(helperText || errorMessage) && (
          <p className={`${messageSizes[size]} ${isError ? 'text-destructive' : 'text-muted-foreground'}`}>
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };