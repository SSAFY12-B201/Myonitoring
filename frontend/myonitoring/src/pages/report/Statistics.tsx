import React from "react";
import ReportTabBar from "../../components/GraphComponents/ReportTabBar";
import TopBar from "../../components/TopBar";
import BottomBar from "../../components/BottomBar";

const Statistics: React.FC = () => {
  // 임의의 데이터 설정
  const sevenDayChange: string = "9"; // 최근 7일 증감률 (%)
  const thirtyDayChange: string = "-24"; // 최근 30일 증감률 (%)

  // 연속 증가일 및 상태 설정
  const consecutiveDays = 3; // 연속 증가일
  const isIncreasing = false; // true: 증가, false: 감소

  // 경고 박스 스타일 및 메시지 설정
  let warningMessage = "섭취량 이상이 없습니다.";
  let warningContent = "섭취량 특이사항이 발견되지 않았습니다.";
  let warningStyle = {
    bgColor: "bg-white",
    titleColor: "text-black",
    contentColor: "text-gray-600",
    highlightColor: "",
  };

  if (consecutiveDays >= 2 && consecutiveDays <= 3) {
    warningMessage = `${consecutiveDays}일 연속 섭취량이 ${
      isIncreasing ? "증가" : "감소"
    }했습니다.`;
    warningContent =
      "건강상의 이상 신호가 간주됩니다. 전문적인 상담을 받는 것이 권장됩니다.";
    warningStyle = {
      bgColor: "bg-[#FFE5AA]",
      titleColor: "text-black",
      contentColor: "text-gray-600",
      highlightColor: "text-red-500",
    };
  } else if (consecutiveDays >= 4) {
    warningMessage = `${consecutiveDays}일 연속 섭취량이 ${
      isIncreasing ? "증가" : "감소"
    }했습니다.`;
    warningContent =
      "건강상의 이상 신호가 간주됩니다. 전문적인 상담을 받는 것이 권장됩니다.";
    warningStyle = {
      bgColor: "bg-[#FFBF29]",
      titleColor: "text-black",
      contentColor: "text-gray-600",
      highlightColor: "text-red-500",
    };
  }

  return (
    <div className="min-h-screen mb-16">
      <TopBar />
      <ReportTabBar />
      <div className="px-6 py-5 mt-2">
        {/* 상단: 최근 평균 섭취량 대비 증가율 */}
        <div className="mb-6 mt-3 ">
          <div className="mb-6">
            <h2 className="text-gray-800 font-bold text-xl mb-4 leading-snug">
              최근 평균 섭취량과 비교한 <br />
              <span className="text-orange">변화율</span>입니다.
            </h2>
            <p className="text-sm text-gray-600">
              <span className="font-bold text-gray-700">(전날 기준)</span>으로
              섭취량 증감 정보를 제공합니다.
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
                  {sevenDayChange === "-" ? "-" : `${sevenDayChange}%`}
                </p>
                {sevenDayChange === "-" ||
                parseFloat(sevenDayChange || "0") === 0 ? (
                  <span className="text-gray-400 text-lg">-</span>
                ) : (
                  <span
                    className={`text-lg font-bold ${
                      Math.abs(parseFloat(sevenDayChange)) >= 20
                        ? "text-red-500" // 빨간색
                        : "text-gray-500" // 회색
                    }`}
                  >
                    {parseFloat(sevenDayChange) > 0 ? "▲" : "▼"}
                  </span>
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
                  {thirtyDayChange === "-" ? "-" : `${thirtyDayChange}%`}
                </p>
                {thirtyDayChange === "-" ||
                parseFloat(thirtyDayChange || "0") === 0 ? (
                  <span className="text-gray-400 text-lg">-</span>
                ) : (
                  <span
                    className={`text-lg font-bold ${
                      Math.abs(parseFloat(thirtyDayChange)) >= 20
                        ? "text-red-500" // 빨간색
                        : "text-gray-500" // 회색
                    }`}
                  >
                    {parseFloat(thirtyDayChange) > 0 ? "▲" : "▼"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <hr className="mx-auto my-6 border-t border-gray-300 w-full" />

        {/* 경고 알림 박스 */}
        <div
          className={`mt-8 rounded-lg p-4 mb-6 ${warningStyle.bgColor}`}
        >
          <p className={`font-bold text-md mb-2 ${warningStyle.titleColor}`}>
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

        {/* 하단 설명 */}
        <div className="bg-white rounded-lg p-4 border border-gray-300">
          <h3 className="text-gray-800 font-bold text-xl mb-3 leading-snug">
            왜 <span className="text-orange">연속적인 섭취량</span> 증감이
            중요한가요?
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-2">
            고양이의 경우, 48시간 연속으로 평소 섭취량의{" "}
            <span className="font-bold text-gray-800">20% 이상 증감</span>이
            발생할 경우{" "}
            <span className="font-bold text-gray-800">건강상의 이상 신호</span>
            로 간주될 수 있습니다.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            간헐적인 섭취량 변화는 스트레스와 같은 일시적인 요인에서 기인할
            가능성이 있지만, 지속적인 증가는{" "}
            <span className="font-bold text-gray-800">
              잠재적인 질병의 징후
            </span>
            일 수 있으므로 조속히 동물병원을 방문하여 전문적인 상담을 받는 것이
            권장됩니다.
          </p>
        </div>
      </div>

      <BottomBar />
    </div>
  );
};

export default Statistics;
