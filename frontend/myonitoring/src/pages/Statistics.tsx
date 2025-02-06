import React, { useEffect, useState } from "react";
import ReportTabBar from "../components/GraphComponents/ReportTabBar";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import feedingData from "../dummyData/feeding_data.json"; // JSON 데이터 가져오기

const StatisticsPage: React.FC = () => {
  const [sevenDayChange, setSevenDayChange] = useState<string | null>(null);
  const [thirtyDayChange, setThirtyDayChange] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [warningStyle, setWarningStyle] = useState<{ bgColor: string; borderColor: string }>({
    bgColor: "bg-white",
    borderColor: "border-gray-300",
  });

  useEffect(() => {
    const parseData = (data: any) => {
      return data.map((entry: any) => ({
        date: new Date(entry.date),
        totalIntake: entry.total_intake,
      }));
    };

    const calculateAverageChange = (data: any[], days: number) => {
      const today = new Date("2025-02-06"); // 현재 날짜
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - days);

      const relevantData = data.filter(
        (entry) => entry.date >= targetDate && entry.date < today
      );

      if (relevantData.length === 0) return "-";

      const totalIntakeSum = relevantData.reduce(
        (sum, entry) => sum + entry.totalIntake,
        0
      );
      const averageIntake = totalIntakeSum / relevantData.length;

      const yesterdayIntake =
        data.find((entry) => entry.date.toISOString().split("T")[0] === "2025-02-05")?.totalIntake || 0;

      if (yesterdayIntake === 0) return "-";

      const changePercentage = ((averageIntake - yesterdayIntake) / yesterdayIntake) * 100;

      return changePercentage.toFixed(0);
    };

    const checkConsecutiveChanges = (data: any[]) => {
      let consecutiveDays = 0;
      let isIncreasing = false;

      for (let i = data.length - 1; i > 0; i--) {
        if (data[i].totalIntake > data[i - 1].totalIntake) {
          if (!isIncreasing || consecutiveDays === 0) {
            isIncreasing = true;
            consecutiveDays++;
          } else {
            consecutiveDays++;
          }
        } else if (data[i].totalIntake < data[i - 1].totalIntake) {
          isIncreasing = false;
          break;
        } else {
          break;
        }
      }

      if (consecutiveDays >= 2) {
        setWarningMessage(
          `${consecutiveDays}일 연속 섭취량이 ${
            isIncreasing ? "증가" : "감소"
          }했습니다. 건강상의 이상 신호가 간주됩니다. 전문적인 상담을 받는 것이 권장됩니다.`
        );

        // 배경색 및 선 색상 설정
        if (consecutiveDays >= 2 && consecutiveDays <= 3) {
          setWarningStyle({ bgColor: "bg-[#FFE5AA]", borderColor: "border-[#FFC107]" });
        } else if (consecutiveDays >= 4 && consecutiveDays <= 7) {
          setWarningStyle({ bgColor: "bg-[#FFD87E]", borderColor: "border-[#FFB74D]" });
        }
      } else {
        setWarningMessage(
          "섭취량에 이상 신호는 없습니다. 섭취량 특이사항이 발견되지 않았습니다."
        );
        setWarningStyle({ bgColor: "bg-white", borderColor: "border-gray-300" });
      }
    };

    const parsedData = parseData(feedingData);

    const sevenDayAvgChange = calculateAverageChange(parsedData, 7);
    const thirtyDayAvgChange = calculateAverageChange(parsedData, 30);

    setSevenDayChange(sevenDayAvgChange);
    setThirtyDayChange(thirtyDayAvgChange);

    checkConsecutiveChanges(parsedData);
  }, []);

  return (
    <div className="min-h-screen">
      <TopBar />
      <ReportTabBar />
      <div className="py-6 px-4">
        {/* 상단: 최근 평균 섭취량 대비 증가율 */}
        <div className="bg-white p-2 mb-6">
        <div className="mb-8">
        <h2 className="text-gray-800 font-bold text-lg mb-2">
            최근 평균 섭취량과 비교한 <br/><span className="text-gray-800">변화율</span>입니다.
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
            <span className="font-bold text-gray-700">(전날 기준)</span>으로 섭취량 증감 정보를 제공합니다.
        </p>
        </div>
            
          {/* 증감 박스 */}
          <div className="flex justify-center items-center space-x-4">
            {/* 최근 7일 */}
            <div className="flex flex-col bg-white rounded-lg p-4 w-[150px] h-[120px] border border-gray-200">
                {/* 박스 상단: 최근 7일 */}
                <p className="text-gray-700 font-medium text-sm mb-4 text-left">최근 7일</p>
                {/* 박스 하단: 퍼센트와 화살표 */}
                <div className="flex justify-between items-center w-full">
                {/* 퍼센트 표시 */}
                <p className="text-gray-800 font-bold text-2xl">{sevenDayChange === "-" ? "-" : `${sevenDayChange}%`}</p>
                {/* 화살표 표시 */}
                {sevenDayChange === "-" || parseFloat(sevenDayChange || "0") === 0 ? (
                    <span className="text-gray-400 text-lg">-</span>
                ) : (
                    <span
                    className={`text-lg font-bold ${
                        Math.abs(parseFloat(sevenDayChange)) >= 20
                        ? "text-[#FF5A5A]" // 빨간색
                        : "text-gray-400" // 회색
                    }`}
                    >
                    {parseFloat(sevenDayChange) > 0 ? "▲" : "▼"}
                    </span>
                )}
                </div>
            </div>

            {/* 최근 30일 */}
            <div className="flex flex-col bg-white rounded-lg p-4 w-[150px] h-[120px] border border-gray-200">
                {/* 박스 상단: 최근 30일 */}
                <p className="text-gray-700 font-medium text-sm mb-4 text-left">최근 30일</p>
                {/* 박스 하단: 퍼센트와 화살표 */}
                <div className="flex justify-between items-center w-full">
                {/* 퍼센트 표시 */}
                <p className="text-gray-800 font-bold text-2xl">{thirtyDayChange === "-" ? "-" : `${thirtyDayChange}%`}</p>
                {/* 화살표 표시 */}
                {thirtyDayChange === "-" || parseFloat(thirtyDayChange || "0") === 0 ? (
                    <span className="text-gray-400 text-lg">-</span>
                ) : (
                    <span
                    className={`text-lg font-bold ${
                        Math.abs(parseFloat(thirtyDayChange)) >= 20
                        ? "text-[#FF5A5A]" // 빨간색
                        : "text-gray-400" // 회색
                    }`}
                    >
                    {parseFloat(thirtyDayChange) > 0 ? "▲" : "▼"}
                    </span>
                )}
                </div>
            </div>
            </div>

        </div>

        <hr className="mx-2 m-3 border-gray-300"/>

        {/* 경고 알림 박스 */}
        <div
          className={`mt-8 rounded-lg p-4 mb-6 border-l-4 border border-gray-200 ${warningStyle.bgColor} ${warningStyle.borderColor}`}
        >
          <p className="text-gray-800 font-bold text-md mb-2">{warningMessage}</p>
        </div>

        {/* 하단 설명 */}
        <div className="bg-white rounded-lg p-2">
          <h3 className="text-gray-800 font-bold text-lg mb-4">
            왜 연속적인 섭취량 증감이 중요한가요?
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-2">
            고양이의 경우,48시간 연속으로 평소 섭취량의{" "}
            <span className="font-bold text-gray-800">20% 이상 증감</span>이 발생할 경우{" "}
            <span className="font-bold text-gray-800">건강상의 이상 신호</span>로 간주될 수 있습니다.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            간헐적인 섭취량 변화는 스트레스와 같은 일시적인 요인에서 기인할 가능성이 있지만, 지속적인 증가는{" "}
            <span className="font-bold text-gray-800">잠재적인 질병의 징후</span>일 수 있으므로 조속히 동물병원을 방문하여
            전문적인 상담을 받는 것이 권장됩니다.
          </p>
        </div>
      </div>

      <BottomBar />
    </div>
  );
};

export default StatisticsPage;
