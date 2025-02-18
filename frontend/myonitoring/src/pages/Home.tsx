import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import HomeComponentBar from "../components/HomeComponents/HomeComponentBar";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios"; // Axios 인스턴스 사용

const Home: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<any>({
    total_intake: 0,
    intake_alert: { flag: 0 },
    eye_alert: { flag: 0 },
    medical: { data: [] },
  });
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태

  // 현재 날짜를 ISO 형식으로 변환 (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  // Redux에서 selectedCatId 가져오기
  const selectedCatId = useSelector(
    (state: RootState) => state.cat.selectedCatId
  );

  // API 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCatId) {
        console.warn("selectedCatId가 null입니다.");
        return;
      }

      try {
        setLoading(true); // 로딩 시작

        const token = localStorage.getItem("jwt_access_token"); // 로컬 스토리지에서 토큰 가져오기

        if (token) {
          console.log("로그인 상태: true"); // 로그인 상태 콘솔 출력
        } else {
          console.log("로그인 상태: false"); // 로그인 상태 콘솔 출력
        }

        if (!token) {
          throw new Error("토큰이 없습니다.");
        }

        // Axios 요청 보내기
        const response = await api.get(
          `/api/main/${selectedCatId}?day=${today}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const fetchedData = response.data || {};

        setData({
          total_intake: fetchedData.total_intake || 0,
          intake_alert: fetchedData.intake_alert || { flag: 0 },
          eye_alert: fetchedData.eye_alert || { flag: 0 },
          medical: fetchedData.medical || { data: [] }, // 기본값 설정
        });

        setError(null); // 에러 초기화
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다."); // 에러 메시지 설정
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    if (selectedCatId !== null) {
      fetchData(); // selectedCatId가 유효할 때만 호출
    }
  }, [selectedCatId, today]); // selectedCatId 또는 오늘 날짜가 변경되면 다시 fetch

  // barsData 동적 생성
  const barsData = data
    ? [
        {
          title: "총 섭취량",
          badge: `${data.total_intake}g`,
          badgeColor: "text-orange text-xl font-extrabold",
          description: "",
          image: "/food1.png",
          onClick: () => navigate("/graph"),
        },
        {
          title: "섭취 통계 변화",
          chartData:
            data.intake_alert.flag === 1
              ? [
                  { name: "Day 1", value: 20 },
                  { name: "Day 2", value: 40 },
                  { name: "Day 3", value: 100 },
                ]
              : data.intake_alert.flag === -1
              ? [
                  { name: "Day 1", value: 50 },
                  { name: "Day 2", value: 30 },
                  { name: "Day 3", value: 20 },
                ]
              : [
                  { name: "Day 1", value: 15 },
                  { name: "Day 2", value: 20 },
                  { name: "Day 3", value: 20 },
                ],
          badge:
            data.intake_alert.flag === 1
              ? "증가"
              : data.intake_alert.flag === -1
              ? "감소"
              : "유지",
          badgeColor: "text-orange text-xl font-extrabold",
          description: "",
          onClick: () => navigate("/statistics"),
        },
        {
          title: "안구 건강",
          badge: data.eye_alert.flag === 1 ? "의심 증상 발견" : "이상 없음",
          badgeColor:
            data.eye_alert.flag === 1
              ? "bg-orange text-white"
              : "bg-white text-orange border-2 border-orange",
          image: "/magnifier.png",
          description: "",
          onClick: () => navigate("/cateyeinfo"),
        },
        {
          title: "의료 기록",
          badges:
            data?.medical?.data?.length > 0
              ? [
                  {
                    text: `${data.medical.data.length}개의 일정`,
                    color: "bg-orange text-white",
                  },
                ]
              : [
                  {
                    text: "기록 추가",
                    color: "bg-white text-orange border-2 border-orange",
                  },
                ],
          image: "/health1.png",
          description: "",
          onClick: () => navigate("/medical-records"),
        },
      ]
    : [];

  return (
    <div>
      <div className="min-h-screen flex flex-col bg-cover bg-center">
        <TopBar />

        <div className="relative mt-14 ">
          {/* 고양이 프로필 */}
          <div className="flex flex-col items-center mt-4">
            <div className="relative">
              <img
                src={
                  loading || error
                    ? "/Cat_bg.png" 
                    : data.cat_image || "/Cat_bg.png"
                }
                alt="고양이"
                className="w-32 h-32 md:w-24 md:h-24 rounded-full "
              />
            </div>
          </div>

          {/* 바 컴포넌트와 버튼 */}
          <div
            className="grid grid-cols-2 gap-x-4 gap-y-4 p-4 px-6
            md:grid-cols-3 lg:grid-cols-4 "
          >
            {/* 버튼 */}
            <button
              className="col-span-2 md:col-span-1 flex items-center 
  justify-center py-3 px-8 border border-gray-200 rounded-lg 
  font-bold text-gray-600 shadow-sm mb-2"
              onClick={() => console.log("CCTV 버튼 클릭!")}
            >
              {/* 버튼 텍스트 */}
              <span className="text-md flex items-center space-x-2">
                {/* 이미지 추가 */}
                <img
                  src="/cam.png" // public 폴더의 cam.png 경로
                  alt="캠 아이콘"
                  className="h-7 w-7" // 아이콘 크기 조정
                />
                <span>묘니터링 캠 보러 가기</span>
              </span>
            </button>

            {/* 바 컴포넌트들 */}
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
