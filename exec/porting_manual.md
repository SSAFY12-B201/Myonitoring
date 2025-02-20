# 📚 포팅 메뉴얼

## 🛠️ 1. 사용 도구

### 협업 도구

| **구분** | **도구** |
| --- | --- |
| 이슈 관리 | Jira |
| 형상 관리 | GitLab, Git |
| 커뮤니케이션 | Notion, Mattermost, Kakao Talk |

### 배포 도구

| **구분** | **도구** |
| --- | --- |
| CI/CD | Jenkins, Docker |
| 클라우드 | AWS EC2 |

### 설계 도구

| **구분** | **도구** |
| --- | --- |
| 와이어프레임 | Figma |
| ERD | MySQL WorkBench |
| 문서 작성 | Notion |
| 회로도 | OrCAD |
| 시스템 아키텍쳐 | Excalidraw |
| 3D 프린트 |  Solid Works |

### 개발 도구

| **구분** | **도구** |
| --- | --- |
| IDE | Visual Studio Code,
IntelliJ Ultimate 2024.3.2 |

### AI

| **구분** | **도구** |
| --- | --- |
| 고양이 눈 위치 탐지 모델 |  YOLO_v11 |
| 눈 질병 검사 모델 | MobileNet_v2 |

## 💻 2. 개발 환경

### Frontend

```json
"dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.0",
    "@heroicons/react": "^1.0.6",
    "@mui/icons-material": "^6.4.2",
    "@mui/material": "^6.4.2",
    "@reduxjs/toolkit": "^2.5.1",
    "@types/firebase": "^2.4.32",
    "@vitejs/plugin-react": "^4.3.4",
    "axios": "^1.7.9",
    "firebase": "^11.3.1",
    "framer-motion": "^12.4.2",
    "jwt-decode": "^4.0.0",
    "lucide-react": "^0.475.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-icons": "^5.4.0",
    "react-redux": "^9.2.0",
    "react-router-dom": "^7.1.5",
    "react-switch": "^7.1.0",
    "react-toastify": "^11.0.3",
    "recharts": "^2.15.1",
    "vite-plugin-pwa": "^0.21.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.17.0",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.17.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.16",
    "globals": "^15.14.0",
    "postcss": "^8.5.1",
    "tailwindcss": "^3.4.13",
    "typescript": "~5.6.2",
    "typescript-eslint": "^8.18.2",
    "vite": "^6.0.5"
  },
  "proxy": "https://myonitoring.site"
}
```

### Backend

| 프로그램 | 버전 |
| --- | --- |
| JVM | openjdk 17.0.2 |
| Gradle | 8.12.1 |
| Spring Boot | 3.4.2 |
| Spring | 6.2.2 |
| JPA | 3.4.2 |
| MySQL Connector-J | 9.1.0 |
| Junit | 1.11.4 |
| JWT | 0.11.5 |

### Infrastructure

| 구분 | 버전/용도 |
| --- | --- |
| AWS t2.xlarge | CPU: 4 vCPUs, RAM: 16GB, OS: Ubuntu |
| Ubuntu | 22.04.5 LTS |
| Nginx | 1.27.4 |
| Docker | 27.5.1 |
| Jenkins | 2.495 |
| MySQL | 8.0.41 |
| VNC | 원격 서버 접속 프로토콜 |

### Embedded

| 구분 | 제품명/버전 |
| --- | --- |
| 라즈베리파이 | 라즈베리파이5 8G |
| 초음파 센서 | hr04 |
| 카메라 모듈 | imx219 |
| 무게(저울) 센서 | hx711 |
| 모터 | dc모터 |
| 모터 제어 | PID  제어 |
| RestAPI 통신 | FastAPI |
| 실시간 웹캠 | PyRTOS |

### port 설정

1. 현재 포트 상태 확인

