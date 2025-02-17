import React from "react";
import { useNavigate } from "react-router-dom";
import ContentSection from "../../components/ContentSection";
import WideButton from "../../components/WideButton";

const Greeting: React.FC = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/home");
  };

  return (
    <div
      style={{
        backgroundImage: "url('/home_background.png')", // public 폴더의 이미지 경로
        backgroundSize: "cover", // 요소 크기에 맞게 조정
        backgroundPosition: "center", // 중앙 정렬
        height: "100vh", // 화면 전체 높이
        width: "100%", // 전체 너비
      }}
      className="flex flex-col justify-between"
    >
      {/* ContentSection으로 감싸진 중앙 콘텐츠 */}
      <ContentSection className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold font-Gidugu text-orange mb-4">만나서 반가워요!</h1>
        <p className="text-xs text-gray-700 mb-6">
          먹는 것부터 보는 것까지, 묘니터링과 함께 해요.
        </p>
        <img
          src="/lookig_up_cat.png"
          alt="올려다보는 고양이"
          className="w-32 h-32 animate-fade-in"
        />
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
