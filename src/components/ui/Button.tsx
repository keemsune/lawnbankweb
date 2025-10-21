import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  colorVariant?: 'default' | 'white' | 'alternative';
  styleVariant?: 'fill' | 'outline';
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'outline'; // 기존 호환성을 위해 유지
  size?: 'xs' | 'sm' | 'base' | 'l' | 'xl';
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  // Boolean variants for icon display
  iconOnly?: boolean;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className = '', 
    colorVariant = 'default',
    styleVariant = 'fill',
    variant, // 기존 호환성을 위해 유지
    size = 'base', 
    children, 
    leftIcon, 
    rightIcon, 
    isLoading = false, 
    fullWidth = false, 
    disabled,
    // Boolean variants
    iconOnly = false,
    showLeftIcon = true,
    showRightIcon = true,
    ...props 
  }, ref) => {
    
    // 기존 variant prop이 있으면 새로운 시스템으로 변환
    let finalColorVariant = colorVariant;
    let finalStyleVariant = styleVariant;
    
    if (variant) {
      finalColorVariant = 'default';
      if (variant === 'outline') {
        finalStyleVariant = 'outline';
        // outline variant는 primary 색상 사용
        variant = 'primary';
      } else {
        finalStyleVariant = 'fill';
      }
    }
    
    // 기본 클래스
    const baseClasses = 'inline-flex items-center justify-center rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 select-none';
    
    // 사이즈별 클래스 (정확한 spacing 토큰 사용)
    const sizeClasses = {
      xs: 'py-2 px-4 text-label-xs-css min-h-[34px]',
      sm: 'py-2 px-4 text-label-sm-css min-h-[36px]',
      base: 'py-2.5 px-5 text-label-sm-css min-h-[40px]',
      l: 'py-3 px-5 text-label-md-css min-h-[48px]',
      xl: 'py-3.5 px-6 text-label-md-css min-h-[52px]'
    };

    // iconOnly일 때 사이즈별 클래스 (정사각형 형태)
    const iconOnlySizeClasses = {
      xs: 'p-2 text-label-xs-css min-h-[34px] min-w-[34px]',
      sm: 'p-2 text-label-sm-css min-h-[36px] min-w-[36px]',
      base: 'p-2.5 text-label-sm-css min-h-[40px] min-w-[40px]',
      l: 'p-3 text-label-md-css min-h-[48px] min-w-[48px]',
      xl: 'p-3.5 text-label-md-css min-h-[52px] min-w-[52px]'
    };

    // Color Variant별 색상 정의
    const getColorStyles = () => {
      // Default Color Variant (기존 primary, secondary, tertiary, destructive)
      if (finalColorVariant === 'default') {
        const colorMap = {
          primary: {
            fill: {
              default: 'bg-primary text-primary-foreground border-primary',
              hover: 'hover:bg-emerald-800 hover:text-white hover:border-emerald-800',
              active: 'active:bg-emerald-800 active:text-white active:border-emerald-800',
              disabled: 'disabled:bg-muted disabled:text-gray-300 disabled:border-muted'
            },
            outline: {
              default: 'bg-transparent text-primary border-primary border-2',
              hover: 'hover:bg-primary hover:text-primary-foreground hover:border-primary',
              active: 'active:bg-emerald-700 active:text-white active:border-emerald-700',
              disabled: 'disabled:bg-muted disabled:text-gray-300 disabled:border-border'
            }
          },
          secondary: {
            fill: {
              default: 'bg-secondary text-secondary-foreground border-secondary',
              hover: 'hover:bg-amber-800 hover:text-white hover:border-amber-800',
              active: 'active:bg-amber-700 active:text-white active:border-amber-700',
              disabled: 'disabled:bg-muted disabled:text-gray-300 disabled:border-muted'
            },
            outline: {
              default: 'bg-transparent text-secondary border-secondary border-2',
              hover: 'hover:bg-secondary hover:text-secondary-foreground hover:border-secondary',
              active: 'active:bg-amber-700 active:text-white active:border-amber-700',
              disabled: 'disabled:bg-muted disabled:text-gray-300 disabled:border-border'
            }
          },
          tertiary: {
            fill: {
              default: 'bg-tertiary text-tertiary-foreground border-tertiary',
              hover: 'hover:bg-blue-800 hover:text-white hover:border-blue-800',
              active: 'active:bg-blue-700 active:text-white active:border-blue-700',
              disabled: 'disabled:bg-muted disabled:text-gray-300 disabled:border-muted'
            },
            outline: {
              default: 'bg-transparent text-tertiary border-tertiary border-2',
              hover: 'hover:bg-tertiary hover:text-tertiary-foreground hover:border-tertiary',
              active: 'active:bg-blue-700 active:text-white active:border-blue-700',
              disabled: 'disabled:bg-muted disabled:text-gray-300 disabled:border-border'
            }
          },
          destructive: {
            fill: {
              default: 'bg-destructive text-destructive-foreground border-destructive',
              hover: 'hover:bg-red-800 hover:text-white hover:border-red-800',
              active: 'active:bg-red-700 active:text-white active:border-red-700',
              disabled: 'disabled:bg-muted disabled:text-gray-300 disabled:border-muted'
            },
            outline: {
              default: 'bg-transparent text-destructive border-destructive border-2',
              hover: 'hover:bg-destructive hover:text-destructive-foreground hover:border-destructive',
              active: 'active:bg-red-700 active:text-white active:border-red-700',
              disabled: 'disabled:bg-muted disabled:text-gray-300 disabled:border-border'
            }
          }
        };
        
        const colorKey = variant || 'primary';
        return colorMap[colorKey]?.[finalStyleVariant] || colorMap.primary.fill;
      }
      
      // White Color Variant
      if (finalColorVariant === 'white') {
        return {
          // Default 상태: fill color background-1, 텍스트 컬러 primary
          default: 'bg-background text-primary border-background',
          // Hover 상태: fill color primary, 텍스트 컬러 primary-foreground
          hover: 'hover:bg-primary hover:text-primary-foreground hover:border-primary',
          // Active 상태
          active: 'active:bg-emerald-700 active:text-white active:border-emerald-700',
          // Disabled 상태
          disabled: 'disabled:bg-muted disabled:text-gray-300 disabled:border-muted'
        };
      }
      
      // Alternative Color Variant
      if (finalColorVariant === 'alternative') {
        return {
          // Default 상태: fill color background-1, 텍스트 컬러 foreground
          default: 'bg-background text-foreground border-border border-2',
          // Hover 상태: fill color muted, 텍스트 컬러 primary, border color border
          hover: 'hover:bg-muted hover:text-primary hover:border-border',
          // Active 상태
          active: 'active:bg-gray-200 active:text-primary active:border-border',
          // Disabled 상태
          disabled: 'disabled:bg-muted disabled:text-gray-300 disabled:border-border'
        };
      }
      
      // 기본값
      return {
        default: 'bg-primary text-primary-foreground border-primary',
        hover: 'hover:bg-emerald-800 hover:text-white hover:border-emerald-800',
        active: 'active:bg-emerald-800 active:text-white active:border-emerald-800',
        disabled: 'disabled:bg-muted disabled:text-gray-300 disabled:border-muted'
      };
    };

    // 아이콘 크기 (정확한 픽셀 값)
    const iconSizes = {
      xs: 'w-4 h-4',    // 16x16px
      sm: 'w-4 h-4',    // 16x16px
      base: 'w-5 h-5',  // 20x20px
      l: 'w-6 h-6',     // 24x24px
      xl: 'w-6 h-6'     // 24x24px
    };

    const colorStyles = getColorStyles();
    
    // iconOnly인 경우 다른 사이즈 클래스 사용
    const currentSizeClasses = iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size];
    
    const allClasses = [
      baseClasses,
      currentSizeClasses,
      typeof colorStyles === 'object' ? colorStyles.default : colorStyles,
      typeof colorStyles === 'object' ? colorStyles.hover : '',
      typeof colorStyles === 'object' ? colorStyles.active : '',
      typeof colorStyles === 'object' ? colorStyles.disabled : '',
      fullWidth && 'w-full',
      (disabled || isLoading) && 'cursor-not-allowed',
      className
    ].filter(Boolean).join(' ');

    // 아이콘 표시 로직
    const shouldShowLeftIcon = !iconOnly && showLeftIcon && leftIcon && !isLoading;
    const shouldShowRightIcon = !iconOnly && showRightIcon && rightIcon && !isLoading;
    const shouldShowIconOnly = iconOnly && (leftIcon || rightIcon) && !isLoading;

    return (
      <button
        className={allClasses}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {/* 로딩 스피너 */}
        {isLoading && (
          <svg 
            className={`animate-spin ${iconSizes[size]} ${!iconOnly ? 'mr-2' : ''}`} 
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
        )}
        
        {/* Icon Only 모드 */}
        {shouldShowIconOnly && (
          <span className={`${iconSizes[size]} flex-shrink-0 flex items-center justify-center`}>
            {leftIcon || rightIcon}
          </span>
        )}
        
        {/* 왼쪽 아이콘 */}
        {shouldShowLeftIcon && (
          <span className={`${iconSizes[size]} flex-shrink-0 mr-2 flex items-center justify-center`}>
            {leftIcon}
          </span>
        )}
        
        {/* 버튼 텍스트 */}
        {!iconOnly && (
          <span>
            {children}
          </span>
        )}
        
        {/* 오른쪽 아이콘 */}
        {shouldShowRightIcon && (
          <span className={`${iconSizes[size]} flex-shrink-0 ml-2 flex items-center justify-center`}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button }; 