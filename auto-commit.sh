#!/bin/bash

while true; do
  git add .
  git commit -m "자동 커밋: $(date)"
  git push
  echo "변경사항이 커밋되었습니다: $(date)"
  sleep 300  # 5분마다 체크
done 