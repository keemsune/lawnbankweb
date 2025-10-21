#!/bin/bash

# 배포 스크립트
# EC2 서버에 최신 코드를 배포합니다

echo "🚀 EC2 서버 배포 시작..."

# EC2 서버 정보
EC2_HOST="16.184.18.191"
EC2_USER="ec2-user"
PROJECT_DIR="/home/ec2-user/bankweb"

echo "📡 EC2 서버에 연결 중..."
echo "서버: $EC2_USER@$EC2_HOST"
echo "프로젝트 경로: $PROJECT_DIR"
echo ""

# SSH로 EC2 서버에 접속하여 배포 명령 실행
ssh $EC2_USER@$EC2_HOST << 'ENDSSH'
echo "✅ EC2 서버 접속 성공"
echo ""

# 프로젝트 디렉토리로 이동
cd /home/ec2-user/bankweb || exit 1
echo "📂 프로젝트 디렉토리: $(pwd)"
echo ""

# 현재 브랜치 확인
echo "🔍 현재 Git 상태:"
git branch
echo ""

# 최신 코드 pull
echo "⬇️  최신 코드 가져오는 중..."
git pull origin main
echo ""

# 의존성 설치
echo "📦 의존성 설치 중..."
npm install
echo ""

# 빌드
echo "🔨 프로젝트 빌드 중..."
npm run build
echo ""

# PM2 재시작
echo "🔄 서버 재시작 중..."
pm2 restart bankweb || pm2 start npm --name bankweb -- start
echo ""

# PM2 상태 확인
echo "📊 서버 상태:"
pm2 list
echo ""

echo "✅ 배포 완료!"
ENDSSH

echo ""
echo "🎉 배포가 완료되었습니다!"
echo "🌐 http://16.184.18.191 에서 확인하세요"

