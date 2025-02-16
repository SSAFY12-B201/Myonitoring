import React, { useEffect, useState } from "react";
import {
  ChartBarIcon,
  EyeIcon,
  ClipboardListIcon,
  DocumentTextIcon,
  CameraIcon,
} from "@heroicons/react/outline"; // Heroicons 사용
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import HomeComponentBar from "../components/HomeComponents/HomeComponentBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setSelectedCatId } from "../redux/slices/catSlice";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null); // API 데이터 상태
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태

  // 현재 날짜를 ISO 형식으로 변환 (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  const selectedCatId = useSelector(
    (state: RootState) => state.cat.selectedCatId
  );

  // 카테고리 매핑 객체 (영어 -> 한글)
  const categoryMapping: Record<string, string> = {
    checkup: "정기 검진",
    treatment: "치료",
    other: "기타",
  };

  // 색상 매핑
  const badgeColorMapping: Record<string, string> = {
    checkup: "bg-yellow text-white", // 정기 검진 -> 노랑
    treatment: "bg-orange text-white", // 치료 -> 주황
    other: "bg-blue text-white", // 기타 -> 파랑
  };

  // API 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCatId) {
        console.warn("selectedCatId가 null입니다. 기본값으로 설정합니다.");
        dispatch(setSelectedCatId(1)); // 기본값으로 ID 1 설정
        return;
      }

      try {
        setLoading(true); // 로딩 시작
        const response = await axios.get(
          `/api/main/${selectedCatId}?day=2025-02-22`,
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBteWFpY3Jvc29mdC5jb20iLCJpZCI6MSwicm9sZSI6IkFETUlOIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJpYXQiOjE3MzkyNDU3NDksImV4cCI6MTc3MDc4MTc0OX0.Yr_U3xrz-WcyKL4xVzcKlWeooWS3AG0BU7-kYyyvD1vAJOzoYD3IeVOrLYeueyxGLuHNGutMP2448VOf0rj-xg`, // 실제 토큰 값 입력
              Accept: "application/json",
            },
          }
        );
        setData(response.data); // 데이터 설정
        setError(null); // 에러 초기화
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다."); // 에러 메시지 설정
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchData();
  }, [selectedCatId, today, dispatch]);

  // barsData 동적 생성
  const barsData = data
    ? [
        {
          icon: <ChartBarIcon className="h-6 w-6" />,
          title: "총 섭취량",
          badge: `${data.total_intake}g`,
          badgeColor: "bg-lightYellow text-black",
          description: "금일 먹은 사료",
          onClick: () => navigate("/graph"),
        },
        {
          icon: <ClipboardListIcon className="h-6 w-6" />,
          title: "섭취량 통계",
          badge:
            data.intake_alert.flag === 1
              ? "증가"
              : data.intake_alert.flag === -1
              ? "감소"
              : "유지",
          badgeColor:
            data.intake_alert.flag === 1
              ? "bg-red text-white"
              : data.intake_alert.flag === -1
              ? "bg-red text-white"
              : "bg-lightYellow text-black",
          description:
            data.intake_alert.flag === 1 || data.intake_alert.flag === -1
              ? "섭취량 이상 발견"
              : "섭취량을 모니터링 중",
          onClick: () => navigate("/statistics"),
        },
        {
          icon: <EyeIcon className="h-6 w-6" />,
          title: "안구 건강",
          badge: data.eye_alert.flag === 1 ? "의심 증상 발견" : "건강",
          badgeColor:
            data.eye_alert.flag === 1
              ? "bg-red-500 text-white"
              : "bg-lightYellow text-black",
          description:
            data.eye_alert.flag === 1
              ? "안구 건강 이상 발견"
              : "안구 건강 모니터링 중",
          onClick: () => navigate("/cateyeinfo"),
        },
        {
          icon: <DocumentTextIcon className="h-6 w-6" />,
          title: "의료 기록",
          badges: data.medical.data.map((category: string) => ({
            text: categoryMapping[category] || category, // 카테고리 이름 변환
            color: badgeColorMapping[category] || "", // 색상 매핑
          })),
          description:
            data.medical.data.length > 0
              ? "오늘의 의료 기록"
              : "의료 기록이 없습니다.",
          onClick: () => navigate("/medical-records"),
        },
      ]
    : [];

  return (
    <div className="">
      <div
        className="min-h-screen flex flex-col bg-cover bg-center"
        style={{ backgroundImage: "url('/gradient_background.png')" }}
      >
        <TopBar />

        <div className="relative mt-20">
          {/* 고양이 프로필과 버튼 */}
          <div className="flex flex-col sm:flex-row items-center justify-center mt-4 space-y-4 sm:space-y-0 sm:space-x-4">
            {/* 고양이 프로필 */}
            <div className="relative">
              <img
                src="/white_bg.png"
                alt="고양이"
                className="w-24 h-24 md:w-24 md:h-24 rounded-full border-2 border-gray-200"
              />
            </div>

            {/* 버튼 */}
            <button
              className="flex items-center justify-center space-x-2 py-3 px-8 md:px-12 border border-gray-200 rounded-lg font-bold text-gray-700 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 hover:bg-gradient-to-l hover:ring hover:ring-orange transition-all duration-300 shadow-sm hover:text-black"
              onClick={() => console.log("CCTV 버튼 클릭!")}
            >
              {/* 카메라 아이콘 */}
              <CameraIcon className="w-6 h-6 text-gray-700" />

              {/* 버튼 텍스트 */}
              <span className="text-md">급식기 카메라 보기</span>
            </button>
          </div>

          {/* 바 컴포넌트들 */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 p-4 px-6 mt-6 md:grid-cols-3 lg:grid-cols-4">
            {loading ? (
              <p className="text-center text-gray-600">로딩 중...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              barsData.map((bar, index) => (
                <HomeComponentBar key={index} {...bar} />
              ))
            )}
          </div>
        </div>

        <BottomBar />
      </div>
    </div>
  );
};

export default Home;
