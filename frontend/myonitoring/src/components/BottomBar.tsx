import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // React Router 사용
import { Home, BarChart, Schedule, MedicalServices, Person } from "@mui/icons-material";

const BottomBar: React.FC = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const location = useLocation(); // 현재 경로 확인을 위한 훅
  const [activeTab, setActiveTab] = useState("");

  // 탭 데이터 정의
  const tabs = [
    { id: "schedule", label: "예약", icon: <Schedule />, path: "/reservation" },
    { id: "report", label: "리포트", icon: <BarChart />, path: "/graph" },
    { id: "home", label: "홈", icon: <Home />, path: "/home" },
    { id: "medical", label: "의료", icon: <MedicalServices />, path: "/medical-records" },
    { id: "profile", label: "내 정보", icon: <Person />, path: "/my-page" },
  ];

  // 현재 경로에 따라 활성화된 탭 설정
  useEffect(() => {
    const currentTab = tabs.find((tab) => tab.path === location.pathname);
    if (currentTab) {
      setActiveTab(currentTab.id);
    }
  }, [location.pathname]); // location.pathname 변경 시 실행

  const handleTabClick = (tabId: string, path: string) => {
    setActiveTab(tabId); // 활성화된 탭 상태 업데이트
    navigate(path); // 해당 경로로 이동
  };

  return (
    <div className="flex justify-around items-center shadow-md py-2 fixed bottom-0 w-full bg-white">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex flex-col items-center cursor-pointer ${
            activeTab === tab.id ? "text-gray-800 font-bold" : "text-gray-400"
          }`}
          onClick={() => handleTabClick(tab.id, tab.path)}
        >
          {/* 아이콘 */}
          <div className={`text-2xl ${activeTab === tab.id ? "scale-110" : ""}`}>
            {tab.icon}
          </div>
          {/* 라벨 */}
          <span className={`text-xs mt-1 ${activeTab === tab.id ? "font-bold" : ""}`}>
            {tab.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default BottomBar;
