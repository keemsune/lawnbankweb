#!/bin/bash

# AWS EC2 배포 스크립트 (Amazon Linux 2)
# IP: 16.184.18.191

echo "🚀 AWS EC2 배포 시작..."

# 1. 시스템 업데이트
echo "📦 시스템 업데이트 중..."
sudo yum update -y

# 2. Node.js 설치 (Amazon Linux)
echo "📦 Node.js 설치 중..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# 3. PM2 설치
echo "📦 PM2 설치 중..."
sudo npm install -g pm2

# 4. Nginx 설치
echo "📦 Nginx 설치 중..."
sudo amazon-linux-extras install nginx1 -y || sudo yum install -y nginx

# 5. Nginx 시작 및 자동 시작 설정
sudo systemctl start nginx
sudo systemctl enable nginx

# 6. 프로젝트 디렉토리 생성
echo "📁 프로젝트 디렉토리 생성..."
cd /home/ec2-user
mkdir -p bankweb
cd bankweb

# 7. .env.local 생성
echo "🔐 환경 변수 설정..."
cat > .env.local << 'ENV_EOF'
NEXT_PUBLIC_HOMEPAGE_API_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjIxNzgsImlkIjoibGF3YW5kZmlybV9zMjAwIiwidmVyIjo2MjcwNzQsImF1ZCI6ImxmdyIsImV4cCI6NDg5Mjc3NTgyOSwiaXNzIjoibGVnYWxmbG93In0.Y7MOGguajJaLdxFLgfPs_I8iOmhzysjYIX1xIQJTr9o
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=e0pqn00yb2
NEXT_PUBLIC_NAVER_MAP_CLIENT_SECRET=NZDm0Inlqe7PONP3hkSwWcHLKAtspzCFDf6XydUF
NEXT_PUBLIC_SLACK_WEBHOOK_URL=SLACK_WEBHOOK_URL_PLACEHOLDER
NEXT_PUBLIC_SLACK_ERROR_WEBHOOK_URL=SLACK_WEBHOOK_URL_PLACEHOLDER
NEXT_PUBLIC_SUPABASE_URL=https://ysrifairdkpzfhlnpyqy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcmlmYWlyZGtwemZobG5weXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5Mzk5MjksImV4cCI6MjA3ODUxNTkyOX0.JHmT0dyuFn4F_g_7VsWqVDvBZIZumqUjrgEpJq28dso
ADMIN_PASSWORD=lawandfirm2025
JWT_SECRET=your-super-secret-jwt-key-change-this
ENV_EOF

# 8. Nginx 설정
echo "🌐 Nginx 설정 중..."
sudo tee /etc/nginx/conf.d/bankweb.conf > /dev/null << 'NGINX_EOF'
server {
    listen 80;
    server_name 16.184.18.191;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
NGINX_EOF

# Nginx 재시작
sudo systemctl restart nginx

echo "✅ 기본 설정 완료!"
echo ""
echo "📤 다음 단계:"
echo "1. 프로젝트 파일을 서버에 업로드"
echo "2. /home/ec2-user/bankweb 에서 npm install && npm run build 실행"
echo "3. pm2 start npm --name bankweb -- start 실행"
echo "4. 브라우저에서 http://16.184.18.191 접속"