```docker
sudo ufw status
# 결과 예시
Status: active
To                         Action      From
--                         ------      ----
22                         ALLOW       Anywhere                  
80                         ALLOW       Anywhere                  
44                         ALLOW       Anywhere                  
8989                       ALLOW       Anywhere                  
9000                       ALLOW       Anywhere                  
8080/tcp                   ALLOW       Anywhere                  
22/tcp                     ALLOW       Anywhere                  
9005                       ALLOW       Anywhere                  
9005/tcp                   ALLOW       Anywhere                  
80/tcp                     ALLOW       Anywhere                  
443                        ALLOW       Anywhere                  
3306/tcp                   ALLOW       Anywhere                  
3306                       ALLOW       Anywhere                  
3389                       ALLOW       Anywhere                  
3307                       ALLOW       Anywhere                  
3307/tcp                   ALLOW       Anywhere                  
22 (v6)                    ALLOW       Anywhere (v6)             
80 (v6)                    ALLOW       Anywhere (v6)             
44 (v6)                    ALLOW       Anywhere (v6)             
8989 (v6)                  ALLOW       Anywhere (v6)             
9000 (v6)                  ALLOW       Anywhere (v6)             
8080/tcp (v6)              ALLOW       Anywhere (v6)             
22/tcp (v6)                ALLOW       Anywhere (v6)             
9005 (v6)                  ALLOW       Anywhere (v6)             
9005/tcp (v6)              ALLOW       Anywhere (v6)             
80/tcp (v6)                ALLOW       Anywhere (v6)             
443 (v6)                   ALLOW       Anywhere (v6)             
3306/tcp (v6)              ALLOW       Anywhere (v6)             
3306 (v6)                  ALLOW       Anywhere (v6)             
3389 (v6)                  ALLOW       Anywhere (v6)             
3307 (v6)                  ALLOW       Anywhere (v6)             
3307/tcp (v6)              ALLOW       Anywhere (v6)        
```

1. 포트 활성화/비활성화

```docker
# UFW 활성화
sudo ufw enable

# 특정 포트 열기
sudo ufw allow 8080    # 8080 포트 개방
sudo ufw allow 80      # HTTP 포트
sudo ufw allow 443     # HTTPS 포트

# 특정 포트 차단
sudo ufw deny 8080     # 8080 포트 차단
sudo ufw delete allow 8080  # 기존 허용 규칙 삭제
```

1. 프로젝트에 사용한 포트 번호

| 구분 | EC2 | docker |
| --- | --- | --- |
| SSH  접속 | 22 | X |
| HTTP 접속 | 80 | X |
| HTTPS 접속 | 443 | X |
| Nginx | 80, 443 | 80, 443 |
| React | X | 80 |
| Springboot | X | 8080 |
| MySQL | 3307 | 3306 |
| Jenkins | 9005, 50000 | 8080, 50000 |
| Portainer | 8000, 9000 | 8000, 9000 |
| EC2 원격 접속 | 3389 | 3389 |
| Gerrit | 8989 | 8989 |

## ⚙️ 3. 환경 변수 설정

### Backend (application.properties)

```yaml
spring.application.name=myonitoring

# API
app.api-prefix=/api

# MySQL
spring.datasource.url=jdbc:mysql://${DBHOST}:3306/${MYSQL_DATABASE}?useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=${MYSQL_USER}
spring.datasource.password=${MYSQL_PASSWORD}

# JPA
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=${JWT_SECRET}
jwt.access-token-validity-in-seconds=3600
jwt.refresh-token-validity-in-seconds=604800

allowed.origins=${ALLOWED_ORIGINS}

# Kakao OAuth
spring.security.oauth2.client.registration.kakao.client-id=${KAKAO_CLIENT_ID}
spring.security.oauth2.client.registration.kakao.client-secret=${KAKAO_CLIENT_SECRET}
spring.security.oauth2.client.registration.kakao.redirect-uri=${KAKAO_REDIRECT_URI}
spring.security.oauth2.client.registration.kakao.authorization-grant-type=authorization_code
spring.security.oauth2.client.registration.kakao.scope=account_email
spring.security.oauth2.client.registration.kakao.client-name=Kakao
spring.security.oauth2.client.registration.kakao.client-authentication-method=client_secret_post

spring.security.oauth2.client.provider.kakao.authorization-uri=https://kauth.kakao.com/oauth/authorize
spring.security.oauth2.client.provider.kakao.token-uri=https://kauth.kakao.com/oauth/token
spring.security.oauth2.client.provider.kakao.issuer-uri=https://kauth.kakao.com

# Cookie Settings
cookie.secure=${COOKIE_SECURE:false}

# Firebase
firebase.config.apiKey=${FIREBASE_API_KEY}
firebase.config.authDomain=${FIREBASE_AUTH_DOMAIN}
firebase.config.projectId=${FIREBASE_PROJECT_ID}
firebase.config.storageBucket=${FIREBASE_STORAGE_BUCKET}
firebase.config.messagingSenderId=${FIREBASE_MESSAGING_SENDER_ID}
firebase.config.appId=${FIREBASE_APP_ID}
firebase.config.measurementId=${FIREBASE_MEASUREMENT_ID}
firebase.config.vapidKey=${FIREBASE_VAPID_KEY}
FIREBASE_CONFIG_PATH=${FIREBASE_CONFIG_PATH}
```

