import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'destructive';
  size?: 'xs' | 'sm' | 'base' | 'l' | 'xl';
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'base', 
    children, 
    leftIcon, 
    rightIcon, 
    isLoading = false, 
    fullWidth = false, 
    disabled, 
    ...props 
  }, ref) => {
    
    // 사이즈별 스타일
    const sizeVariants = {
      xs: {
        padding: 'py-4 px-2',
        typography: 'text-label-xs-css',
        height: 'h-[34px]',
        iconSize: 'w-4 h-4',
        gap: 'gap-2'
      },
      sm: {
        padding: 'py-4 px-2',
        typography: 'text-label-sm-css',
        height: 'h-[36px]',
        iconSize: 'w-4 h-4',
        gap: 'gap-2'
      },
      base: {
        padding: 'py-5 px-2.5',
        typography: 'text-label-sm-css',
        height: 'h-[40px]',
        iconSize: 'w-5 h-5',
        gap: 'gap-2'
      },
      l: {
        padding: 'py-5 px-3',
        typography: 'text-label-md-css',
        height: 'h-[48px]',
        iconSize: 'w-6 h-6',
        gap: 'gap-2'
      },
      xl: {
        padding: 'py-6 px-3.5',
        typography: 'text-label-md-css',
        height: 'h-[52px]',
        iconSize: 'w-6 h-6',
        gap: 'gap-2'
      }
    };

    // variant별 스타일
    const variantStyles = {
      primary: {
        default: 'bg-primary text-primary-foreground border-primary',
        hover: 'hover:bg-emerald-700 hover:border-emerald-700',
        active: 'active:bg-emerald-800 active:border-emerald-800',
        disabled: 'disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300'
      },
      secondary: {
        default: 'bg-secondary text-secondary-foreground border-secondary',
        hover: 'hover:bg-amber-600 hover:border-amber-600',
        active: 'active:bg-amber-700 active:border-amber-700',
        disabled: 'disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300'
      },
      tertiary: {
        default: 'bg-tertiary text-tertiary-foreground border-tertiary',
        hover: 'hover:bg-blue-600 hover:border-blue-600',
        active: 'active:bg-blue-700 active:border-blue-700',
        disabled: 'disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300'
      },
      outline: {
        default: 'bg-transparent text-primary border-primary border-2',
        hover: 'hover:bg-primary hover:text-primary-foreground',
        active: 'active:bg-emerald-700 active:border-emerald-700 active:text-primary-foreground',
        disabled: 'disabled:bg-transparent disabled:text-gray-400 disabled:border-gray-300'
      },
      ghost: {
        default: 'bg-transparent text-primary border-transparent',
        hover: 'hover:bg-emerald-50 hover:text-emerald-700',
        active: 'active:bg-emerald-100 active:text-emerald-800',
        disabled: 'disabled:bg-transparent disabled:text-gray-400'
      },
      destructive: {
        default: 'bg-destructive text-destructive-foreground border-destructive',
        hover: 'hover:bg-red-600 hover:border-red-600',
        active: 'active:bg-red-700 active:border-red-700',
        disabled: 'disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300'
      }
    };

    const currentSize = sizeVariants[size];
    const currentVariant = variantStyles[variant];

    return (
      <button
        className={cn(
          // 기본 스타일
          'inline-flex items-center justify-center',
          'rounded-full border transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'select-none',
          
          // 사이즈별 스타일
          currentSize.padding,
          currentSize.typography,
          currentSize.height,
          currentSize.gap,
          
          // variant별 스타일
          currentVariant.default,
          currentVariant.hover,
          currentVariant.active,
          currentVariant.disabled,
          
          // 전체 너비 옵션
          fullWidth && 'w-full',
          
          // 로딩 상태
          isLoading && 'cursor-wait',
          
          // 비활성화 상태
          (disabled || isLoading) && 'cursor-not-allowed',
          
          className
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {/* 로딩 스피너 */}
        {isLoading && (
          <svg 
            className={cn('animate-spin', currentSize.iconSize, 'mr-2')} 
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
        
        {/* 왼쪽 아이콘 */}
        {leftIcon && !isLoading && (
          <span className={cn(currentSize.iconSize, 'flex-shrink-0')}>
            {leftIcon}
          </span>
        )}
        
        {/* 버튼 텍스트 */}
        <span className="flex-1">
          {children}
        </span>
        
        {/* 오른쪽 아이콘 */}
        {rightIcon && !isLoading && (
          <span className={cn(currentSize.iconSize, 'flex-shrink-0')}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button }; 