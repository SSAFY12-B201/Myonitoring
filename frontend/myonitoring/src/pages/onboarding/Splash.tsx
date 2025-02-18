import React from "react";
import { motion } from "framer-motion";

const Splash: React.FC = () => {
  // 공통 애니메이션 설정
  const floatAnimation1 = (delay: number) => ({
    animate: {
      y: [0, -20, 0], // 위아래로 움직임
    },
    transition: {
      duration: 2, // 2초 동안 애니메이션
      repeat: Infinity, // 무한 반복
      ease: "easeInOut", // 부드러운 움직임
      delay, // 각 이미지마다 다른 시작 시간
    },
  });
  const floatAnimation2 = (delay: number) => ({
    animate: {
      y: [0, -20, 0], // 위아래로 움직임
    },
    transition: {
      duration: 2, // 2초 동안 애니메이션
      repeat: Infinity, // 무한 반복
      ease: "easeInOut", // 부드러운 움직임
      delay, // 각 이미지마다 다른 시작 시간
    },
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
  {/* 텍스트 */}
  <h1 className="absolute bottom-52 text-5xl font-Gidugu text-gray-900">
    Mynitoring
  </h1>
      {/* 중앙 Cat 이미지 */}
      <motion.img
        src="/Cat.png"
        alt="로딩 이미지"
        className="w-44 h-44"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
      />

      {/* 좌측 상단 이미지 */}
      <motion.img
        src="/food1.png"
        alt="로딩 이미지"
        className="absolute w-12 h-12"
        style={{ top: "56%", left: "24%" }} // Cat 주변에 위치 조정
        {...floatAnimation1(0)} // 딜레이 없음
      />

      {/* 우측 하단 이미지 */}
      <motion.img
        src="/health0.png"
        alt="로딩 이미지"
        className="absolute w-11 h-11"
        style={{ bottom: "35%", right: "28%" }} // Cat 주변에 위치 조정
        {...floatAnimation2(0.5)} // 0.5초 딜레이 추가
      />

      {/* 우측 상단 이미지 */}
      <motion.img
        src="/magnifier.png"
        alt="로딩 이미지"
        className="absolute w-12 h-12"
        style={{ top: "38%", right: "27%" }} // Cat 주변에 위치 조정
        {...floatAnimation1(1)} // 1초 딜레이 추가
      />

    </div>
  );
};

export default Splash;
