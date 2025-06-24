import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  hoverColor?: 'primary' | 'secondary' | 'tertiary'
  onClick?: () => void
  href?: string
}

export default function Card({ 
  children, 
  className = '', 
  hover = false,
  hoverColor = 'primary',
  onClick,
  href 
}: CardProps) {
  const baseStyles = 'p-6 text-left border border-border bg-card text-card-foreground rounded-xl transition-colors'
  
  const hoverStyles = hover ? {
    primary: 'hover:text-primary hover:border-primary focus:text-primary focus:border-primary',
    secondary: 'hover:text-secondary hover:border-secondary focus:text-secondary focus:border-secondary',
    tertiary: 'hover:text-tertiary hover:border-tertiary focus:text-tertiary focus:border-tertiary'
  }[hoverColor] : ''
  
  const finalClassName = `${baseStyles} ${hoverStyles} ${className}`
  
  if (href) {
    return (
      <a href={href} className={finalClassName}>
        {children}
      </a>
    )
  }
  
  if (onClick) {
    return (
      <div onClick={onClick} className={`${finalClassName} cursor-pointer`}>
        {children}
      </div>
    )
  }
  
  return (
    <div className={finalClassName}>
      {children}
    </div>
  )
} 