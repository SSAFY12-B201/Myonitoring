importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

//console.log('Firebase 메시징 서비스 워커 초기화 중...');

let messaging;

// 서비스 워커는 메인 스레드에서 전달받은 설정을 사용
self.addEventListener('message', (event) => {
  console.log('서비스 워커 메시지 수신:', {
    type: event.data?.type,
    hasConfig: !!event.data?.config
  });

  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    const config = event.data.config;

    if (!firebase.apps.length) {
//      console.log('Firebase 앱 초기화 시작...');
      firebase.initializeApp(config);
//      console.log('Firebase 앱 초기화 완료');

//      console.log('Firebase 메시징 초기화...');
      messaging = firebase.messaging();
//      console.log('Firebase 메시징 초기화 완료');

      messaging.onBackgroundMessage((payload) => {
        // 백그라운드 상태일 때만 알림 표시
        if(!document.visibilityState || document.visibilityState === 'hidden'){
//          console.log('백그라운드 메시지 수신:', payload);

          const notificationTitle = payload.notification?.title || 'New Message';
          const notificationOptions = {
            body: payload.notification?.body || '',
            icon: '/logo_cat.png',
            data: payload.data,
            timestamp: new Date().getTime()
          };

          console.log('알림 표시 시도:', {
            title: notificationTitle,
            options: notificationOptions
          });

          return self.registration.showNotification(notificationTitle, notificationOptions)
              .then(() => {
//                console.log('알림 표시 성공');
              })
              .catch(error => {
//                console.error('알림 표시 실패:', error);
              });
//          console.log('백그라운드 메시지 리스너 설정 완료');
        }

      });


    }
  }
});

self.addEventListener('activate', event => {
//  console.log('서비스 워커 활성화됨');
});

self.addEventListener('push', event => {
//  console.log('푸시 이벤트 수신:', event);

  // 페이로드 로깅 강화
  if (event.data) {
    try {
      const payload = event.data.json();
//      console.log('Push 데이터 상세:', JSON.stringify(payload, null, 2));

      // 알림 옵션 로깅
      const options = {
        body: payload.notification?.body || '',
        icon: '/logo_cat.png',
        badge: '/logo_cat.png',
        data: payload.data,
        timestamp: new Date().getTime()
      };

//      console.log('알림 옵션:', JSON.stringify(options, null, 2));

      event.waitUntil(
          self.registration.showNotification(payload.notification?.title || 'New Message', options)
              .then(() => console.log('Push 알림 표시 성공'))
              .catch(error => console.error('Push 알림 표시 실패:', error))
      );
    } catch (error) {
      console.error('Push 데이터 처리 실패:', error);
    }
  }
});

self.addEventListener('notificationclick', event => {
  console.log('알림 클릭됨:', {
    notification: event.notification,
    action: event.action
  });
  event.notification.close();

  // 알림 클릭시 앱의 메인 페이지로 이동
  event.waitUntil(
      clients.openWindow('/')
  );
});