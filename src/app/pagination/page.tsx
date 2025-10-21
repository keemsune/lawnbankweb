'use client';

import React from 'react'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { Pagination } from '@/components/ui/Pagination'

export default function PaginationPage() {
  const [currentPage1, setCurrentPage1] = React.useState(1)
  const [currentPage2, setCurrentPage2] = React.useState(5)
  const [currentPage3, setCurrentPage3] = React.useState(15)
  const [currentPage4, setCurrentPage4] = React.useState(3)
  const [currentPage5, setCurrentPage5] = React.useState(2)

  return (
    <Container className="py-8">
      <div className="space-y-12">
        {/* 헤더 */}
        <div className="text-center">
          <h1 className="text-title-md-css mb-4">Pagination 컴포넌트</h1>
          <p className="text-body-lg-css text-muted-foreground">
            페이지네이션 컴포넌트의 다양한 설정을 확인해보세요.
          </p>
        </div>

        {/* 기본 Pagination */}
        <div className="space-y-4 p-6 bg-card rounded-lg border border-border">
          <h3 className="text-display-xs-css font-medium text-card-foreground">기본 Pagination (10페이지)</h3>
          <div className="text-center">
            <Pagination
              currentPage={currentPage1}
              totalPages={10}
              onPageChange={setCurrentPage1}
            />
          </div>
        </div>

        {/* 많은 페이지 수 */}
        <div className="space-y-4 p-6 bg-card rounded-lg border border-border">
          <h3 className="text-display-xs-css font-medium text-card-foreground">많은 페이지 수 (100페이지)</h3>
          <div className="text-center">
            <Pagination
              currentPage={currentPage2}
              totalPages={100}
              onPageChange={setCurrentPage2}
            />
          </div>
        </div>

        {/* 중간 페이지 */}
        <div className="space-y-4 p-6 bg-card rounded-lg border border-border">
          <h3 className="text-display-xs-css font-medium text-card-foreground">중간 페이지 (50페이지 중 15페이지)</h3>
          <div className="text-center">
            <Pagination
              currentPage={currentPage3}
              totalPages={50}
              onPageChange={setCurrentPage3}
            />
          </div>
        </div>

        {/* 사이즈 변형 */}
        <div className="space-y-4 p-6 bg-card rounded-lg border border-border">
          <h3 className="text-display-xs-css font-medium text-card-foreground">사이즈 변형</h3>
          <div className="space-y-8">
            <div className="text-center">
              <Pagination
                currentPage={currentPage4}
                totalPages={20}
                onPageChange={setCurrentPage4}
                size="xs"
              />
            </div>
            
            <div className="text-center">
              <Pagination
                currentPage={currentPage4}
                totalPages={20}
                onPageChange={setCurrentPage4}
                size="sm"
              />
            </div>
            
            <div className="text-center">
              <Pagination
                currentPage={currentPage4}
                totalPages={20}
                onPageChange={setCurrentPage4}
                size="base"
              />
            </div>
            
            <div className="text-center">
              <Pagination
                currentPage={currentPage4}
                totalPages={20}
                onPageChange={setCurrentPage4}
                size="l"
              />
            </div>
            
            <div className="text-center">
              <Pagination
                currentPage={currentPage4}
                totalPages={20}
                onPageChange={setCurrentPage4}
                size="xl"
              />
            </div>
          </div>
        </div>

        {/* 처음/마지막 버튼 숨김 */}
        <div className="space-y-4 p-6 bg-card rounded-lg border border-border">
          <h3 className="text-display-xs-css font-medium text-card-foreground">처음/마지막 버튼 숨김</h3>
          <div className="text-center">
            <Pagination
              currentPage={currentPage5}
              totalPages={15}
              onPageChange={setCurrentPage5}
              showFirstLast={false}
            />
          </div>
        </div>

        {/* 적은 페이지 수 */}
        <div className="space-y-4 p-6 bg-card rounded-lg border border-border">
          <h3 className="text-display-xs-css font-medium text-card-foreground">적은 페이지 수 (5페이지)</h3>
          <div className="text-center">
            <Pagination
              currentPage={1}
              totalPages={5}
              onPageChange={() => {}}
            />
          </div>
        </div>

        {/* 단일 페이지 */}
        <div className="space-y-4 p-6 bg-card rounded-lg border border-border">
          <h3 className="text-display-xs-css font-medium text-card-foreground">단일 페이지</h3>
          <div className="text-center">
            <Pagination
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
            />
          </div>
        </div>

        {/* 페이지 정보 */}
        <div className="space-y-4 p-6 bg-card rounded-lg border border-border">
          <h3 className="text-display-xs-css font-medium text-card-foreground">컴포넌트 정보</h3>
          <div className="space-y-4">
            <h4 className="text-body-lg-css font-medium">Props</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-body-sm-css">
              <div>
                <strong>currentPage:</strong> number - 현재 페이지 번호
              </div>
              <div>
                <strong>totalPages:</strong> number - 총 페이지 수
              </div>
              <div>
                <strong>onPageChange:</strong> (page: number) =&gt; void - 페이지 변경 콜백
              </div>
              <div>
                <strong>size:</strong> 'xs' | 'sm' | 'base' | 'l' | 'xl' - 버튼 크기
              </div>
              <div>
                <strong>showFirstLast:</strong> boolean - 처음/마지막 버튼 표시 여부
              </div>
              <div>
                <strong>maxVisiblePages:</strong> number - 최대 표시할 페이지 번호 개수
              </div>
            </div>
          </div>
        </div>

        {/* 네비게이션 */}
        <div className="text-center pt-8 border-t border-border">
          <Link
            href="/dev"
            className="text-body-sm-css text-muted-foreground hover:text-primary transition-colors"
          >
            &larr; dev 페이지로 돌아가기
          </Link>
        </div>
      </div>
    </Container>
  )
} 