/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: '/revivetouch',  // URL 경로 기반으로 변경
  assetPrefix: '/revivetouch',  // 정적 자산 경로 설정
  images: {
    unoptimized: true,  // 이미지 최적화 비활성화
  },
};

module.exports = nextConfig;