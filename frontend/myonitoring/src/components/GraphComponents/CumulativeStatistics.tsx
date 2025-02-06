import React from "react";

interface Interval {
  time: string;
  intake: number;
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
}

const CumulativeStatistics: React.FC<CumulativeStatisticsProps> = ({ feedingTimes, feedingAmount }) => {
  return (
    <div className="p-4">
     {/* 날짜 리포트 */}
        <div className="bg-white py-3 px-4 rounded-lg mb-6 border border-[#D0D0D0]">
        {/* 상단: 날짜 */}
        <div className="flex justify-center items-center mb-2">
            <span className="text-gray-800 font-semibold text-md">
            {`${feedingTimes[0].time.slice(0, 4)}년 ${parseInt(feedingTimes[0].time.slice(5, 7), 10)}월 ${parseInt(
                feedingTimes[0].time.slice(8, 10),
                10
            )}일`}
            </span>
        </div>

        {/* 하단: 총 배급량 및 총 섭취량 */}
        <div className="flex px-3 justify-between items-center">
            {/* 총 배급량 */}
            <div className="flex items-center">
            <span className="text-gray-700 font-medium text-sm">총 배급량:</span>
            <span className="text-[#FFA41D] font-bold text-lg ml-2">{feedingAmount}g</span>
            </div>

            {/* 총 섭취량 */}
            <div className="flex items-center">
            <span className="text-gray-700 font-medium text-sm">총 섭취량:</span>
            <span className="text-[#FFA41D] font-bold text-lg ml-2">{feedingAmount}g</span>
            </div>
        </div>
        </div>

      {feedingTimes.map((feeding, index) => (
        <div key={index} className="mb-6">
          {/* 급여 시간 및 급여량 */}
          <div className="flex items-center mb-2">
            <div className="bg-[#FFA41D] text-white font-bold text-sm px-3 py-1 rounded-full">
              {new Date(feeding.time).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
            </div>
            <span className="ml-3 text-gray-800 font-semibold">{feeding.feed_amount}g 급여</span>
          </div>

          {/* 섭취 기록 (최근 순으로 정렬) */}
          <div className="space-y-2 pl-2">
            {[...feeding.intervals]
              .reverse() // 최근 순으로 정렬
              .map((interval, idx, arr) => (
                <div key={idx} className="flex justify-between text-sm text-gray-600">
                  {/* 시간 표시 */}
                  <span>{interval.time.slice(11, 16)} ~ {interval.time.slice(11, 16)}</span>

                  {/* 누적 섭취량 표시 */}
                  <span>
                    {idx !== arr.length - 1 && (
                      <span className="text-xs text-gray-400 mr-1">누적</span>
                    )}
                    {interval.cumulative_intake}g 섭취
                  </span>
                </div>
              ))}
          </div>

          {/* 구분선 */}
          {index !== feedingTimes.length - 1 && (
            <hr className="mt-4 border-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
};

export default CumulativeStatistics;
