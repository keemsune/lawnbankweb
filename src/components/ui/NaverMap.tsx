'use client';

import { useEffect, useRef } from 'react';

interface NaverMapProps {
  office: 'seoul' | 'daejeon' | 'busan';
  address?: string;
  placeName?: string;
  className?: string;
}

declare global {
  interface Window {
    naver: any;
  }
}

// 각 사무소별 좌표 정의
const officeCoordinates = {
  seoul: { lat: 37.499286, lng: 127.034756 }, // 서울특별시 강남구 논현로87길 25
  daejeon: { lat: 36.353277, lng: 127.388191 }, // 대전광역시 서구 둔산중로78번길 26
  busan: { lat: 35.192086, lng: 129.074951 } // 부산광역시 연제구 법원로 38
};

export default function NaverMap({ 
  office,
  address = '서울특별시 강남구 논현로87길 25',
  placeName = '법무법인 로앤 서울사무소',
  className = ''
}: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // 선택된 사무소의 좌표 가져오기
    const coordinates = officeCoordinates[office];

    // 네이버 지도 스크립트 로드
    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`;
    script.async = true;
    
    script.onload = () => {
      if (mapRef.current && window.naver) {
        const position = new window.naver.maps.LatLng(coordinates.lat, coordinates.lng);
        
        // 지도 생성
        const mapOptions = {
          center: position,
          zoom: 18,
          zoomControl: true,
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT,
          },
        };
        
        const map = new window.naver.maps.Map(mapRef.current, mapOptions);
        mapInstanceRef.current = map;
        
        // 마커 생성
        const marker = new window.naver.maps.Marker({
          position: position,
          map: map,
          title: placeName,
        });
        
        // 정보창 생성
        const infoWindow = new window.naver.maps.InfoWindow({
          content: `
            <div style="padding: 10px; min-width: 200px;">
              <h4 style="margin: 0 0 5px 0; font-weight: bold;">${placeName}</h4>
              <p style="margin: 0; font-size: 12px; color: #666;">${address}</p>
            </div>
          `,
        });
        
        // 마커 클릭 시 정보창 표시
        window.naver.maps.Event.addListener(marker, 'click', () => {
          if (infoWindow.getMap()) {
            infoWindow.close();
          } else {
            infoWindow.open(map, marker);
          }
        });
        
        // 초기에 정보창 표시
        infoWindow.open(map, marker);
      }
    };
    
    document.head.appendChild(script);
    
    return () => {
      // 클린업
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [office, placeName]);

  return <div ref={mapRef} className={className} />;
}

