import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage } from 'firebase/messaging';
import { api } from '../api/axios';

export const initializeFirebase = async () => {
  try {
    console.log('Firebase 초기화 시작...');

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

    console.log('Firebase 구성:', firebaseConfig);
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    console.log('Firebase 메시징 인스턴스:', messaging);

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

export const setupForegroundMessageListener = async (
    onMessageReceived: (message: any) => void
) => {
  try {
    console.log('포그라운드 메시지 리스너 설정 시작');

    const { messaging } = await initializeFirebase();

    console.log('메시징 인스턴스:', messaging);

    // 명시적으로 onMessage 리스너 설정
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('포그라운드 메시지 수신:', payload);

      // 메시지 처리 로직
      if (payload.notification) {
        onMessageReceived(payload);
      } else {
        console.warn('유효하지 않은 페이로드:', payload);
      }
    });

    console.log('포그라운드 메시지 리스너 설정 완료');

    return unsubscribe;
  } catch (error) {
    console.error('포그라운드 메시지 리스너 설정 중 오류:', error);
    throw error;
  }
};