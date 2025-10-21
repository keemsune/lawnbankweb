import React from 'react';
import Image from 'next/image';

export interface ReviewData {
  id: string;
  name: string;
  category: string;
  caseType: string;
  content: string;
  profileImage?: string;
}

interface ReviewCardProps {
  reviewData: ReviewData;
  className?: string;
}

export function ReviewCard({ reviewData, className = '' }: ReviewCardProps) {
  const { name, category, caseType, content, profileImage } = reviewData;
  
  return (
    <div className={`bg-card rounded-2xl p-6 shadow-lg flex flex-col gap-6 h-full ${className}`}>
      {/* 1단: 정보 (좌측 이미지 + 우측 텍스트) */}
      <div className="flex gap-3 items-center">
        {/* 좌측 이미지 */}
        <div className="w-12 h-12 flex-shrink-0">
          {profileImage ? (
            <Image
              src={profileImage}
              alt={`${name} 프로필`}
              width={48}
              height={48}
              className="w-full h-full object-contain drop-shadow-amber"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              👤
            </div>
          )}
        </div>
        
        {/* 우측 텍스트 */}
        <div className="flex flex-col gap-1 flex-1">
          {/* 상단: 분야 배지들 */}
          <div className="flex gap-2">
            {/* 사건분야 배지 */}
            <span className="px-3 py-1 bg-primary text-primary-foreground text-caption-xs-css rounded-full">
              {category}
            </span>
            
            {/* 유형 배지 */}
            <span className="px-3 py-1 bg-primary text-primary-foreground text-caption-xs-css rounded-full">
              {caseType}
            </span>
          </div>
          
          {/* 하단: 이름 */}
          <div>
            <span className="text-heading-lg-css text-primary">
              {name}
            </span>
          </div>
        </div>
      </div>
      
      {/* 2단: 후기내용 */}
      <div className="flex-1">
        <p className="text-body-sm-css text-card-foreground">
          {content}
        </p>
      </div>
    </div>
  );
} 