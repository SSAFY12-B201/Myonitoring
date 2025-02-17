import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; // React Router 사용

const ReportTabBar = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 React Router 훅
  const location = useLocation(); // 현재 경로 확인

  // 현재 경로를 기반으로 활성화된 탭 설정
  const activeTab = location.pathname === "/graph" ? "graph" : "stats";

  // 공통 스타일 변수
  const baseStyle =
    "w-full h-10 rounded-full font-bold text-sm flex items-center justify-center";
  const activeStyle = "bg-yellow text-black shadow-sm";
  const inactiveStyle = "bg-gray-100 text-gray-400";

  return (
    <div className="flex justify-center items-center space-x-6 mt-20 max-w-4xl mx-5">
      {/* 그래프 탭 */}
      <button
        onClick={() => navigate("/graph")} // 그래프 페이지로 이동
        className={`${baseStyle} ${
          activeTab === "graph" ? activeStyle : inactiveStyle
        }`}
      >
        그래프
      </button>

      {/* 통계 탭 */}
      <button
        onClick={() => navigate("/statistics")} // 통계 페이지로 이동
        className={`${baseStyle} ${
          activeTab === "stats" ? activeStyle : inactiveStyle
        }`}
      >
        통계
      </button>
    </div>
  );
};

export default ReportTabBar;