### .env.example

```bash
DBHOST=localhost
MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=
MYSQL_USER=
MYSQL_PASSWORD=
SERVER_NAME=localhost
JWT_SECRET=
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
KAKAO_REDIRECT_URI=
ALLOWED_ORIGINS=http://localhost:5173
VITE_KAKAO_API_KEY=
VITE_KAKAO_REDIRECT_URI=
FIREBASE_CONFIG_PATH=
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_VAPID_KEY=
FIREBASE_MEASUREMENT_ID=
```

## 🚀 4. 배포 가이드

### 4.1 서버 세팅

1. 서버 기본 설정

```bash
# 패키지 업데이트
sudo apt update
sudo apt upgrade
```

1. Docker 설치(EC2/Linux)

```bash
# 의존성 설치
sudo apt update
sudo apt install ca-certificates curl gnupg lsb-release

# 레포지토리
sudo mkdir -p /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 레포지토리 추가
echo "deb [arch=$(dpkg --print-architecture) \
signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
$(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 도커 설치하기
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin

```

1. Dockerfile 생성
    1. backend/Dockerfile
    
    ```docker
    FROM openjdk:17-slim
    
    WORKDIR /app
    
    COPY . .
    
    RUN chmod +x ./gradlew
    RUN ./gradlew bootJar
    
    EXPOSE 8080
    
    CMD ["java", "-jar", "build/libs/myonitoring-0.0.1-SNAPSHOT.jar"]
    ```
    
    b. frontend/Dockerfile
    
    ```docker
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
    
    RUN ls -l /app/src/assets/images
    
    # 캐시 제거
    RUN rm -rf node_modules/.cache
    
    # 빌드
    RUN npm run build --verbose
    
    FROM nginx:alpine
    # 빌드된 파일과 이미지 함께 복사
    COPY --from=build /app/dist /usr/share/nginx/html
    COPY --from=build /app/src/assets/images /usr/share/nginx/html/assets/images
    ```
    
    c. nginx/Dockerfile
    
    ```docker
    FROM nginx:alpine
    COPY conf.d/default.conf /etc/nginx/conf.d/default.conf
    COPY html /usr/share/nginx/html
    EXPOSE 80
    EXPOSE 443
    CMD ["nginx", "-g", "daemon off;"]
    ```
    

### 4.2 데이터베이스 설정

1. MySQL 컨테이너

```bash
docker run --name mysql-container -p 3307:3306 \\
-e MYSQL_ROOT_PASSWORD=your_password \\
-e MYSQL_DATABASE=your_db \\
-d mysql
```

### 4.3 Jenkins 설정

1. Jenkins 컨테이너 생성

```bash
docker run --name jenkins -d \\
-p 9005:8080 -p 50000:50000 \\
-v /home/ubuntu/jenkins:/var/jenkins_home \\
-v /var/run/docker.sock:/var/run/docker.sock \
jenkins/jenkins:lts
```

1. Jenkins 버전 최신화(local의 Jenkins.war 파일을 EC2 서버에 복사하는 방법)

```bash
*# 로컬 터미널에서 실행*
scp -i I12B201T.pem jenkins.war ubuntu@i12b201.p.ssafy.io:/home/ubuntu/

# EC2 터미널에서 실행
sudo docker cp /home/ubuntu/jenkins.war jenkins:/usr/share/jenkins/jenkins.war

# 권한 설정 및 재시작
sudo docker exec jenkins chown jenkins:jenkins /usr/share/jenkins/jenkins.war
sudo docker restart jenkins

# docker jenkins 컨테이너 실행
sudo docker start jenkins

# docker 컨테이너 실행 로그 확인
sudo docker logs jenkins
```

