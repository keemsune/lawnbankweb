/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,  // 이미지 최적화 비활성화
  },
};
 
module.exports = nextConfig; 