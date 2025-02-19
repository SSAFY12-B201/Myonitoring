import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import ExceptTopContentSection from "../components/ExceptTopContentSection";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { api } from "../api/axios"; // Axios 인스턴스 사용
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

interface AlertLog {
  id: number;
  time: string;
  category: string; // "DEVICE", "INTAKE", "EYE" 등
  message: string;
}

const Notification: React.FC = () => {
  const navigate = useNavigate();
  const selectedCatId = useSelector(
    (state: RootState) => state.cat.selectedCatId
  ); // 선택된 고양이 ID
  const [notifications, setNotifications] = useState<
    Record<string, AlertLog[]>
  >({});
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 메시지

  // 카테고리 변환 함수
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "DEVICE":
        return "기기 이상 알림";
      case "INTAKE":
        return "섭취 이상 알림";
      case "EYE":
        return "안구 건강 이상 알림";
      default:
        return "알 수 없는 알림";
    }
  };

  // 아이콘 반환 함수
  const getIcon = (category: string) => {
    const iconStyle = "w-5 h-5 flex-shrink-0";

    switch (category) {
      case "DEVICE":
        return <XCircle className={`text-red-500 ${iconStyle}`} />;
      case "INTAKE":
        return <CheckCircle className={`text-green-500 ${iconStyle}`} />;
      case "EYE":
        return <AlertTriangle className={`text-orange ${iconStyle}`} />;
      default:
        return <Info className={`text-blue-500 ${iconStyle}`} />;
    }
  };

  // 알림 데이터 가져오기
  useEffect(() => {
    console.log("Current selectedCatId:", selectedCatId); // 선택된 고양이 ID 출력

    const fetchNotifications = async () => {
      if (!selectedCatId) {
        console.warn("No selectedCatId found. Skipping API call."); // 경고 메시지 출력
        return;
      }

      try {
        setLoading(true); // 로딩 시작
        const token = localStorage.getItem("jwt_access_token"); // 토큰 가져오기
        if (!token) throw new Error("No access token found");

        console.log("Fetching notifications for cat ID:", selectedCatId); // 선택된 고양이 ID 출력

        const response = await api.get(`/api/alert-logs/${selectedCatId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Fetched Notifications:", response.data); // API 응답 데이터 출력

        setNotifications(response.data); // 알림 데이터 설정
        setError(null); // 에러 초기화
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError("알림 데이터를 불러오는 데 실패했습니다."); // 에러 메시지 설정
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchNotifications();
  }, [selectedCatId]);

  // 알림 클릭 시 페이지 이동 함수
  const handleNotificationClick = (category: string) => {
    switch (category) {
      case "DEVICE":
        navigate("/device-settings");
        break;
      case "INTAKE":
        navigate("/statistics");
        break;
      case "EYE":
        navigate("/cateyeinfo");
        break;
      default:
        console.warn("Unknown category:", category);
    }
  };

  return (
    <>
      <Header
        title="알림"
        onBack={() => {
          if (window.history.length > 1) {
            navigate(-1); // 이전 페이지가 있을 경우 뒤로가기
          } else {
            navigate("/"); // 이전 페이지가 없으면 홈 화면으로 이동
          }
        }}
      />

      {/* 본문 내용 */}
      <ExceptTopContentSection>
        {Object.keys(notifications).length === 0 ? (
          <div className="flex flex-col items-center h-screen mt-28">
            {/* 고양이 이미지 */}
            <img
              src="/Cat.png"
              alt="로고 이미지"
              className="w-35 h-32 animate-fade-in mt-16"
            />
            {/* 알림 없음 메시지 */}
            <h1 className="text-sm text-gray-600 mt-6">알림이 없습니다.</h1>
          </div>
        ) : (
          Object.keys(notifications)
            .sort((a, b) => (a > b ? -1 : 1)) // 날짜 내림차순 정렬
            .map((date) => (
              <div key={date} className="mb-6">
                {/* 날짜 */}
                <h2 className="text-sm font-bold text-gray-600 mb-4">{date}</h2>

                {/* 알림 리스트 */}
                <div className="space-y-4">
                  {notifications[date].map((item: AlertLog) => (
                    <div
                      onClick={() => handleNotificationClick(item.category)} // 클릭 시 페이지 이동
                      key={item.id}
                      className="flex items-start bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                    >
                      {/* 아이콘 */}
                      <div className="pt-1">{getIcon(item.category)}</div>

                      {/* 내용과 시간 */}
                      <div className="ml-4 flex-grow">
                        <div className="flex justify-between items-center">
                          {/* 카테고리 */}
                          <h3 className="text-sm font-bold text-gray-800">
                            {getCategoryLabel(item.category)}
                          </h3>
                          {/* 시간 */}
                          <span className="text-xs text-gray-400">
                            {item.time}
                          </span>
                        </div>
                        {/* 메시지 */}
                        <p className="text-xs text-gray-500 mt-2">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
        )}
      </ExceptTopContentSection>
    </>
  );
};

export default Notification;
