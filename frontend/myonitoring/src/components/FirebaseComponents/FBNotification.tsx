import React, { useEffect, useState } from 'react';
import { setupForegroundMessageListener } from '../../firebase/config';
import { requestNotificationPermission } from '../../firebase/notification';
import { toast } from 'react-toastify';

const NotificationComponent: React.FC = () => {
    const [notification, setNotification] = useState<{
        title : string;
        body : string;
    } | null>(null);

    useEffect(() => {
        const setupNotifications = async () => {
            try {
                // FCM 토큰 생성 및 구독 처리
                const token = await requestNotificationPermission();
                if (token) {
                    console.log('FCM Token:', token);
                }

                // 포그라운드 메시지 리스너 설정
                const unsubscribe = await setupForegroundMessageListener((payload) => {
                    console.log('메시지 수신 - FBNotification.tsx:', payload);

                    const message = {
                        title: payload.notification?.title || '알림',
                        body: payload.notification?.body || '새로운 알림'
                    };

                    // Toast 알림
                    toast.info(message.body, {
                        position: "top-right",
                        autoClose: 5000,
                    });

                    // 상태 업데이트
                    setNotification(message);

                    // 브라우저 알림
                    if (Notification.permission === 'granted') {
                        new Notification(message.title, {
                            body: message.body,
                            icon: '/logo_cat.png'
                        });
                    }

                    setTimeout(() => {
                        setNotification(null);
                    }, 5000);
                });

                // 컴포넌트 언마운트 시 리스너 해제
                return () => {
                    if (unsubscribe) unsubscribe();
                };
            } catch (error) {
                console.error('알림 설정 실패:', error);
            }
        };

        setupNotifications();
    }, []);

    return (
        <div className="pointer-events-none fixed top-0 right-0 p-4 z-[9999]">
            {notification && (
                <div
                    className="bg-white p-4 rounded-lg shadow-lg
           animate-bounce transition-all duration-300 ease-in-out"
                    role="alert"
                >
                    <div className="flex items-center space-x-3">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                {notification.title}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {notification.body}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationComponent;