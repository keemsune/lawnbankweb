import React from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  size?: 'full' | 'content'
  padding?: boolean
}

export function Container({ 
  children, 
  className, 
  size = 'content',
  padding = true,
  ...props 
}: ContainerProps) {
  return (
    <div
      className={cn(
        // 기본 컨테이너 스타일
        'w-full mx-auto',
        
        // 사이즈별 최대 너비
        size === 'content' && 'max-w-content',
        size === 'full' && 'max-w-full',
        
        // 반응형 패딩 (우리 브레이크포인트 시스템에 맞춤)
        padding && [
          'px-container-xs',      // 375px: 16px
          'sm:px-container-sm',   // 768px: 24px (수정됨)
          'md:px-container-md',   // 1024px: 32px
          'lg:px-container-lg',   // 1280px: 40px
        ],
        
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  columns?: 'mobile' | 'tablet' | 'desktop' | 'responsive'
  gap?: 'mobile' | 'tablet' | 'desktop' | 'responsive'
}

export function Grid({ 
  children, 
  className, 
  columns = 'responsive',
  gap = 'responsive',
  ...props 
}: GridProps) {
  return (
    <div
      className={cn(
        'grid',
        
        // 컬럼 설정
        columns === 'mobile' && 'grid-cols-mobile',
        columns === 'tablet' && 'grid-cols-tablet', 
        columns === 'desktop' && 'grid-cols-desktop',
        columns === 'responsive' && [
          'grid-cols-mobile',      // 375px: 4컬럼
          'sm:grid-cols-tablet',   // 768px: 8컬럼
          'md:grid-cols-desktop',  // 1024px+: 12컬럼
        ],
        
        // 거터 설정
        gap === 'mobile' && 'gap-mobile',
        gap === 'tablet' && 'gap-tablet',
        gap === 'desktop' && 'gap-desktop', 
        gap === 'responsive' && [
          'gap-mobile',          // 375px: 16px
          'sm:gap-tablet',       // 768px: 24px
          'md:gap-desktop',      // 1024px+: 24px
        ],
        
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  span?: number | { xs?: number; sm?: number; md?: number; lg?: number }
}

export function GridItem({ 
  children, 
  className, 
  span = 1,
  ...props 
}: GridItemProps) {
  const getSpanClasses = () => {
    if (typeof span === 'number') {
      return `col-span-${span}`
    }
    
    const classes = []
    if (span.xs) classes.push(`col-span-${span.xs}`)
    if (span.sm) classes.push(`sm:col-span-${span.sm}`)
    if (span.md) classes.push(`md:col-span-${span.md}`)
    if (span.lg) classes.push(`lg:col-span-${span.lg}`)
    
    return classes.join(' ')
  }
  
  return (
    <div
      className={cn(
        getSpanClasses(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
} 