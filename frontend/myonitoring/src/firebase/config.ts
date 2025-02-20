import { initializeApp, FirebaseOptions } from "firebase/app";
import {
  getMessaging,
  onMessage,
  Messaging,
  MessagePayload,
} from "firebase/messaging";
import { getStorage, FirebaseStorage } from "firebase/storage"; // Firebase Storage 가져오기
import { api } from "../api/axios";

export interface NotificationMessage {
  title: string;
  body: string;
}

interface FirebaseConfig extends FirebaseOptions {
  vapidKey: string;
}

export const initializeFirebase = async (): Promise<{
  app: any;
  messaging: Messaging;
  storage: FirebaseStorage; // 올바른 타입으로 변경
  vapidKey: string;
}> => {
  try {
    //console.log('Firebase 초기화 시작...');

    // Firebase 설정 가져오기
    const { data: config } = await api.get<FirebaseConfig>(
      "/api/env/firebase-config"
    );

    //console.log('Firebase 구성:', config);
    const app = initializeApp(config);
    const messaging = getMessaging(app);
    const storage = getStorage(app); // Firebase Storage 초기화

    //console.log('Firebase 메시징 인스턴스:', messaging);

    return {
      app,
      messaging,
      storage, // 반환 객체에 추가
      vapidKey: config.vapidKey,
    };
  } catch (error) {
    //console.error('Firebase 초기화 실패:', error);
    throw new Error(
      `Firebase 초기화 중 오류 발생: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const setupForegroundMessageListener = async (
  onMessageReceived: (message: MessagePayload) => void
) => {
  //  console.log('포그라운드 메시지 리스너 설정 시작');

  const { messaging } = await initializeFirebase();

  // 명시적으로 onMessage 리스너 설정
  return onMessage(messaging, (payload: MessagePayload) => {
    //console.log('포그라운드 메시지 수신:', payload);

    // 메시지 처리 로직
    if (payload.notification) {
      onMessageReceived(payload);
    } else {
      console.warn("유효하지 않은 페이로드:", payload);
    }
  });
};
