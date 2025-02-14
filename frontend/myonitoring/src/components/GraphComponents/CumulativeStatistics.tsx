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
            {feedingTimes.length > 0 && feedingTimes[0]?.time // 유효성 검사 추가
              ? `${feedingTimes[0].time.slice(0, 4)}년 ${parseInt(feedingTimes[0].time.slice(5, 7), 10)}월 ${parseInt(
                  feedingTimes[0].time.slice(8, 10),
                  10
                )}일`
              : "데이터 없음"}
          </span>
        </div>

        {/* 하단: 총 배급량 및 총 섭취량 */}
        <div className="flex px-3 justify-between items-center">
          {/* 총 배급량 */}
          <div className="flex items-center">
            <span className="text-gray-700 font-medium text-sm">총 배급량:</span>
            <span className="text-[#FFA41D] font-bold text-lg ml-2">{feedingAmount}g</span>
          </div>

          {/* 총 섭취량 (현재는 배급량과 동일) */}
          <div className="flex items-center">
            <span className="text-gray-700 font-medium text-sm">총 섭취량:</span>
            <span className="text-[#FFA41D] font-bold text-lg ml-2">{feedingAmount}g</span>
          </div>
        </div>
      </div>

      {/* 급여 시간 및 급여량 */}
      {feedingTimes.length > 0 ? (
        [...feedingTimes] // 원본 배열 복사
          .reverse() // 복사본을 뒤집기
          .map((feeding, index) => (
            <div key={index} className="mb-6">
              {/* 급여 시간 및 급여량 */}
              <div className="flex items-center mb-2">
                <div className="bg-[#FFA41D] text-white font-bold text-sm px-3 py-1 rounded-full">
                  {feeding.time
                    ? new Date(`2025-02-08T${feeding.time}`).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "시간 없음"}
                </div>
                <span className="ml-3 text-gray-800 font-semibold">{feeding.feed_amount}g 급여</span>
              </div>

              {/* 섭취 기록 (최근 순으로 정렬) */}
              {feeding.intervals.length > 0 ? (
                <div className="space-y-2 pl-2">
                  {[...feeding.intervals]
                    .reverse() // 최근 순으로 정렬
                    .map((interval, idx) => (
                      <div key={idx} className="flex justify-between text-sm text-gray-600">
                        {/* 시간 표시 */}
                        <span>
                          {interval.time
                            ? `${interval.time.slice(0, 5)}`
                            : "시간 없음"}{" "}
                          ~{" "}
                          {interval.time
                            ? `${interval.time.slice(0, 5)}`
                            : "시간 없음"}
                        </span>

                        {/* 누적 섭취량 표시 */}
                        <span>{interval.cumulative_intake || 0}g 섭취</span>
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
