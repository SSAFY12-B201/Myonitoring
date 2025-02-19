import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ContentSection from "../../components/ContentSection";
import WideButton from "../../components/WideButton";

const Greeting: React.FC = () => {
  const navigate = useNavigate();

  // "다음" 버튼 클릭 핸들러
  const handleNext = () => {
    navigate("/home");
  };

  // 애니메이션 설정
  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, delay: 0.3 },
    },
  };

  return (
    <div className="flex flex-col h-screen">
      {/* 중앙 콘텐츠 */}
      <ContentSection className="flex-grow flex flex-col items-center justify-center relative">
        {/* 고양이 로고 */}
        <motion.img
          src="/Cat.png"
          alt="고양이 로고"
          className="w-20 h-20 mb-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        />
        {/* 텍스트 */}
        <motion.h1
          className="text-3xl font-bold font-Gidugu text-orange mb-3"
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          만나서 반가워요!
        </motion.h1>
        <motion.p
          className="text-sm text-gray-700 mb-6"
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          먹는 것부터 보는 것까지, 묘니터링과 함께 해요.
        </motion.p>
      </ContentSection>

      {/* 하단 버튼 */}
      <footer className="p-4">
        <WideButton
          text="다음"
          onClick={handleNext}
          bgColor="bg-orange"
          textColor="text-white"
        />
      </footer>
    </div>
  );
};

export default Greeting;
