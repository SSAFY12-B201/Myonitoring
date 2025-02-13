import React from "react";
import { ChartBarIcon, EyeIcon, ClipboardIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline/index.js";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import HomeComponentBar from "../components/HomeComponents/HomeComponentBar";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const barsData = [
    {
      icon: <ChartBarIcon className="h-6 w-6 text-black mr-2" />, // Heroicons로 변경
      title: "섭취량 그래프",
      description: "을 섭취했습니다.",
      badge: "25g",
      badgeColor: "bg-lightYellow text-black",
      onClick: () => navigate("/graph"),
    },
    {
      icon: null, // 아이콘 제거
      title: "섭취량 증감",
      description: "섭취량 특이사항이 발견되지 않았습니다.",
      onClick: () => navigate("/statistics"),
    },
    {
      icon: <ExclamationCircleIcon className="h-6 w-6 text-red-500 mr-2" />, 
      title: "섭취량 이상",
      description: "연속적인 섭취량 증감이 확인되었습니다.",
      onClick: () => navigate("/statistics"),
    },
    {
      icon: <EyeIcon className="h-6 w-6 text-black mr-2" />, // Heroicons로 변경
      title: "안구 건강",
      description: "의심 증상이 발견되지 않았습니다.",
      badge: "",
      badgeColor: "bg-lightRed text-white",
      onClick: () => navigate("/cateyeinfo"),
    },
    {
      icon: <EyeIcon className="h-6 w-6 text-black mr-2" />, // Heroicons로 변경
      title: "안구 건강",
      description: "이 발견되었습니다.",
      badge: "안검염",
      badgeColor: "bg-lightRed text-white",
      onClick: () => navigate("/cateyeinfo"),
    },
    {
      icon: <ClipboardIcon className="h-6 w-6 text-black mr-2" />, // Heroicons로 변경
      title: "의료 기록",
      badge: "14:00",
      description: "웰케어 동물병원 정기 검진",
      badgeColor: "bg-lightYellow text-black",
      onClick: () => navigate("/medical-records"),
    },
    {
      icon: <ClipboardIcon className="h-6 w-6 text-black mr-2" />, // Heroicons로 변경
      title: "의료 기록",
      description: "작성된 의료 기록이 없습니다.",
      onClick: () => navigate("/medical-records"),
    },
  ];

  return (
    <div className="mb-16"> 

    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/gradient_background.png')" }}
    >
      <TopBar />
      
      {/* 날짜 바 */}
      <div className="relative min-h-screen mt-20">
        <div className="w-full text-center py-3">
          <p className="text-lg font-bold text-gray-700">{currentDate}</p>
        </div>

        {/* 고양이 프로필 */}
        <div className="flex flex-col items-center mt-4">
          <div className="relative">
            <img
              src="/logo_cat.png"
              alt="고양이"
              className="w-32 h-32 rounded-full border-4 shadow-md"
            />
          </div>
          <h1 className="text-xl font-semibold mt-5 text-gray-800">가을이</h1>
        </div>

        {/* 바 컴포넌트들 */}
        <div className="w-full mt-8 space-y-5 px-6">
          {barsData.map((bar, index) => (
            <HomeComponentBar key={index} {...bar} />
          ))}
        </div>
      </div>

    </div>
      <BottomBar />
    </div>
  );
};

export default Home;
