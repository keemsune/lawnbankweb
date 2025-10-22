import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { success: false, error: '주소가 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
    
    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Naver Map Client ID가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 네이버 Geocoding API 호출
    const geocodingUrl = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(address)}`;
    
    const response = await fetch(geocodingUrl, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': clientId,
        'X-NCP-APIGW-API-KEY': process.env.NAVER_MAP_CLIENT_SECRET || '',
      },
    });

    if (!response.ok) {
      console.error('❌ Geocoding API 응답 오류:', response.status, response.statusText);
      return NextResponse.json(
        { success: false, error: 'Geocoding API 호출 실패' },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.status === 'OK' && data.addresses && data.addresses.length > 0) {
      const firstAddress = data.addresses[0];
      const coordinates = {
        lat: parseFloat(firstAddress.y),
        lng: parseFloat(firstAddress.x),
      };

      console.log('✅ Geocoding 성공:', address, '→', coordinates);

      return NextResponse.json({
        success: true,
        coordinates,
        fullAddress: firstAddress.roadAddress || firstAddress.jibunAddress,
      });
    } else {
      console.error('❌ Geocoding 결과 없음:', data);
      return NextResponse.json(
        { success: false, error: '주소를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error('❌ Geocoding API 오류:', error);
    return NextResponse.json(
      { success: false, error: error.message || '알 수 없는 오류' },
      { status: 500 }
    );
  }
}

