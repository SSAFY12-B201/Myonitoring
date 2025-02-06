import React, { useState, useEffect } from "react";

interface SplashScreenProps {
  onFinish: () => void; // 스플래시 화면이 끝나면 실행할 함수
}

const Splash: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onFinish(); // 스플래시 화면 종료 후 실행할 로직
    }, 2000); // 3초 후 사라짐

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 제거
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
      <img
        src="/logo_cat.png"
        alt="로고 이미지"
        className="w-32 h-32 animate-fade-in"
      />
      <h1 className="text-3xl font-Gidugu text-gray-900">Myonitoring</h1>
    </div>
  );
};

export default Splash;
