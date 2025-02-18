import React from "react";
import { useNavigate } from "react-router-dom";
import ContentSection from "../../components/ContentSection";
import WideButton from "../../components/WideButton";


const Greeting: React.FC = () => {
  const navigate = useNavigate();

  // "다음" 버튼 클릭 핸들러
  const handleNext = () => {
    navigate("/home");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* 중앙 콘텐츠 */}
      <ContentSection className="flex-grow flex flex-col items-center justify-center relative">
        {/* 텍스트 */}
        <h1 className="text-3xl font-bold font-Gidugu text-orange mb-4">만나서 반가워요!</h1>
        <p className="text-sm text-gray-700 mb-6">
          먹는 것부터 보는 것까지, 묘니터링과 함께 해요.
        </p>
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
