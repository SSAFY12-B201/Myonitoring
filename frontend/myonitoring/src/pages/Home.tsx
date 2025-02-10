import React from "react";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import EyeIcon from "@mui/icons-material/Visibility";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import HomeComponentBar from "../components/HomeComponents/HomeComponentBar";
import { useNavigate } from "react-router-dom"; // 라우팅을 위한 훅

const Home: React.FC = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 React Router 훅
  const currentDate = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // 바 컴포넌트 데이터 정의
  const barsData = [
    {
      icon: <LocalDiningIcon style={{ fontSize: 24, color: "#000" }} />,
      title: "섭취량 그래프",
      description: "25g 을 섭취했습니다.",
      badge: "25g",
      badgeColor: "bg-yellow-300 text-black",
      onClick: () => navigate("/graph"), // 그래프 화면으로 이동
    },
    {
      icon: <LocalDiningIcon style={{ fontSize: 0, color: "#000" }} />,
      title: "섭취량 증감",
      description: "섭취량 특이사항이 발견되지 않았습니다.",
      onClick: () => navigate("/statistics"), // 통계 화면으로 이동
    },
    {
      icon: <EyeIcon style={{ fontSize: 24, color: "#000" }} />,
      title: "안구 건강",
      description: "안검염 이 발견되었습니다.",
      badge: "안검염",
      badgeColor: "bg-red-500 text-white",
      onClick: () => navigate("/cateyeinfo"), // 눈건강 화면으로 이동
    },
    {
      icon: <MedicalServicesIcon style={{ fontSize: 24, color: "#FF0505" }} />,
      title: "의료 기록",
      description: "14:00 웰케어 동물병원 정기 검진",
      onClick: () => navigate("/medical-records"), // 의료기록 조회 화면으로 이동
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/gradient_background.png')" }}
    >
      <TopBar />
      <div className="relative min-h-screen mt-20">
        {/* 날짜 바 */}
        <div className="w-full text-center py-2 text-lg font-bold">
          {currentDate}
        </div>

        {/* 고양이 프로필 */}
        <div className="flex flex-col items-center mt-3">
          <img
            src="../public/logo_cat.png"
            alt="고양이"
            className="w-32 h-32 rounded-full"
          />
          <h1 className="text-xl font-semibold mt-2">가을이</h1>
        </div>

        {/* 바 컴포넌트들 */}
        <div className="w-full mt-6 space-y-4 px-5">
          {barsData.map((bar, index) => (
            <HomeComponentBar key={index} {...bar} />
          ))}
        </div>
      </div>
      <BottomBar />
    </div>
  );
};

export default Home;
