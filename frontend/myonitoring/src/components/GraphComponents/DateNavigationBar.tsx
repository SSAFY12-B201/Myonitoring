import React from "react";

interface DateNavigationBarProps {
  currentMonday: Date;
  handleWeekChange: (direction: number) => void;
}

const DateNavigationBar: React.FC<DateNavigationBarProps> = ({ currentMonday, handleWeekChange }) => {
  // 월의 몇 번째 주 계산 함수
  const getWeekOfMonth = (date: Date): number => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1); // 해당 월의 첫 번째 날
    const dayOffset = firstDay.getDay(); // 월의 첫날 요일 (0: 일요일, 1: 월요일, ...)
    return Math.ceil((date.getDate() + dayOffset) / 7); // 몇 번째 주인지 계산
  };

  return (
    <div className="flex justify-center items-center max-w-4xl mx-auto mt-10 px-1 space-x-4">
      <button onClick={() => handleWeekChange(-1)} className="text-[#FFA41D] text-lg font-bold">
        {"<"}
      </button>
      <span className="text-gray-800 font-semibold text-base">
        {`${currentMonday.getFullYear()}년 ${currentMonday.getMonth() + 1}월 ${getWeekOfMonth(currentMonday)}주 리포트`}
      </span>
      <button onClick={() => handleWeekChange(1)} className="text-[#FFA41D] text-lg font-bold">
        {">"}
      </button>
    </div>
  );
};

export default DateNavigationBar;
