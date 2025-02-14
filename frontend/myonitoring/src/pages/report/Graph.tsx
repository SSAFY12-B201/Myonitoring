import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ReportTabBar from "../../components/GraphComponents/ReportTabBar"; // 기존 탭 바 컴포넌트
import TopBar from "../../components/TopBar";
import CumulativeStatistics from "../../components/GraphComponents/CumulativeStatistics";
import DateNavigationBar from "../../components/GraphComponents/DateNavigationBar"; // 날짜 이동 바 컴포넌트
import BottomBar from "../../components/BottomBar";
import dayData from "../../dummyData/day.json"; // 일간 데이터 가져오기
import weekData from "../../dummyData/week.json"; // 주간 데이터 가져오기

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

interface WeeklyData {
  date: string; // 요일
  섭취량: number;
}

const Graph: React.FC = () => {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [currentMonday, setCurrentMonday] = useState<Date>(new Date("2025-02-10")); // 초기 날짜 (월요일)
  const [feedingTimes, setFeedingTimes] = useState<FeedingTime[]>([]);
  const [feedingAmount, setFeedingAmount] = useState<number>(0); // 총 배급량
  const [selectedDate, setSelectedDate] = useState<string>("2025-02-08"); // 선택된 날짜 (기본값: 2월 8일)

  // 월요일부터 일요일까지의 데이터를 생성하는 함수
  const generateWeeklyData = (monday: Date) => {
    const weeklyGraphData: WeeklyData[] = [];
    const daysOfWeek = ["월", "화", "수", "목", "금", "토", "일"];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + i); // 월요일부터 일요일까지 날짜 생성
      const dateKey = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환

      weeklyGraphData.push({
        date: daysOfWeek[i], // 요일 추가
        섭취량: weekData[dateKey]?.intake || 0, // 해당 날짜의 섭취량(intake)을 가져오거나 기본값 0
      });
    }

    setWeeklyData(weeklyGraphData);
  };

  // 일간 데이터를 가공하는 함수
  const processDailyData = (date: string) => {
    console.log(`Processing daily data for ${date}`); // 디버깅용 로그
    const processedFeedingTimes: FeedingTime[] = [];
    let totalFeedingAmount = 0;

    for (let i = 0; i < dayData.length; i++) {
      const entry = dayData[i];

      if (entry.type === "feeding") {
        totalFeedingAmount += entry.data.amount; // 총 배급량 계산
        processedFeedingTimes.push({
          time: entry.data.time,
          feed_amount: entry.data.amount,
          intervals: [], // intervals는 intake에서 처리
        });
      } else if (entry.type === "intake" && Array.isArray(entry.data)) {
        const lastFeedingTime = processedFeedingTimes[processedFeedingTimes.length - 1];
        if (lastFeedingTime) {
          lastFeedingTime.intervals = entry.data.map((interval) => ({
            time: interval.start_time,
            intake: interval.cumulative_amount,
            cumulative_intake: interval.cumulative_amount,
          }));
        }
      }
    }

    setFeedingTimes(processedFeedingTimes);
    setFeedingAmount(totalFeedingAmount);
  };

  // 날짜 이동 핸들러
  const handleWeekChange = (direction: number) => {
    const newMonday = new Date(currentMonday);
    newMonday.setDate(currentMonday.getDate() + direction * 7); // 이전 주(-7일) 또는 다음 주(+7일)
    setCurrentMonday(newMonday);
  };

  // 그래프 막대 클릭 핸들러
  const handleBarClick = (data: WeeklyData | undefined) => {
    if (!data) return;
    console.log(`Clicked bar for date ${data.date}`);
    setSelectedDate(data.date); // 선택된 날짜 업데이트
    processDailyData(data.date); // 해당 날짜의 일간 데이터 처리
  };

  useEffect(() => {
    generateWeeklyData(currentMonday); // 현재 월요일 기준으로 주간 데이터 생성
    processDailyData(selectedDate); // 선택된 날짜에 해당하는 일간 데이터 처리
  }, [currentMonday, selectedDate]);

  return (
    <>
      <div className="min-h-screen mb-16">
        <TopBar />

        {/* 리포트 탭 바 */}
        <ReportTabBar />

        {/* 날짜 이동 바 */}
        <DateNavigationBar currentMonday={currentMonday} handleWeekChange={handleWeekChange} />

        {/* 반응형 그래프 */}
        <div className="w-full max-w-4xl px-2 mt-6 mx-auto">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={weeklyData}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              onClick={(e) => handleBarClick(e?.activePayload?.[0]?.payload)}
            >
              {/* 격자선 제거 */}
              <CartesianGrid strokeDasharray="0" vertical={false} horizontal={false} />

              {/* X축과 Y축 */}
              <XAxis dataKey="date" />
              <YAxis unit="g" />

              {/* 툴팁 */}
              <Tooltip formatter={(value) => `${value}g`} />

              {/* 섭취량 막대 */}
              <Bar
                dataKey="섭취량"
                fill="#FFC53E"
                barSize={30}
                radius={[5, 5, 5, 5]} // 위쪽 모서리를 둥글게 설정
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 구분선 */}
        <hr className="mx-6 m-3 border-gray-300" />

        {/* 누적 통계 및 배급량 표시 */}
        <div className="w-full max-w-4xl px-4 mt-2 mx-auto">
          {feedingTimes.length > 0 ? (
            <CumulativeStatistics feedingTimes={feedingTimes} feedingAmount={feedingAmount} />
          ) : (
            <p className="text-center text-gray-600">데이터가 없습니다.</p>
          )}
        </div>
      </div>
      <BottomBar />
    </>
  );
};

export default Graph;
