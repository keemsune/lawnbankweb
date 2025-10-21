import { useState, useEffect } from 'react';

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      const currentPosition = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = documentHeight > 0 ? (currentPosition / documentHeight) * 100 : 0;
      
      setScrollPosition(currentPosition);
      setScrollPercentage(percentage);
    };

    window.addEventListener('scroll', updatePosition);
    updatePosition(); // 초기값 설정

    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return { scrollPosition, scrollPercentage };
}
