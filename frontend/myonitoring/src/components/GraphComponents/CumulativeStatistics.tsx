import React from "react";

interface Interval {
  start_time: string;
  end_time: string;
  cumulative_intake: number;
}

interface FeedingTime {
  time: string;
  feed_amount: number;
  intervals: Interval[];
}

interface CumulativeStatisticsProps {
  feedingTimes: FeedingTime[];
  feedingAmount: number; // 배급량 추가
  selectedDate: string; // 선택된 날짜 추가
}

const CumulativeStatistics: React.FC<CumulativeStatisticsProps> = ({
  feedingTimes,
  feedingAmount,
  selectedDate,
}) => {
  // 총 섭취량 계산
  const totalIntake = feedingTimes.reduce((total, feeding) => {
    if (feeding.intervals.length > 0) {
      // 가장 마지막 누적 섭취량 가져오기
      const lastIntake = feeding.intervals[feeding.intervals.length - 1];
      return total + (lastIntake.cumulative_intake || 0);
    }
    return total;
  }, 0);

  return (
    <div className="p-4">
      {/* 날짜 리포트 */}
      <div className="bg-white py-3 px-4 rounded-lg mb-6 border border-[#D0D0D0]">
        {/* 상단: 날짜 */}
        <div className="flex justify-center items-center mb-2">
          <span className="text-gray-800 font-semibold text-md">
            {selectedDate
              ? `${new Date(selectedDate).getFullYear()}년 ${
                  new Date(selectedDate).getMonth() + 1
                }월 ${new Date(selectedDate).getDate()}일`
              : "데이터 없음"}
          </span>
        </div>

        {/* 하단: 총 배급량 및 총 섭취량 */}
        <div className="flex px-3 justify-between items-center">
          {/* 총 배급량 */}
          <div className="flex items-center">
            <span className="text-gray-700 font-medium text-sm">
              총 배급량:
            </span>
            <span className="text-[#FFA41D] font-bold text-lg ml-2">
              {feedingAmount}g
            </span>
          </div>

          {/* 총 섭취량  */}
          <div className="flex items-center">
            <span className="text-gray-700 font-medium text-sm">
              총 섭취량:
            </span>
            <span className="text-[#FFA41D] font-bold text-lg ml-2">
              {totalIntake}g
            </span>
          </div>
        </div>
      </div>

      {/* 급여 시간 및 급여량 */}
      {feedingTimes.length > 0 ? (
        feedingTimes
          .slice()
          .reverse()
          .map((feeding, index) => (
            <div key={index} className="mb-6">
              {/* 급여 시간 및 급여량 */}
              <div className="flex items-center mb-2">
                <div className="bg-[#FFA41D] text-white font-bold text-sm px-3 py-1 rounded-full">
                  {feeding.time
                    ? new Date(`2025-02-08T${feeding.time}`).toLocaleTimeString(
                        "ko-KR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "시간 없음"}
                </div>
                <span className="ml-3 text-gray-800 font-semibold">
                  {feeding.feed_amount}g 급여
                </span>
              </div>

              {/* 섭취 기록 (순서 유지) */}
              {feeding.intervals.length > 0 ? (
                <div className="space-y-2 pl-2">
                  {feeding.intervals
                    .slice()
                    .reverse()
                    .map((interval, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-sm text-gray-600"
                      >
                        {/* 시간 표시 */}
                        <span>
                          {interval.start_time
                            ? `${new Date(
                                `2025-02-08T${interval.start_time}`
                              ).toLocaleTimeString("ko-KR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}`
                            : "시간 없음"}{" "}
                          ~{" "}
                          {interval.end_time
                            ? `${new Date(
                                `2025-02-08T${interval.end_time}`
                              ).toLocaleTimeString("ko-KR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}`
                            : "시간 없음"}
                        </span>

                        {/* 누적 섭취량 표시 */}
                        <span>
                          <span className="text-xs mr-1">
                            {idx > 0 ? " " : "누적"}
                          </span>
                          {interval.cumulative_intake || 0}g 섭취
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm pl-2">섭취 기록 없음</p>
              )}

              {/* 구분선 */}
              {index !== feedingTimes.length - 1 && (
                <hr className="mt-4 border-gray-300" />
              )}
            </div>
          ))
      ) : (
        <p className="text-center text-gray-500">급여 기록이 없습니다.</p>
      )}
    </div>
  );
};

export default CumulativeStatistics;
