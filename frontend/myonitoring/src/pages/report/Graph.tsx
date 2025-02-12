import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import ReportTabBar from "../../components/GraphComponents/ReportTabBar"; // 기존 탭 바 컴포넌트
import TopBar from "../../components/TopBar";
import CumulativeStatistics from "../../components/GraphComponents/CumulativeStatistics";
import DateNavigationBar from "../../components/GraphComponents/DateNavigationBar"; // 날짜 이동 바 컴포넌트
import feedingData from "../../dummyData/feeding_data.json"; // JSON 데이터 가져오기
import BottomBar from "../../components/BottomBar";

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

interface FeedingData {
  date: string;
  total_intake: number;
  feeding_amount: number;
  feeding_times: FeedingTime[];
}

interface WeeklyData {
  date: string; 
  섭취량: number;
  배급량: number;
  rawData: FeedingData; // 누적 통계용 원본 데이터
}

const Graph: React.FC = () => {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [selectedDayData, setSelectedDayData] = useState<FeedingData | null>(null);
  const [currentMonday, setCurrentMonday] = useState<Date>(new Date("2025-02-03")); // 초기 날짜

  // 월요일부터 일요일까지의 데이터를 필터링하는 함수
  const filterWeeklyData = (monday: Date) => {
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6); // 월요일 + 6일 = 일요일

    const filteredData = feedingData.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= monday && entryDate <= sunday; // 월요일 ~ 일요일 데이터 필터링
    });

    // 그래프에 필요한 데이터 형식으로 변환
    const graphData = filteredData.map((entry) => ({
      date: new Date(entry.date).toLocaleDateString("ko-KR", { weekday: "short" }), // 요일로 변환
      섭취량: entry.total_intake,
      배급량: entry.feeding_amount,
      rawData: entry,
    }));

    setWeeklyData(graphData);

    // 기본적으로 첫 번째 날의 데이터를 선택
    if (graphData.length > 0) {
      setSelectedDayData(graphData[0].rawData);
    } else {
      setSelectedDayData(null);
    }
  };

  // 날짜 이동 핸들러
  const handleWeekChange = (direction: number) => {
    const newMonday = new Date(currentMonday);
    newMonday.setDate(currentMonday.getDate() + direction * 7); // 이전 주(-7일) 또는 다음 주(+7일)
    setCurrentMonday(newMonday);
  };

  useEffect(() => {
    filterWeeklyData(currentMonday); // 현재 월요일 기준으로 데이터 필터링
  }, [currentMonday]);

  const handleBarClick = (data: WeeklyData) => {
    if (data && data.rawData) {
      setSelectedDayData(data.rawData); // 선택된 날짜의 원본 데이터를 설정
    }
  };

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
            onClick={(e) => handleBarClick(e.activePayload?.[0]?.payload)}
          >
            {/* 격자선 제거 */}
            <CartesianGrid strokeDasharray="0" vertical={false} horizontal={false} />

            {/* X축과 Y축 */}
            <XAxis dataKey="date" />
            <YAxis unit="g" />

            {/* 툴팁 */}
            <Tooltip formatter={(value) => `${value}g`} />

            {/* 섭취량 막대 (배급량 위에 겹쳐서 표시) */}
            <Bar
              dataKey="섭취량"
              fill="#FFC53E"
              barSize={30}
              radius={[5, 5, 5, 5]} // 위쪽 모서리를 둥글게 설정
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 구분선인데 있어도 ㄱㅊ 없어도 ㄱㅊㅊ */}
      <hr className="mx-6 m-3 border-gray-300"/>
      
      {/* 누적 통계 및 배급량 표시 */}
      <div className="w-full max-w-4xl px-4 mt-2 mx-auto">
        {selectedDayData ? (
          <>
            {/* 누적 통계 */}
            <CumulativeStatistics
              feedingTimes={selectedDayData.feeding_times}
              feedingAmount={selectedDayData.feeding_amount} // 배급량 전달
            />
          </>
        ) : (
          <p className="text-center text-gray-600">데이터가 없습니다.</p>
        )}
      </div>
    </div>
    <BottomBar/>
    </>
  );
};

export default Graph;

