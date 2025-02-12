FROM node:20 AS build
WORKDIR /app

# 전체 프로젝트 파일 먼저 복사
COPY myonitoring/ .

# 의존성 설치
RUN npm install
RUN npm install @rollup/rollup-linux-x64-gnu
RUN npm install @heroicons/react

# 이미지 디렉토리 복사 위치 변경
COPY myonitoring/src/assets/images /app/src/assets/images

# 캐시 제거
RUN rm -rf node_modules/.cache

# 빌드
RUN npm run build --verbose

FROM nginx:alpine
# 빌드된 파일과 이미지 함께 복사
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/src/assets/images /usr/share/nginx/html/assets/images