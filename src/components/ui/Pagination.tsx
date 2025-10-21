import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  size?: 'xs' | 'sm' | 'base' | 'l' | 'xl';
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  size = 'base',
  showFirstLast = true,
  maxVisiblePages = 7,
  className = ''
}) => {
  // 페이지 번호 배열 생성 로직
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= maxVisiblePages) {
      // 전체 페이지가 최대 표시 개수보다 적으면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 복잡한 경우: 처음, 마지막, 현재 페이지 주변을 고려
      const halfVisible = Math.floor(maxVisiblePages / 2);
      
      if (currentPage <= halfVisible + 1) {
        // 현재 페이지가 앞쪽에 있는 경우
        for (let i = 1; i <= maxVisiblePages - 2; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - halfVisible) {
        // 현재 페이지가 뒤쪽에 있는 경우
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - (maxVisiblePages - 3); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 현재 페이지가 중간에 있는 경우
        pages.push(1);
        pages.push('ellipsis');
        
        for (let i = currentPage - halfVisible + 1; i <= currentPage + halfVisible - 1; i++) {
          pages.push(i);
        }
        
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // 사이즈별 클래스 (Button 컴포넌트와 동일)
  const sizeClasses = {
    xs: 'py-2 px-3 text-label-xs-css gap-1 min-h-[34px]',
    sm: 'py-2 px-3 text-label-sm-css gap-1 min-h-[36px]',
    base: 'py-2.5 px-4 text-label-sm-css gap-1 min-h-[40px]',
    l: 'py-3 px-4 text-label-md-css gap-1 min-h-[48px]',
    xl: 'py-3.5 px-5 text-label-md-css gap-1 min-h-[52px]'
  };

  // 아이콘 사이즈 (Button 컴포넌트와 동일)
  const iconSizes = {
    xs: 'w-4 h-4',
    sm: 'w-4 h-4',
    base: 'w-5 h-5',
    l: 'w-6 h-6',
    xl: 'w-6 h-6'
  };

  // 기본 버튼 클래스
  const baseButtonClasses = 'inline-flex items-center justify-center rounded-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 select-none';

  // 일반 페이지 버튼 스타일
  const pageButtonClasses = `${baseButtonClasses} ${sizeClasses[size]} bg-background text-foreground border-border hover:bg-muted hover:text-primary hover:border-border active:bg-gray-200 active:text-primary active:border-border disabled:bg-muted disabled:text-gray-300 disabled:border-border disabled:cursor-not-allowed`;

  // 현재 페이지 버튼 스타일
  const currentPageButtonClasses = `${baseButtonClasses} ${sizeClasses[size]} bg-primary text-primary-foreground border-primary hover:bg-emerald-800 hover:text-white hover:border-emerald-800 active:bg-emerald-800 active:text-white active:border-emerald-800`;

  // 내비게이션 버튼 스타일
  const navButtonClasses = `${baseButtonClasses} ${sizeClasses[size]} bg-background text-foreground border-border hover:bg-muted hover:text-primary hover:border-border active:bg-gray-200 active:text-primary active:border-border disabled:bg-muted disabled:text-gray-300 disabled:border-border disabled:cursor-not-allowed`;

  const pages = getPageNumbers();

  return (
    <nav className={`flex items-center justify-center gap-2 ${className}`} aria-label="페이지네이션">
      {/* 처음 페이지로 이동 버튼 */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={navButtonClasses}
          aria-label="첫 번째 페이지로 이동"
        >
          <ChevronsLeft className={iconSizes[size]} />
        </button>
      )}

      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={navButtonClasses}
        aria-label="이전 페이지로 이동"
      >
        <ChevronLeft className={iconSizes[size]} />
      </button>

      {/* 페이지 번호 버튼들 */}
      {pages.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <div
              key={`ellipsis-${index}`}
              className={`${sizeClasses[size]} flex items-center justify-center text-foreground`}
              aria-hidden="true"
            >
              <MoreHorizontal className={iconSizes[size]} />
            </div>
          );
        }

        const isCurrentPage = page === currentPage;
        
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={isCurrentPage ? currentPageButtonClasses : pageButtonClasses}
            aria-label={`${page}페이지로 이동`}
            aria-current={isCurrentPage ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* 다음 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={navButtonClasses}
        aria-label="다음 페이지로 이동"
      >
        <ChevronRight className={iconSizes[size]} />
      </button>

      {/* 마지막 페이지로 이동 버튼 */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={navButtonClasses}
          aria-label="마지막 페이지로 이동"
        >
          <ChevronsRight className={iconSizes[size]} />
        </button>
      )}
    </nav>
  );
};

export { Pagination }; 