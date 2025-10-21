"use client"
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import React from 'react'
interface AccordionItem {
  id: string
  question: string
  answer: React.ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  className?: string
}

export function Accordion({ items, className }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (itemId: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId)
    } else {
      newOpenItems.add(itemId)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <div className={cn("space-y-3 md:space-y-4", className)}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id)
        return (
          <div
            key={item.id}
            className={cn(
              "overflow-hidden",
              isOpen
                ? "border border-border rounded-2xl bg-card"
                : "border border-border rounded-2xl bg-card"
            )}
          >
            <button
              onClick={() => toggleItem(item.id)}
              className={cn(
                "w-full px-4 py-3 md:px-6 md:py-5 text-left flex items-center justify-between transition-colors",
                isOpen ? "bg-accent" : "bg-card"
              )}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className={cn(
                  "w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center",
                  isOpen ? "bg-secondary" : "bg-primary"
                )}>
                  <span 
                    className={cn(
                      "text-[14px] md:text-[18px]",
                      isOpen ? "text-secondary-foreground" : "text-primary-foreground"
                    )}
                    style={{ 
                      fontFamily: 'RiaSans-ExtraBold',
                      fontWeight: 'lighter',
                      WebkitFontSmoothing: 'antialiased',
                      textRendering: 'optimizeLegibility'
                    }}
                  >
                    Q
                  </span>
                </div>
                <h3 className="text-heading-md-css md:text-heading-xl-css" style={{ color: isOpen ? 'var(--color-accent-foreground)' : 'var(--color-card-foreground)' }}>
                  {item.question}
                </h3>
              </div>
              <ChevronDown
                className={cn(
                  "w-6 h-6 transition-transform duration-200",
                  isOpen ? "rotate-180 text-accent-foreground" : "text-card-foreground"
                )}
              />
            </button>
            <div
              className={cn(
                "transition-all duration-200 ease-in-out",
                isOpen
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              )}
            >
              <div 
                className="text-label-s-css md:text-body-lg-css text-card-foreground p-4 md:px-6 md:pt-5 md:pb-5"
              >
                {item.answer}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
} 