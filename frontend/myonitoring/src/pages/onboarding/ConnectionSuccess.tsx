import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import WideButton from "../../components/WideButton";
import ExceptTopContentSection from "../../components/ExceptTopContentSection";

const ConnectionSuccess = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    // 다음 단계로 이동
    navigate("/cat-info"); 
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 상단 헤더 */}
      <Header title="기기 정보 등록" onBack={() => navigate(-1)} />

      {/* 본문 영역 */}
      <ExceptTopContentSection>
        <div>
          {/* 제목과 설명 */}
          <h2 className="text-lg font-semibold mb-2">기기 연결 완료</h2>
          <p className="text-sm text-gray-400 mb-6">
            기기 등록이 완료되었습니다.
          </p>

          {/* 기기 이미지 */}
          <div className="flex justify-center pt-10 custom-fade-in-scale">
            <img
              src="/device.png" // public 폴더에 저장된 이미지 경로
              alt="기기 이미지"
              className=" h-auto"
            />
          </div>
        </div>
      </ExceptTopContentSection>

      {/* 하단 버튼 */}
      <footer className="fixed bottom-0 left-0 w-full p-4 bg-white">
        <WideButton
          text="다음"
          textColor="text-white"
          bgColor="bg-darkGray"
          onClick={handleNext}
        />
      </footer>
    </div>
  );
};

export default ConnectionSuccess;
