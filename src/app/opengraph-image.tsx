import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = '회생터치 - 회생파산 전문 법무법인 로앤'
export const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '80px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 'bold', marginBottom: 30 }}>
          회생터치
        </div>
        <div style={{ fontSize: 50, opacity: 0.9 }}>
          회생파산 전문 법무법인 로앤
        </div>
        <div style={{ fontSize: 40, opacity: 0.8, marginTop: 30 }}>
          5번의 터치로 찾는 나만의 채무 해결책
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

