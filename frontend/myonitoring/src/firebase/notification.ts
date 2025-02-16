import { getToken, onMessage } from 'firebase/messaging';
import { initializeFirebase } from './config';
import type { NotificationMessage } from './config';
import { api } from '../api/axios';
import { AxiosError } from 'axios';

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const { messaging, vapidKey } = await initializeFirebase();
      
      const token = await getToken(messaging, {
        vapidKey: vapidKey
      });

      console.log('FCM Token:', token);
      if (token) {
        try {
          const accessToken = localStorage.getItem('accessToken');
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
        resolve({
          title: payload.notification?.title || '',
          body: payload.notification?.body || ''
        });
      });
    });
  } catch (error) {
    console.error('메시지 리스너 설정 실패:', error);
    throw error;
  }
}; 