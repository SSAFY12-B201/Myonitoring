import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import { api } from '../api/axios';

let app: any = null;
let messaging: any = null;

export const initializeFirebase = async () => {
  try {
    // 서비스 워커 등록 확인
    if (!('serviceWorker' in navigator)) {
      throw new Error('서비스 워커가 지원되지 않는 브라우저입니다.');
    }

    // Firebase 설정 가져오기
    const { data: config } = await api.get('/api/env/firebase-config');
    
    const firebaseConfig = {
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId,
      measurementId: config.measurementId
    };
    
    app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);

    // 서비스 워커 등록
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/'
    });
    console.log('Service Worker 등록 성공:', registration);
    
    // 서비스 워커에 설정 전달
    const sw = await navigator.serviceWorker.ready;
    sw.active?.postMessage({
      type: 'FIREBASE_CONFIG',
      config: firebaseConfig
    });
    
    return { 
      app, 
      messaging, 
      vapidKey: config.vapidKey 
    };
  } catch (error) {
    console.error('Firebase 초기화 실패:', error);
    throw error;
  }
};

// 알림 관련 타입
export interface NotificationMessage {
  title: string;
  body: string;
} 