import React, { useEffect, useState } from 'react';
import { requestNotificationPermission } from '../../firebase/notification';
import { toast } from 'react-toastify';
import { onMessage } from 'firebase/messaging';
import { initializeFirebase } from '../../firebase/config';

interface NotificationData {
    title: string;
    body: string;
}

const NotificationComponent: React.FC = () => {
    const [notification, setNotification] = useState<NotificationData | null>(null);

    // 로그인 상태 확인 함수 추가
    const checkLoginStatus = () => {
        const accessToken = localStorage.getItem('jwt_access_token');
        const isLoggedIn = !!accessToken;

        return isLoggedIn;
    };

    useEffect(() => {
        // 알림 권한 상태 확인 및 요청
        const checkNotificationPermission = async () => {
            console.log('현재 알림 권한:', Notification.permission);

            if (Notification.permission !== 'granted') {
                try {
                    const permission = await Notification.requestPermission();
                    console.log('알림 권한 요청 결과:', permission);
                } catch (error) {
                    console.error('알림 권한 요청 중 에러:', error);
                }
            }
        };

        const setupNotifications = async () => {
            // 로그인 상태 확인
            if (!checkLoginStatus()) {
                console.log('로그인되지 않아 알림 설정을 건너뜁니다.');
                return;
            }

            try {
                // 알림 권한 확인
                await checkNotificationPermission();

                // FCM 토큰 생성 및 구독 처리
                const token = await requestNotificationPermission();
                if (token) {
                    console.log('FCM Token:', token);
                }

                // Firebase 메시징 인스턴스 초기화
                const { messaging } = await initializeFirebase();

                // 포그라운드 메시지 리스너 설정
                onMessage(messaging, (payload) => {
                    console.group('푸시 알림 수신');
                    console.log('전체 페이로드:', payload);
                    console.log('알림 데이터:', payload.notification);
                    console.log('페이로드 데이터:', payload.data);
                    console.groupEnd();

                    const message: NotificationData = {
                        title: payload.notification?.title || '알림',
                        body: payload.notification?.body || '새로운 알림'
                    };

                    // 알림 표시 전 상태 로깅
                    console.log('알림 상태 변경 직전:', message);

                    // Toast 알림
                    toast.info(message.body, {
                        position: "top-right",
                        autoClose: 5000,
                        onOpen: () => {
                            console.log('Toast 알림 열림');
                            // 상태 업데이트
                            setNotification(message);
                        }
                    });

                    // 브라우저 알림
                    if (Notification.permission === 'granted') {
                        new Notification(message.title, {
                            body: message.body,
                            icon: '/logo_cat.png'
                        });
                    }

                    // 상태 업데이트
                    setNotification(message);

                    setTimeout(() => {
                        console.log('알림 자동 제거');
                        setNotification(null);
                    }, 5000);
                });
            } catch (error) {
                console.error('알림 설정 실패:', error);
            }
        };

        setupNotifications();
    }, []);

    return (
        <div className="fixed top-0 right-0 z-[9999] pointer-events-none p-4">
            {notification && (
                <div
                    className="bg-white p-4 rounded-lg shadow-lg
                    fixed top-4 right-4
                    animate-bounce transition-all duration-300 ease-in-out
                    z-[9999] w-64"
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