import React from "react";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import WarningIcon from "@mui/icons-material/Warning";
import EyeIcon from "@mui/icons-material/Visibility";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// 공통 클래스 정의
const barClass ="flex items-center justify-between bg-white border border-[#D0D0D0] rounded-lg p-4 cursor-pointer"
const titleClass = "block text-lg font-bold"
const descriptionClass = "text-sm text-gray-500"

const Home: React.FC = () => {
  const currentDate = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative min-h-screen">
      {/* 날짜 바 */}
      <div className="w-full text-center py-2 text-lg font-bold">
        {currentDate}
      </div>

      {/* 고양이 프로필 */}
      <div className="flex flex-col items-center mt-4">
        <img
          src="../public/logo_cat.png"
          alt="고양이"
          className="w-24 h-24 rounded-full"
        />
        <h1 className="text-xl font-semibold mt-2">가을이</h1>
      </div>

      {/* 바 컴포넌트들 */}
      <div className="w-full mt-6 space-y-4 px-5">
        {/* 섭취량 그래프 바 */}
        <div
          className={barClass}
          onClick={() => alert("섭취량 그래프 페이지로 이동")}
        >
          <div className="flex items-center space-x-4">
            <LocalDiningIcon style={{ fontSize: 24, color: "#000" }} />
            <div>
              <span className={titleClass}>섭취량 그래프</span>
              <span className={`${descriptionClass} flex items-center`}>
                <span className="bg-yellow-300 px-2 py-1 rounded-full mr-2 text-black font-bold">
                  25g
                </span>
                을 섭취했습니다.
              </span>
            </div>
          </div>
          <ChevronRightIcon style={{ color: "#FFD700" }} />
        </div>
        
        {/* 섭취량 이상 알림 바 */}
        <div
          className={barClass}
          onClick={() => alert("섭취량 이상 알림 페이지로 이동")}
        >
          <div className="flex items-center space-x-4">
            
            <div>
              <span className={titleClass}>섭취량 증감</span>
              <span className={descriptionClass}>
                섭취량 특이사항이 발견되지 않았습니다.
              </span>
            </div>
          </div>
          <ChevronRightIcon style={{ color: "#FFD700" }} />
        </div>

         {/* 안구 건강 위험바 */}
         <div
          className={barClass}
          onClick={() => alert("섭취량 그래프 페이지로 이동")}
        >
          <div className="flex items-center space-x-4">
            <EyeIcon style={{ fontSize: 24, color: "#000" }} />
            <div>
              <span className={titleClass}>안구 건강</span>
              <span className={`${descriptionClass} flex items-center`}>
                <span className="bg-red-500 px-2 py-1 rounded-full mr-2 text-white font-bold">
                  안검염
                </span>
                이 발견되었습니다.
              </span>
            </div>h
          </div>
          <ChevronRightIcon style={{ color: "#FFD700" }} />
        </div>

        {/* 의료 기록 바 */}
        <div
          className={barClass}
          onClick={() => alert("의료 기록 페이지로 이동")}
        >
          <div className="flex items-center space-x-4">
            <MedicalServicesIcon style={{ fontSize: 24, color: "#FF0505" }} />
            <div>
              <span className={titleClass}>의료 기록</span>
              <span className={descriptionClass}>
                14:00 웰케어 동물병원 정기 검진
              </span>
            </div>
          </div>
          <ChevronRightIcon style={{ color: "#FFD700" }} />
        </div>
      </div>
    </div>
  );
};

export default Home;
