import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import ExceptTopContentSection from "../../components/ExceptTopContentSection";
import WideButton from "../../components/WideButton";

const DeviceDetailedSettings: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { registrationDate, serialNumber, cat } = location.state || {};

  const handleAddDevice = () => {
    console.log("기기 삭제제.");
    // 기기 추가 로직을 여기에 작성하세요.
  };

  return (
    <>
      {/* 상단 헤더 */}
      <Header title="연동 기기 설정" onBack={() => navigate(-1)} />

      {/* 콘텐츠 섹션 */}
      <ExceptTopContentSection>
        {/* 기기 이미지 */}
        <div className="flex justify-center mb-6">
          <img
            src="/src/assets/images/device.png"
            alt="Device"
            className="w-32 h-auto object-contain" // 이미지 크기 조정
          />
        </div>

        <div className="max-w-md mx-auto mt-8 space-y-4">
          {/* 연동된 고양이 */}
          <div className="border-b border-gray-300 py-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              연동된 고양이
            </label>
            <div className="flex justify-between items-center">
              <span className="text-black">
                {cat ? cat.name : "등록된 고양이가 없습니다."}
              </span>
              {cat && (
                <button
                  onClick={() => console.log("고양이 상세 페이지로 이동")}
                  className="text-gray-400 text-lg"
                >
                  &#x276F;
                </button>
              )}
            </div>
          </div>

          {/* 기기 시리얼 넘버 */}
          <div className="border-b border-gray-300 py-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              기기 시리얼 넘버
            </label>
            <span className="text-black">{serialNumber}</span>
          </div>

          {/* 기기 등록일 */}
          <div className="border-b border-gray-300 py-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              기기 등록일
            </label>
            <span className="text-black">{registrationDate}</span>
          </div>
        </div>
      </ExceptTopContentSection>
      {/* 기기 추가 버튼 */}
      <footer className="fixed bottom-2 left-0 w-full p-4">
        <WideButton
          text="기기 삭제"
          onClick={handleAddDevice}
          bgColor="bg-[#595959]" // 주황색 배경
          textColor="text-white" // 흰색 텍스트
        />
      </footer>
    </>
  );
};

export default DeviceDetailedSettings;
