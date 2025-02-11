import React, { useState } from "react";
import Switch from "react-switch"; // react-switch 라이브러리 import
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import TopBar from "../../components/TopBar";
import ContentSection from "../../components/ContentSection";
import {
  toggleReservation,
  addReservation,
  deleteReservation,
} from "../../redux/slices/reservationsSlice";
import BottomBar from "../../components/BottomBar";
import { PlusIcon } from "@heroicons/react/outline";

// 24시간 형식을 12시간 형식으로 변환하는 함수
const formatTimeTo12Hour = (
  time: string
): { period: string; formattedTime: string } => {
  const [hour, minute] = time.split(":").map(Number);
  const period = hour >= 12 ? "오후" : "오전";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return {
    period,
    formattedTime: `${formattedHour}:${minute.toString().padStart(2, "0")}`,
  };
};

const Reservation: React.FC = () => {
  const dispatch = useAppDispatch();
  const reservations = useAppSelector(
    (state) => state.reservation.reservations
  );

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [time, setTime] = useState("06:00"); // 예약 시간 상태
  const [amount, setAmount] = useState(20); // 급식량 상태

  const totalAmount = reservations.reduce(
    (sum, r) => (r.isActive ? sum + r.amount : sum),
    0
  );

  const handleToggle = (id: string) => {
    dispatch(toggleReservation(id));
  };

  const handleSave = () => {
    // Redux 상태에 새 예약 추가
    dispatch(
      addReservation({
        time,
        amount,
        isActive: true, // 새 예약은 기본적으로 활성화 상태로 추가
      })
    );
    setIsModalOpen(false); // 모달 닫기
  };

  const handleDelete = (id: string) => {
    dispatch(deleteReservation(id)); // Redux 상태에서 예약 삭제
  };

  return (
    <div
      className="min-h-screen flex flex-col pb-[60px] bg-cover bg-center"
      style={{ backgroundImage: "url('/gradient_background.png')" }}
    >
      {/* 상단 바 */}
      <TopBar />

      <ContentSection>
        {/* 예약 정보 섹션 */}
        <div className="bg-white w-60 mx-auto rounded-lg border border-gray-200 p-6 mb-12 text-center">
          <h1 className="text-xl font-bold mb-4">총 {totalAmount}g 예약</h1>
          <button
            onClick={() => setIsModalOpen(true)} // 모달 열기
            className="inline-flex items-center px-5 py-2 bg-yellow text-black rounded-full"
          >
            <PlusIcon className="h-5 w-5 text-black mr-2" />
            일정
          </button>
        </div>

        {/* 예약 리스트 */}
        <div>
          {reservations.map((reservation) => (
            <ReservationItem
              key={reservation.id}
              id={reservation.id}
              time={reservation.time}
              amount={reservation.amount}
              isActive={reservation.isActive}
              onToggle={handleToggle}
              onDelete={handleDelete} // 삭제 핸들러 전달
            />
          ))}
        </div>
      </ContentSection>

      <BottomBar />
      {/* 예약 설정 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-700 bg-opacity-50">
          {/* 모달 전체를 감싸는 컨테이너 */}
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-[85%] max-w-lg mx-auto border border-gray-300">
            <h2 className="text-xl font-bold mb-4 text-center">예약 설정</h2>

            {/* 시간 설정 */}
            <div className="mb-6">
              <label
                htmlFor="time"
                className="block text-gray-700 font-bold mb-2"
              >
                시간
              </label>
              <input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            {/* 급식량 설정 */}
            <div className="mb-6">
              <label
                htmlFor="amount"
                className="block text-gray-700 font-bold mb-2"
              >
                급식량 (g)
              </label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={1}
                max={100}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            {/* 버튼 섹션 */}
            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)} // 모달 닫기
                className="py-2 px-4 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              >
                취소하기
              </button>
              <button
                onClick={handleSave} // 저장 로직 실행
                className="py-2 px-4 bg-yellow text-black rounded-lg hover:bg-yellow-500"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ReservationItemProps 타입 정의
interface ReservationItemProps {
  id: string;
  time: string;
  amount: number;
  isActive: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

// ReservationItem 컴포넌트 내장
const ReservationItem: React.FC<ReservationItemProps> = ({
  id,
  time,
  amount,
  isActive,
  onToggle,
  onDelete,
}) => {
  const [translateX, setTranslateX] = useState(0); // 슬라이드 거리 상태

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.currentTarget.dataset.startX = e.touches[0].clientX.toString();
    setTranslateX(0);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const startX = parseFloat(e.currentTarget.dataset.startX || "0");
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;

    if (deltaX < -30) {
      // 왼쪽으로 슬라이드할 때만 동작하도록 설정
      setTranslateX(deltaX);
    }
  };

  const handleTouchEnd = () => {
    if (translateX <= -100) {
      // 슬라이드가 충분히 이루어진 경우 삭제 버튼 표시 위치로 고정
      setTranslateX(-100);
    } else {
      // 그렇지 않으면 원래 위치로 복원
      setTranslateX(0);
    }
  };

  // 시간 형식을 변환하는 함수 호출
  const { period, formattedTime } = formatTimeTo12Hour(time);

  return (
    <div className="relative w-full overflow-hidden">
      {/* 삭제 버튼 */}
      {translateX <= -100 && (
        <button
          onClick={() => onDelete(id)}
          className="absolute right-[4px] top-[4px] bottom-[4px] w-[100px] mb-4 bg-red-500 text-white font-bold rounded-lg flex items-center justify-center"
        >
          삭제하기
        </button>
      )}

      {/* 예약 정보 */}
      <div
        className={`flex items-center justify-between p-4 mb-4 bg-white rounded-lg border border-gray-200 shadow-sm transform transition-transform`}
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 시간 정보 */}
        <div className="flex items-center space-x-2">
          {/* 오전/오후 정보 */}
          <span
            className={`text-xs mt-1 ${
              isActive ? "text-gray-500" : "text-gray-300"
            }`}
          >
            {period}
          </span>
          {/* 시각 숫자 */}
          <span
            className={`text-xl font-bold ${
              isActive ? "text-black" : "text-gray-300"
            }`}
          >
            {formattedTime}
          </span>
        </div>

        {/* 급식량과 토글 버튼 */}
        <div className="flex items-center space-x-2">
          {/* 급식량 정보 */}
          <p
            className={`text-lg me-3 ${
              isActive ? "text-black" : "text-gray-300"
            }`}
          >
            {amount}g
          </p>

          {/* react-switch 토글 버튼 */}
          <Switch
            checked={isActive}
            onChange={() => onToggle(id)}
            onColor="#FFE76B" // 활성화 배경색 (노란색)
            offColor="#E5E5E5" // 비활성화 배경색 (회색)
            handleDiameter={22} // 핸들 크기
            uncheckedIcon={false} // 비활성화 상태에서 아이콘 제거
            checkedIcon={false} // 활성화 상태에서 아이콘 제거
            height={28} // 토글 높이
            width={48} // 토글 너비
          />
        </div>
      </div>
    </div>
  );
};

export default Reservation;
