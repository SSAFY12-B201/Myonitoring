# Node.js 20 버전 사용 (react-router 요구사항 충족)
FROM node:20 AS build

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사
COPY myonitoring/package*.json ./

# 의존성 설치
RUN npm install

# rollup 모듈 설치
RUN npm install @rollup/rollup-linux-x64-gnu
RUN npm install @heroicons/react
# 전체 프로젝트 파일 복사
COPY myonitoring/ .

# 캐시 제거
RUN rm -rf node_modules/.cache

# 프로젝트 빌드
RUN npm run build

# 운영 이미지 (Nginx 사용)
FROM nginx:alpine

# 빌드된 파일 nginx로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# 포트 노출
EXPOSE 80

# nginx 실행
CMD ["nginx", "-g", "daemon off;"]