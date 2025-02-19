import { getToken, onMessage } from 'firebase/messaging';
import { initializeFirebase } from './config';
import type { NotificationMessage } from './config';
import { api } from '../api/axios';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
export const requestNotificationPermission = async () => {
  try {
    console.log("알림 권한 요청 시작...");
    console.log("현재 브라우저 알림 권한:", Notification.permission);
    const permission = await Notification.requestPermission();
   console.log("현재 알림 권한 상태 : ",permission);

    if (permission === 'granted') {
     console.log("알림 권한 승인됨, Firebase 초기화 시작...");
      const { messaging, vapidKey } = await initializeFirebase();
      console.log("알림 권한 승인됨, Firebase 초기화 완료, vapidKey 존재 여부 : ", !!vapidKey);

    console.log("FCM 토큰 요청 중...");
      const token = await getToken(messaging, {
        vapidKey: vapidKey
      });

    console.log('FCM Token:', token);

      if (token) {
        try {
          const accessToken = localStorage.getItem('jwt_access_token');
          console.log("accessToken : ",accessToken);

          if (!accessToken) {
            console.error('Access token not found');
            return null;
          }

          await api.post('/api/notifications/subscribe', 
            { token },
            { 
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
          );
          return token;
        } catch (error) {
          console.error('토픽 구독 실패:', error);
          return null;
        }
      }
    }
   console.log('알림 권한이 거부되었습니다.');
    return null;
  } catch (error) {
    console.error('알림 권한 요청 중 오류 발생:', error);
    return null;
  }
};

export const onMessageListener = async () => {
  try {
    const { messaging } = await initializeFirebase();

    return new Promise<NotificationMessage>((resolve) => {
      onMessage(messaging, (payload) => {
        // 상세 로깅 추가
       console.log('수신된 FCM 메시지 전체:', payload);
       console.log('notification 데이터:', payload.notification);
       console.log('data 필드:', payload.data);
       console.log('collapse_key:', payload.collapseKey);

        const message = {
          title: payload.notification?.title || '알림',
          body: payload.notification?.body || '새로운 알림'
        };

        // Toast 알림
        toast.info(message.body, {
          position: "top-right",
          autoClose: 5000,
        });

        resolve(message);
      });
    });
  } catch (error) {
    console.error('메시지 리스너 설정 실패:', error);
   console.error('에러 상세:', error instanceof AxiosError ? error.response?.data : error);
    throw error;
  }
};