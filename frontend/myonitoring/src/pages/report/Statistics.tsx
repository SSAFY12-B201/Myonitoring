import React, { useEffect, useState } from "react";
import ReportTabBar from "../../components/GraphComponents/ReportTabBar";
import TopBar from "../../components/TopBar";
import BottomBar from "../../components/BottomBar";
import { api } from "../../api/axios"; // Axios 인스턴스 임포트
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Statistics: React.FC = () => {
  const [statsData, setStatsData] = useState<any>({
    change7d: 0,
    change30d: 0,
    changeDays: 0,
    changeStatus: null,
  }); // API 데이터 상태 초기값 설정
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const [showNoDataMessage, setShowNoDataMessage] = useState<boolean>(false); // "충분한 데이터가 쌓이지 않았습니다" 메시지 표시 여부

  const selectedCatId = useSelector(
    (state: RootState) => state.cat.selectedCatId
  );
  const today = new Date().toISOString().split("T")[0]; // 오늘 날짜 (YYYY-MM-DD)

  // API 데이터 가져오기
  useEffect(() => {
    const fetchStatsData = async () => {
      if (!selectedCatId) {
        setShowNoDataMessage(true);
        return;
      }

      try {
        const token = localStorage.getItem("jwt_access_token");
        if (!token) throw new Error("No access token found");

        setLoading(true);
        const response = await api.get(
          `/api/stats/${selectedCatId}?day=${today}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        setStatsData(response.data);
        setShowNoDataMessage(false); // 데이터가 있으면 메시지 숨김
      } catch (err: any) {
        console.error("데이터 로드 실패:", err);
        if (err.response?.status === 403) {
          // 403 에러 처리
          setStatsData({
            change7d: 0,
            change30d: 0,
            changeDays: 0,
            changeStatus: null,
          });
          setShowNoDataMessage(true); // 메시지 표시
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStatsData();
  }, [selectedCatId, today]);

  // 경고 박스 로직
  let warningMessage = "섭취량 이상이 없습니다.";
  let warningContent = "섭취량 특이사항이 발견되지 않았습니다.";
  let warningStyle = {
    bgColor: "bg-gray-50 border border-gray-300",
    titleColor: "text-black",
    contentColor: "text-gray-600",
    highlightColor: "",
  };

  if (statsData?.changeDays >= 1) {
    warningMessage = `${statsData.changeDays}일 연속 섭취량이 ${
      statsData.changeStatus === 1 ? "증가" : "감소"
    }했습니다.`;
    warningContent =
      "48시간 연속적인 섭취량의 증감이 관찰될 경우, 이는 건강 이상 신호로 간주됩니다.";
    warningStyle = {
      bgColor: statsData.changeDays >= 4 ? "bg-[#FFBF29]" : "bg-[#FFE5AA]",
      titleColor: "text-black",
      contentColor: "text-gray-600",
      highlightColor: "text-red-500",
    };
  }

  return (
    <div className="min-h-screen mb-14">
      <TopBar />
      <ReportTabBar />
      <div className="px-6 py-5 mt-2">
        {loading ? (
          <p className="text-center text-gray-600">데이터를 불러오는 중...</p>
        ) : (
          <>
            {/* 상단 메시지 */}
            {showNoDataMessage && (
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6 text-center">
                <p className="font-bold">충분한 데이터가 쌓이지 않았습니다.</p>
                <p>최소 2일의 데이터가 필요합니다.</p>
              </div>
            )}

            {/* 상단: 최근 평균 섭취량 대비 증가율 */}
            {!showNoDataMessage && (
              <div className="mb-6 mt-3">
                <div className="mb-6">
                  <h2 className="text-gray-800 font-bold text-xl mb-4 leading-snug">
                    최근 평균 섭취량과 비교한 <br />
                    <span className="text-orange">변화율</span>입니다.
                  </h2>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-gray-700">(전날 기준)</span>
                    으로 섭취량 증감 정보를 제공합니다.
                  </p>
                </div>

                {/* 증감 박스 */}
                <div className="flex justify-center items-center space-x-4">
                  {/* 최근 7일 */}
                  <div className="flex flex-col rounded-lg p-4 w-[150px] h-[120px] border border-gray-300">
                    <p className="text-gray-700 font-medium text-sm mb-4 text-left">
                      최근 7일
                    </p>
                    <div className="flex justify-between items-center w-full">
                      <p className="text-gray-800 font-bold text-2xl">
                        {statsData?.change7d !== undefined
                          ? `${(statsData.change7d * 100).toFixed(1)}%` // 100을 곱하고 소수점 2자리까지 표시
                          : "-"}
                      </p>
                      {statsData?.change7d ? (
                        <span
                          className={`text-lg font-bold ${
                            Math.abs(statsData.change7d * 100) >= 20
                              ? "text-red-500" // 빨간색
                              : "text-gray-500" // 회색
                          }`}
                        >
                          {statsData.change7d > 0 ? "▲" : "▼"}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-lg">-</span>
                      )}
                    </div>
                  </div>

                  {/* 최근 30일 */}
                  <div className="flex flex-col rounded-lg p-4 w-[150px] h-[120px] border border-gray-300">
                    <p className="text-gray-700 font-medium text-sm mb-4 text-left">
                      최근 30일
                    </p>
                    <div className="flex justify-between items-center w-full">
                      <p className="text-gray-800 font-bold text-2xl">
                        {statsData?.change30d !== undefined
                          ? `${(statsData.change30d * 100).toFixed(1)}%` // 100을 곱하고 소수점 2자리까지 표시
                          : "-"}
                      </p>
                      {statsData?.change30d ? (
                        <span
                          className={`text-lg font-bold ${
                            Math.abs(statsData.change30d * 100) >= 20
                              ? "text-red-500" // 빨간색
                              : "text-gray-500" // 회색
                          }`}
                        >
                          {statsData.change30d > 0 ? "▲" : "▼"}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-lg">-</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <hr className="mx-auto my-6 border-t border-gray-300 w-full" />

            {/* 경고 알림 박스 */}
            {!showNoDataMessage && (
              <div
                className={`mt-6 rounded-lg p-4 mb-6 ${warningStyle.bgColor}`}
              >
                <p
                  className={`font-bold text-md mb-2 ${warningStyle.titleColor}`}
                >
                  {warningMessage.split(/(증가|감소)/).map((word, idx) =>
                    word === "증가" || word === "감소" ? (
                      <span key={idx} className={warningStyle.highlightColor}>
                        {word}
                      </span>
                    ) : (
                      word
                    )
                  )}
                </p>
                <p className={`leading-relaxed ${warningStyle.contentColor}`}>
                  {warningContent}
                </p>
              </div>
            )}

            {/* 하단 설명 */}
            <div className="bg-white rounded-lg p-4 border border-gray-300">
              <h3 className="text-gray-800 font-bold text-xl mb-3 leading-snug">
                왜 <span className="text-orange">연속적인 섭취량</span> 증감이
                중요한가요?
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                고양이의 경우, 48시간 연속으로 평소 섭취량의{" "}
                <span className="font-bold text-gray-800">20% 이상 증감</span>이
                발생할 경우 건강상의 이상 신호로 간주될 수 있습니다.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                간헐적인 섭취량 변화는 스트레스와 같은 일시적인 요인에서 기인할
                가능성이 있지만, 지속적인 증가는 잠재적인 질병의 징후일 수
                있으므로 조속히 동물병원을 방문하여 전문적인 상담을 받는 것이
                권장됩니다.
              </p>
            </div>
          </>
        )}
      </div>

      <BottomBar />
    </div>
  );
};

export default Statistics;
