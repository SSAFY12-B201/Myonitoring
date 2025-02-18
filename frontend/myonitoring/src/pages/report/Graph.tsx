import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks"; // 커스텀 훅 가져오기
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "../../api/axios"; // Axios 인스턴스 임포트
import ReportTabBar from "../../components/GraphComponents/ReportTabBar"; // 기존 탭 바 컴포넌트
import TopBar from "../../components/TopBar";
import CumulativeStatistics from "../../components/GraphComponents/CumulativeStatistics";
import DateNavigationBar from "../../components/GraphComponents/DateNavigationBar"; // 날짜 이동 바 컴포넌트
import BottomBar from "../../components/BottomBar";

interface WeeklyData {
  date: string; // 요일
  fullDate: string;
  섭취량: number;
}

const Graph: React.FC = () => {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [currentMonday, setCurrentMonday] = useState<Date>(new Date()); // 현재 날짜 기준
  const [selectedDate, setSelectedDate] = useState<string>(""); // 선택된 날짜
  const [loading, setLoading] = useState<boolean>(false);
  const [detailedData, setDetailedData] = useState<any[]>([]);
  const selectedCatId = useAppSelector((state) => state.cat.selectedCatId);

  // API에서 주간 데이터를 가져오는 함수
  const fetchWeeklyData = async (weekStart: string) => {
    try {
      const token = localStorage.getItem("jwt_access_token");
      if (!token) throw new Error("No access token found");

      setLoading(true);
      const response = await api.get(
        `/api/intake/${selectedCatId}/week/cum?week_start=${weekStart}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;

      // 데이터 가공
      const daysOfWeek = ["월", "화", "수", "목", "금", "토", "일"];
      const weeklyGraphData: WeeklyData[] = Object.keys(data).map(
        (dateKey, index) => ({
          date: daysOfWeek[index], // 요일 매핑
          fullDate: dateKey,
          섭취량: data[dateKey].intake || 0, // 섭취량 데이터
        })
      );

      setWeeklyData(weeklyGraphData);
    } catch (error) {
      console.error("Failed to fetch weekly data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 상세 데이터를 가져오는 함수
  const fetchDetailedData = async (date: string) => {
    try {
      const token = localStorage.getItem("jwt_access_token");
      if (!token) throw new Error("No access token found");
      
      const response = await api.get(
        `/api/intake/${selectedCatId}/detail?day=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const rawData = response.data;
      // console.log("Failed to fetch weekly data:",rawData );

      // 상세 데이터 가공
      const processedFeedingTimes = rawData.map((entry: any) => ({
        time: entry.feeding.time,
        feed_amount: entry.feeding.amount,
        intervals: entry.intake.map((intakeEntry: any) => ({
          start_time: intakeEntry.start_time,
          end_time: intakeEntry.end_time,

          cumulative_intake: intakeEntry.cumulative_amount,
        })),
      }));

      setDetailedData(processedFeedingTimes);
    } catch (error) {
      console.error("Failed to fetch detailed data:", error);
    }
  };

  // 현재 월요일을 기준으로 주간 데이터를 가져오기
  useEffect(() => {
    const monday = new Date(currentMonday);
    monday.setDate(monday.getDate() - monday.getDay() + 1); // 월요일 계산
    const weekStart = monday.toISOString().split("T")[0]; // YYYY-MM-DD 형식

    fetchWeeklyData(weekStart);
  }, [currentMonday]);

  // 날짜 이동 핸들러 (이전 주/다음 주)
  const handleWeekChange = (direction: number) => {
    const newMonday = new Date(currentMonday);
    newMonday.setDate(currentMonday.getDate() + direction * 7); // 이전 주(-7일) 또는 다음 주(+7일)
    setCurrentMonday(newMonday);
  };

  // 그래프 막대 클릭 핸들러
  const handleBarClick = (data: WeeklyData | undefined) => {
    if (!data) return;
    // console.log(`Clicked bar for date ${data.fullDate}`);
    setSelectedDate(data.fullDate); // 선택된 날짜 업데이트
    fetchDetailedData(data.fullDate);
  };

  return (
    <>
      <div className="min-h-screen mb-16">
        <TopBar />

        {/* 리포트 탭 바 */}
        <ReportTabBar />

        {/* 날짜 이동 바 */}
        <DateNavigationBar
          currentMonday={currentMonday}
          handleWeekChange={handleWeekChange}
        />

        {/* 반응형 그래프 */}
        <div className="w-full max-w-4xl px-2 mt-6 mx-auto">
          {loading ? (
            <p className="text-center text-gray-600">데이터를 불러오는 중...</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={weeklyData}
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                onClick={(e) => handleBarClick(e?.activePayload?.[0]?.payload)}
              >
                {/* 격자선 제거 */}
                <CartesianGrid
                  strokeDasharray="0"
                  vertical={false}
                  horizontal={false}
                />

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
          )}
        </div>

        {/* 구분선 */}
        <hr className="mx-6 m-3 border-gray-300" />

        {/* 누적 통계 및 배급량 표시 */}
        <div className="w-full max-w-4xl px-4 mt-2 mx-auto">
          {detailedData.length > 0 ? (
            <CumulativeStatistics
              feedingTimes={detailedData}
              feedingAmount={detailedData.reduce(
                (total, entry) => total + entry.feed_amount,
                0
              )} // 총 배급량 계산
              selectedDate={selectedDate}
            />
          ) : (
            <p className="text-center text-gray-600 bg-gray-50 py-4 px-6 rounded-lg border border-gray-200 m-2 mt-6">
              데이터가 없습니다.
            </p>
          )}
        </div>
      </div>
      <BottomBar />
    </>
  );
};

export default Graph;
