import React from 'react';

export interface DemoBoxProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function DemoBox({ title, children, className = '' }: DemoBoxProps) {
  return (
    <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
      <h2 className="text-heading-lg-css font-bold text-foreground mb-6 border-b border-border pb-2">
        {title}
      </h2>
      <div className={className}>
        {children}
      </div>
    </div>
  )
} 