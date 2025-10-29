'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';

interface AdminAuthProps {
  children: React.ReactNode;
}

// 3시간 (밀리초)
const INACTIVITY_TIMEOUT = 3 * 60 * 60 * 1000;

export default function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 서버에 인증 상태 확인
    checkAuth();
  }, []);

  // 비활동 타이머 설정
  useEffect(() => {
    if (!isAuthenticated) return;

    const resetTimer = () => {
      // 기존 타이머 제거
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      // 새 타이머 설정
      inactivityTimerRef.current = setTimeout(() => {
        handleLogout();
        alert('3시간 동안 활동이 없어 자동 로그아웃되었습니다.');
      }, INACTIVITY_TIMEOUT);
    };

    // 사용자 활동 감지 이벤트들
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    // 초기 타이머 설정
    resetTimer();

    // 이벤트 리스너 등록
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // 클린업
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth');
      const data = await response.json();
      
      if (data.authenticated) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setError(data.message || '비밀번호가 올바르지 않습니다.');
        setPassword('');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('로그인 처리 중 오류가 발생했습니다.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'DELETE',
      });
      setIsAuthenticated(false);
      setPassword('');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                관리자 인증
              </h1>
              <p className="text-gray-600">
                관리자 비밀번호를 입력해주세요
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  placeholder="비밀번호를 입력하세요"
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="xl"
                className="w-full"
              >
                로그인
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>관리자만 접근 가능합니다</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            관리자로 로그인됨
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            로그아웃
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
