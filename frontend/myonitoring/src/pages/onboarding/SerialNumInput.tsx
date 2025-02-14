import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // axios 임포트
import Header from "../../components/Header";
import WideButton from "../../components/WideButton"
import { addDevice } from "../../redux/slices/deviceSlice";
import { useAppDispatch } from "../../redux/hooks";
import ExceptTopContentSection from "../../components/ExceptTopContentSection";
import { log } from "console";

const SerialNumberInput = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch()

  // 시리얼 넘버 상태 관리
  const [serialNumber, setSerialNumber] = useState("");
  const [error, setError] = useState(false);

  const handleNext = async () => {
    // 시리얼 넘버가 비어 있는 경우 에러 표시
    if (!serialNumber.trim()) {
      setError(true);
      return;
    }

    try {
      // axios로 백엔드에 시리얼 넘버 전송
      const response = await axios.post(
        "http://localhost:8080/api/devices",
        { serialNumber }, // 본문에 시리얼 넘버 포함
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBteWFpY3Jvc29mdC5jb20iLCJpZCI6MSwicm9sZSI6IkFETUlOIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJpYXQiOjE3MzkyNjI4NTYsImV4cCI6MTc3MDc5ODg1Nn0.fTu6cCHtFgrH1qlsX_CCI7T5WdwcBJVSfiuo1kEcaZCvqwfY1rEsuEr7qOIHHsBFGVKAH-rgg5QPLQhEwOwEFw`, // 실제 토큰 값 입력
          },
        }
      );

      console.log(response)
      
      // if (response.status !== 200) {
      //   throw new Error("Failed to register device");
      // }

      // 성공 시 다음 단계로 이동
      navigate("/connection-success"); 
    } catch (error) {
      console.error("Error registering device:", error);
      alert("기기 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 상단 헤더 */}
      <Header title="기기 정보 등록" onBack={() => navigate(-1)} />

      {/* 본문 영역 */}
      <ExceptTopContentSection>
        <div>
          {/* 제목과 설명 */}
          <h2 className="text-lg font-semibold mb-2">시리얼 넘버 입력</h2>
          <p className="text-sm text-gray-400 mb-6">
            어플 연동을 위해 기기 시리얼 넘버가 필요합니다. 기기 하단의 시리얼
            넘버를 입력해 주세요.
          </p>

          {/* 시리얼 넘버 입력 필드 */}
          <div className="mt-6">
            <input
              id="serialNumber"
              type="text"
              value={serialNumber}
              onChange={(e) => {
                setSerialNumber(e.target.value);
                setError(false); // 입력 중 에러 해제
              }}
              placeholder="시리얼 넘버를 입력하세요"
              className={`mt-1 block w-full px-3 py-2 border ${
                error ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {error && (
              <p className="text-red-500 text-xs mt-1">
                시리얼 넘버를 입력해주세요.
              </p>
            )}
          </div>

          {/* 기기 이미지 */}
          <div className="flex justify-center pt-10">
            <img
              src="/serial_num_guide.png" // public 폴더에 저장된 이미지 경로
              alt="기기 이미지"
              className="w-41 h-auto"
            />
          </div>
        </div>
      </ExceptTopContentSection>

      {/* 하단 버튼 */}
      <footer className="fixed bottom-0 left-0 w-full p-4 bg-white">
        <WideButton
          text="다음"
          textColor="text-white"
          bgColor={
            serialNumber.trim()
              ? "bg-darkGray"
              : "bg-gray-300 cursor-not-allowed"
          }
          onClick={handleNext}
        />
      </footer>
    </div>
  );
};

export default SerialNumberInput;
