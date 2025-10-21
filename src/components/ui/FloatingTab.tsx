"use client"

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface TabItem {
  id: string
  label: string
  targetIds: string[]
}

interface FloatingTabProps {
  tabs: TabItem[]
  className?: string
}

export function FloatingTab({ tabs, className }: FloatingTabProps) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id || '')
  const [isVisible, setIsVisible] = useState(false)
  const [topOffset, setTopOffset] = useState<number>(() => {
    // 초기값을 즉시 계산하여 설정
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 769 : false
    return isMobile ? 16 : 24
  })
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // 헤더 높이 + 반응형 간격 계산
    function updateTopOffset() {
      const header = document.getElementById('app-header')
      const isMobile = window.innerWidth < 769
      const spacing = isMobile ? 16 : 24 // 모바일: space-4(16px), 데스크톱: space-6(24px)
      
      if (header) {
        setTopOffset(header.offsetHeight + spacing)
      } else {
        setTopOffset(spacing)
      }
    }
    updateTopOffset()
    window.addEventListener('resize', updateTopOffset)
    return () => {
      window.removeEventListener('resize', updateTopOffset)
    }
  }, [])

  useEffect(() => {
    // 모든 관찰 대상 섹션 id 수집
    const allSectionIds = tabs.flatMap(tab => tab.targetIds)
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleIds = entries.filter(e => e.isIntersecting).map(e => e.target.id)
        // 우선순위: 뒤쪽 탭이 보이면 그 탭, 아니면 앞쪽 탭
        for (let i = tabs.length - 1; i >= 0; i--) {
          if (tabs[i].targetIds.some(id => visibleIds.includes(id))) {
            setActiveTab(tabs[i].id)
            return
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '-10% 0px -60% 0px'
      }
    )
    observerRef.current = observer
    allSectionIds.forEach(id => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    const handleScroll = () => {
      const scrollY = window.scrollY
      // 스크롤이 200px 이상일 때만 표시 (더 명확한 스크롤 감지)
      setIsVisible(scrollY > 200)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [tabs])

  const handleTabClick = (tabId: string, targetIds: string[]) => {
    setActiveTab(tabId)
    const element = document.getElementById(targetIds[0])
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div
      style={{ top: topOffset, left: '50%', transform: 'translateX(-50%)' }}
      className={cn(
        "fixed z-50",
        "bg-card border border-border rounded-full shadow-xl",
        "px-3 py-2",
        "flex gap-0",
        "transition-all duration-300 ease-in-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id, tab.targetIds)}
          className={
            [
              "px-4 py-1 rounded-full transition-all duration-200 text-heading-sm-css md:text-heading-lg-css whitespace-nowrap",
              activeTab === tab.id
                ? "bg-accent text-accent-foreground"
                : "bg-white text-foreground"
            ].join(' ')
          }
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
} 