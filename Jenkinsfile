pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        BACKEND_IMAGE = "kst1040/myonitoring-backend"
        FRONTEND_IMAGE = "kst1040/myonitoring-frontend"
    }
    stages {
        stage('Checkout') {
            when {
                branch 'dev'
            }
            steps {
                checkout scm
                script {
                    def commitHash = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    def commitAuthor = sh(script: 'git log -1 --pretty=format:"%an"', returnStdout: true).trim()
                    def commitMessage = sh(script: 'git log -1 --pretty=format:"%s"', returnStdout: true).trim()
                    
                    echo "=== Build Information ==="
                    echo "Commit Hash: ${commitHash}"
                    echo "Author: ${commitAuthor}"
                    echo "Message: ${commitMessage}"
                    echo "======================="
                }
            }
        }
        stage('Build Backend') {
            when { 
                allOf {
                    branch 'dev'
                    changeset "backend/**"
                }
            }
            steps {
                dir('backend') {
                    sh '''
                        chmod +x ./gradlew
                        ./gradlew clean build
                        docker build -t ${BACKEND_IMAGE}:latest .
                        echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
                        docker push ${BACKEND_IMAGE}:latest
                        docker logout
                    '''
                }
            }
        }
        stage('Build Frontend') {
            when { 
                allOf {
                    branch 'dev'
                    changeset "frontend/**"
                }
            }
            steps {
                dir('frontend') {
                    sh '''
                        npm install
                        npm run build
                        docker build -t ${FRONTEND_IMAGE}:latest .
                        echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
                        docker push ${FRONTEND_IMAGE}:latest
                        docker logout
                    '''
                }
            }
        }
        stage('Deploy') {
            when {
                branch 'dev'
            }
            steps {
                script {
                    echo "Deploying new versions of containers..."
                    
                    // 새 이미지 pull
                    sh "docker pull ${BACKEND_IMAGE}:latest"
                    sh "docker pull ${FRONTEND_IMAGE}:latest"
                    
                    // 운영 환경용 컨테이너 재시작
                    sh '''
                        docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
                        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
                        docker-compose ps
                    '''
                }
            }
        }
    }
    post {
        success {
            echo "Build and deployment successful"
            sh 'docker image prune -f'
        }
        failure {
            echo "Build or deployment failed. Check the logs for details."
        }
        always {
            cleanWs()
        }
    }
}