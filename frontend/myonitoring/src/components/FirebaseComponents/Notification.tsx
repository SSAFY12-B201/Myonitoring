import React, { useEffect, useState } from 'react';
import { requestNotificationPermission, onMessageListener } from '../../firebase/notification';
import type { NotificationMessage } from '../../firebase/config';

const NotificationComponent: React.FC = () => {
  const [notification, setNotification] = useState<NotificationMessage | null>(null);

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        // FCM 토큰 생성 및 구독 처리만 수행
        const token = await requestNotificationPermission();
        if (token) {
          console.log('FCM Token:', token);
        }
      } catch (error) {
        console.error('알림 설정 실패:', error);
      }
    };

    setupNotifications();

    // 포그라운드 메시지 수신 리스너
    const setupMessageListener = async () => {
      try {
        const message = await onMessageListener();
        setNotification(message);
        
        // 브라우저 알림 표시
        if (Notification.permission === 'granted') {
          new Notification(message.title, {
            body: message.body,
            icon: '/logo_cat.png'
          });
        }
      } catch (error) {
        console.error('메시지 리스너 설정 실패:', error);
      }
    };

    setupMessageListener();
  }, []);

  // 알림 메시지 UI
  return (
    <div>
      {notification && (
        <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50">
          <h2 className="text-lg font-bold">{notification.title}</h2>
          <p className="text-gray-600">{notification.body}</p>
        </div>
      )}
    </div>
  );
};

export default NotificationComponent; 