'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import FixedBottomBar from '@/components/layout/FixedBottomBar';
import { useEffect, useState } from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // variant 상태 관리
  const [variant, setVariant] = useState<string | null>(null);

  // 컴포넌트 마운트 시 URL에서 variant 읽기
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setVariant(params.get('variant'));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 bg-background pt-14 sm:pt-16 md:pt-[72px] lg:pt-[80px]">
        {children}
      </main>

      {/* Footer */}
      {variant !== 'simple' && <Footer />}
      
      {/* Floating Action Button - 전역 */}
      <FloatingActionButton />
      
      {/* Fixed Bottom Bar - 전역 */}
      <FixedBottomBar />
    </div>
  );
}