1. Jenkins 전용 docker-compose.yml 파일 생성

```docker
services:
  jenkins:
    image: jenkins/jenkins:2.495
    container_name: jenkins
    user: root
    privileged: true
    ports:
      - "9005:8080"
      - "50000:50000"
    volumes:
      - ./jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
      - /usr/bin/docker:/usr/bin/docker
    environment:
      - TZ=Asia/Seoul
    restart: always
```

1. Pipeline 설정
- GitLab Webhook 설정
- 환경변수 설정
- 빌드 트리거 설정

### 4.4 Nginx 설정

1. SSL 인증서 발급

```bash
docker exec -it nginx bash
apt-get update
apt-get install certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

1. Nginx 설정 파일(nginx/conf.d/default.conf)

```
server {
    listen 80;
    server_name ${SERVER_NAME};    
    return 301 https://$server_name$request_uri; 
}

# HTTPS server
server {
    listen 443 ssl;
    server_name ${SERVER_NAME};
    
		# SSL 인증서 nginx 컨테이너로 복사
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # SSL 설정
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 백엔드 API로 포워딩
    location /api/ {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 프론트엔드로 포워딩
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

### 4.5 docker-compose.yml 파일 생성

1. docker-compose.yml (공통 파일)
    
    ```docker
    services:
      nginx:
        build:
          context: ./nginx
          dockerfile: Dockerfile
        image: myonitoring-nginx:latest 
        environment:
          - TZ=Asia/Seoul
        depends_on:
          - frontend
          - backend
        ports:
          - "80:80"
    
      frontend:
        image: kst1040/myonitoring-frontend:latest
        environment:
          - TZ=Asia/Seoul
        expose:
          - "80"
    
      backend:
        image: kst1040/myonitoring-backend:latest
        environment:
          - TZ=Asia/Seoul
          - MYSQL_DATABASE=${MYSQL_DATABASE}
          - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
          - MYSQL_USER=${MYSQL_USER}
          - MYSQL_PASSWORD=${MYSQL_PASSWORD}
          - JWT_SECRET=${JWT_SECRET}
          - ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
          - KAKAO_CLIENT_ID=${KAKAO_CLIENT_ID}
          - KAKAO_CLIENT_SECRET=${KAKAO_CLIENT_SECRET}
          - KAKAO_REDIRECT_URI=${KAKAO_REDIRECT_URI}
          - VITE_KAKAO_API_KEY=${VITE_KAKAO_API_KEY}
          - VITE_KAKAO_REDIRECT_URI=${VITE_KAKAO_REDIRECT_URI}
          - FIREBASE_CONFIG_PATH=${FIREBASE_CONFIG_PATH}
          - FIREBASE_API_KEY=${FIREBASE_API_KEY}
          - FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN}
          - FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
          - FIREBASE_STORAGE_BUCKET=${FIREBASE_STORAGE_BUCKET}
          - FIREBASE_MESSAGING_SENDER_ID=${FIREBASE_MESSAGING_SENDER_ID}
          - FIREBASE_APP_ID=${FIREBASE_APP_ID}
          - FIREBASE_VAPID_KEY=${FIREBASE_VAPID_KEY}
          - FIREBASE_MEASUREMENT_ID=${FIREBASE_MEASUREMENT_ID}
        volumes:
          - ./myonitoring-firebase-adminsdk-fbsvc-78c9791370.json:/app/src/main/resources/firebase-config.json
        expose:
          - "8080"
        depends_on:
          mysql:
            condition: service_healthy
    
      mysql:
        image: mysql:8.0
        command: 
          - mysqld
          - --default-authentication-plugin=mysql_native_password
          - --log-timestamps=system
        restart: always
        environment:
          - TZ=Asia/Seoul
          - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
          - MYSQL_DATABASE=${MYSQL_DATABASE}
          - MYSQL_USER=${MYSQL_USER}
          - MYSQL_PASSWORD=${MYSQL_PASSWORD}
        volumes:
          - mysql_data:/var/lib/mysql
        healthcheck:
          test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
          interval: 10s
          retries: 5
        ports:
          - "3307:3306"
    
    volumes:
      mysql_data:
    ```
    
2. docker-compose.prod.yml (운영 서버용)
    
    ```docker
    services:
      nginx:
        ports:
          - "80:80"
          - "443:443"
        volumes:
          - ./nginx/conf.d:/etc/nginx/conf.d
          - /etc/letsencrypt/live/myonitoring.site/fullchain.pem:/etc/nginx/ssl/cert.pem:ro
          - /etc/letsencrypt/live/myonitoring.site/privkey.pem:/etc/nginx/ssl/key.pem:ro
    
      mysql:
        expose:
          - "3306"
        environment:
          - MYSQL_DATABASE=${MYSQL_DATABASE}
          - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
          - MYSQL_USER=${MYSQL_USER}
          - MYSQL_PASSWORD=${MYSQL_PASSWORD}
    
      backend:
        environment:
          - SPRING_PROFILES_ACTIVE=prod
          - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/${MYSQL_DATABASE}?useSSL=false
          - SPRING_DATASOURCE_USERNAME=${MYSQL_USER}
          - SPRING_DATASOURCE_PASSWORD=${MYSQL_PASSWORD}
    ```
    
3. docker-compose.override.yml (개발 환경용)
    
    ```docker
    services:
      nginx:
        ports:
          - "80:80"
    
      frontend:
        build:      
          context: ./frontend/myonitoring    # npm install이 실행되는 폴더
          dockerfile: ../Dockerfile          # Dockerfile의 상대 경로
        volumes:    
          - ./frontend/myonitoring:/app      
          - /app/node_modules
    
      backend:
        build:      
          context: ./backend
          dockerfile: Dockerfile
        volumes:    
          - ./backend:/app
          - /app/build
        environment:
          - SPRING_PROFILES_ACTIVE=dev
          - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/${MYSQL_DATABASE}?useSSL=false
          - SPRING_DATASOURCE_USERNAME=${MYSQL_USER}
          - SPRING_DATASOURCE_PASSWORD=${MYSQL_PASSWORD}
    
      mysql:
        ports:
          - "3306:3306"
        environment:
          - MYSQL_DATABASE=${MYSQL_DATABASE}
          - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
          - MYSQL_USER=${MYSQL_USER}
          - MYSQL_PASSWORD=${MYSQL_PASSWORD}
    ```
    

## 👥 5. 외부 서비스 연동

### 5.1 카카오 로그인

1. 카카오 개발자 센터에서 애플리케이션 등록
2. REST API 키 발급
3. 리다이렉트 URI 설정
4. application.properties에 설정 추가

### 5.2 Firebase FCM 서비스

1. Firebase 로그인 후 Firebase Console 클릭
2. 프로젝트 만들기 클릭
3. 가이드를 따라서 새 프로젝트 생성(firebase-config.json 파일 복사)
4. 복사한 json파일을 Springboot Project의 src/main/java/resources 에 붙이기
5. 프로젝트 개요(사이드 바) 옆의 톱니바퀴 클릭 → 프로젝트 설정 → 클라우드 메시징
6. 웹 구성 부분에서 웹 푸시 인증서 생성 클릭(VAPID KEY)
7. 다음 아래 내용을 .env 파일로 작성

```
FIREBASE_CONFIG_PATH=your-firebase-config-path
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
FIREBASE_APP_ID=your-firebase-app-id
FIREBASE_VAPID_KEY=your-firebase-vapid-key
FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id

```

## ⚠️ 6. 트러블 슈팅

### 6.1 Jenkins 빌드 실패

- 원인: Docker 권한 문제
- 해결: jenkins 사용자에게 docker 그룹 권한 부여

```bash
sudo usermod -aG docker jenkins
```

### 6.2 CORS 에러 발생

- 원인 : cors 설정을 nginx.conf 파일과 백엔드의 application.properties에서 동시에 처리
- 해결 : nginx에 존재하는 cors 설정 코드를 제거

### 6.3 Firebase Cloud Messaging 알림 UI 미출력

- 원인 : 로컬 OS의 알림 및 작업 설정을 ‘끔’으로 설정
- 해결 : 시스템 → 알림 → ‘켬’ 으로 변경 후 하위 옵션 모두 허용

## 🐬 7. MySQL DB DumpFile

[MyonitoringDBDump20250220.sql](/exec/MyonitoringDBDump20250220.sql)