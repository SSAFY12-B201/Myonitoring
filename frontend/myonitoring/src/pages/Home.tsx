<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import {
  ChartBarIcon,
  EyeIcon,
  ClipboardListIcon,
  DocumentTextIcon,
} from "@heroicons/react/outline"; // Heroicons 사용
import { useSelector, useDispatch  } from "react-redux";
import { RootState } from "../redux/store";
=======
import React from "react";
import { ChartBarIcon, EyeIcon, ClipboardIcon, ExclamationCircleIcon } from "@heroicons/react/outline";
>>>>>>> dev
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import HomeComponentBar from "../components/HomeComponents/HomeComponentBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setSelectedCatId } from "../redux/slices/catSlice";

const Home: React.FC = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [data, setData] = useState<any>(null); // API 데이터 상태
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태

  // 현재 날짜를 ISO 형식으로 변환 (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  const selectedCatId = useSelector(
      (state: RootState) => state.cat.selectedCatId
    );

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
        const response = await axios.get(`/api/main/${selectedCatId}?day=${today}`, {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBteWFpY3Jvc29mdC5jb20iLCJpZCI6MSwicm9sZSI6IkFETUlOIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJpYXQiOjE3MzkyNDU3NDksImV4cCI6MTc3MDc4MTc0OX0.Yr_U3xrz-WcyKL4xVzcKlWeooWS3AG0BU7-kYyyvD1vAJOzoYD3IeVOrLYeueyxGLuHNGutMP2448VOf0rj-xg`, // 실제 토큰 값 입력
            Accept: "application/json",
          },
        });
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
  }, [selectedCatId, today, dispatch]); // 오늘 날짜가 변경되면 다시 fetch

  // barsData 동적 생성
  const barsData = data
    ? [
        {
          icon: <ChartBarIcon className="h-12 w-12" />,
          title: "총 섭취량",
          description: "",
          badge: `${data.total_intake}g`,
          badgeColor: "bg-lightYellow text-black",
          onClick: () => navigate("/graph"),
        },
        {
          icon: <ClipboardListIcon className="h-12 w-12" />,
          title: "섭취량 통계",
          description: "",
          badge:
            data.intake_alert.flag === 1
              ? "증가"
              : data.intake_alert.flag === -1
              ? "감소"
              : "유지",
          badgeColor:
            data.intake_alert.flag === 1
              ? "bg-gradientEnd text-black"
              : data.intake_alert.flag === -1
              ? "bg-red-500 text-white"
              : "",
          onClick: () => navigate("/statistics"),
        },
        {
          icon: <EyeIcon className="h-12 w-12" />,
          title: "안구 건강",
          description: "",
          badge: data.eye_alert.flag === 1 ? "문제 있음" : "건강",
          badgeColor: data.eye_alert.flag === 1 ? "bg-red-500 text-white" : "",
          onClick: () => navigate("/cateyeinfo"),
        },
        ...(data.medical.flag === 1
          ? [
              {
                icon: <DocumentTextIcon className="h-12 w-12" />,
                title: "의료 기록",
                description: "",
                badge: `${data.medical.data.title}`,
                badgeColor: "bg-lightYellow text-black",
                onClick: () => navigate("/medical-records"),
              },
            ]
          : [
              {
                icon: <DocumentTextIcon className="h-12 w-12" />,
                title: "의료 기록",
                description: "",
                badge: "추가",
                badgeColor: "",
                onClick: () => navigate("/medical-records"),
              },
            ]),
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
                src="/logo_cat.png"
                alt="고양이"
                className="w-24 h-24 md:w-24 md:h-24 rounded-full border-2 border-gray-200" // 보더 색상 설정 및 반응형 크기 조정
              />
            </div>

            {/* 버튼 */}
            <button
              className="py-3 px-8 md:px-12 border border-gray-200 rounded-lg font-bold text-gray-700 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 hover:bg-gradient-to-l hover:ring hover:ring-orange transition-all duration-300 shadow-sm hover:text-black" // 보더 색상 동일하게 설정 및 반응형 크기 조정
              onClick={() => console.log("버튼 클릭!")}
            >
              <p className="text-md text-gray-700">{currentDate}</p>
            </button>
          </div>

          {/* 이거 나타낼 때 애니메이션 적용해서 띠용띠용으로 */}
          {/* 바 컴포넌트들 */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 p-4 px-6 mt-6 md:grid-cols-3 lg:grid-cols-4">
            {loading ? (
              <p className="text-center text-gray-600">
               
              </p>
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
