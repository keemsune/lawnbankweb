'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from './Button';
import { Menu, X, Phone, MessageSquare, MessageSquareMore, ClipboardCheck } from 'lucide-react';

interface FABMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface FloatingActionButtonProps {
  menuItems?: FABMenuItem[];
  className?: string;
}

const defaultMenuItems: FABMenuItem[] = [
  {
    id: 'call',
    label: '전화상담',
    icon: <Phone size={20} />,
    onClick: () => window.location.href = 'tel:1800-5495'
  },
  {
    id: 'chat',
    label: '카톡상담',
    icon: <MessageSquareMore size={20} />,
    onClick: () => window.open('https://pf.kakao.com/_AeGxoxl', '_blank')
  },
  {
    id: 'diagnosis',
    label: '자가진단',
    icon: <ClipboardCheck size={20} />,
    onClick: () => window.location.href = '/diagnosis/test'
  }
];

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  menuItems = defaultMenuItems,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const pathname = usePathname();

  // 화면 크기 감지
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    // 초기 실행
    checkScreenSize();

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);
  
  // 자가진단 테스트 페이지에서는 FAB 숨김
  if (pathname === '/diagnosis/test') {
    return null;
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (item: FABMenuItem) => {
    item.onClick();
    setIsOpen(false);
  };

  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  // 반응형 위치 계산
  const getMenuItemBottom = (index: number) => {
    // 하단고정바가 숨겨지는 페이지에서는 원래 위치 유지
    if (pathname === '/diagnosis/test' || pathname === '/diagnosis') {
      if (isDesktop) {
        return `${134 + (index * 66)}px`;
      } else {
        return `${94 + (index * 66)}px`;
      }
    }
    
    if (isDesktop) {
      // 데스크톱: 하단고정바 높이(80px) + 여백(24px) + FAB height(54px) + space-4(16px) = 174px
      return `${174 + (index * 66)}px`;
    } else {
      // 모바일: 하단고정바 높이(72px) + 여백(16px) + FAB height(54px) + space-4(16px) = 158px
      return `${158 + (index * 66)}px`;
    }
  };

  const getMenuButtonRight = () => {
    if (isDesktop) {
      return '130px'; // 기존 데스크톱 위치
    } else {
      return '18px'; // 모바일: right-4(16px) + 2px(center alignment)
    }
  };

  const getMenuLabelRight = () => {
    if (isDesktop) {
      return '192px'; // 기존 데스크톱 위치
    } else {
      return '80px'; // 모바일: right-4(16px) + button width(50px) + gap(12px) + 2px
    }
  };

  // FAB 메인 버튼 위치 계산
  const getFABBottom = () => {
    // 하단고정바가 숨겨지는 페이지에서는 원래 위치 유지
    if (pathname === '/diagnosis/test' || pathname === '/diagnosis') {
      return isDesktop ? 'bottom-16' : 'bottom-6';
    }
    
    if (isDesktop) {
      // 데스크톱: 하단고정바 높이(80px) + 여백(24px) = 104px
      return 'bottom-[104px]';
    } else {
      // 모바일: 하단고정바 높이(72px) + 여백(16px) = 88px
      return 'bottom-[88px]';
    }
  };



  return (
    <>
      {/* 배경 오버레이 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={handleOverlayClick}
        />
      )}

      {/* 메뉴 아이템들 */}
      {menuItems.map((item, index) => (
        <div key={item.id}>
          {/* 메뉴 라벨 */}
          <div 
            className={`fixed z-[60] flex items-center transition-all duration-300 ${
              isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
            style={{
              bottom: getMenuItemBottom(index),
              right: getMenuLabelRight(),
              height: '50px',
              transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
            }}
          >
            <span className="text-heading-md text-white whitespace-nowrap">
              {item.label}
            </span>
          </div>
          
          {/* 메뉴 버튼 - FAB와 정확히 같은 위치 */}
          <div 
            className={`fixed z-[60] transition-all duration-300 ${
              isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
            style={{
              bottom: getMenuItemBottom(index),
              right: getMenuButtonRight(),
              transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
            }}
          >
            <Button
              iconOnly
              size="l"
              colorVariant="white"
              styleVariant="fill"
              leftIcon={item.icon}
              onClick={() => handleMenuItemClick(item)}
              className="shadow-lg hover:shadow-xl transition-shadow duration-200 [&:focus]:!outline-none [&:focus]:!ring-0 [&:focus]:!ring-offset-0 [&:focus]:!shadow-none"
            >
              {""}
            </Button>
          </div>
        </div>
      ))}

      {/* FAB 메인 버튼 - 동적 위치 */}
      <div className={`fixed right-4 md:right-32 z-50 ${getFABBottom()}`}>
        {/* 메인 FAB 버튼 */}
        <Button
          iconOnly
          size="xl"
          colorVariant={isOpen ? "default" : "default"}
          styleVariant="fill"
          variant={isOpen ? "destructive" : "primary"}
          leftIcon={
            <div className="transition-all duration-300">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </div>
          }
          onClick={toggleMenu}
          className="shadow-2xl hover:shadow-2xl transition-all duration-200 [&:focus]:!outline-none [&:focus]:!ring-0 [&:focus]:!ring-offset-0 [&:focus]:!shadow-none"
        >
          {""}
        </Button>
      </div>
    </>
  );
};

export default FloatingActionButton;
