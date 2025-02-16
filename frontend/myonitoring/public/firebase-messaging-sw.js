importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// 서비스 워커는 메인 스레드에서 전달받은 설정을 사용
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    const config = event.data.config;
    
    firebase.initializeApp(config);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log('백그라운드 메시지 수신:', payload);

      const notificationTitle = payload.notification?.title || 'New Message';
      const notificationOptions = {
        body: payload.notification?.body || '',
        icon: '/logo_cat.png'  // 로고 파일명 수정
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  }
}); 