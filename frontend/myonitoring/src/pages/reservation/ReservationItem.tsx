import React, { useState } from "react";
import Switch from "react-switch";

// 예약 데이터 타입 정의
interface Reservation {
  id: string;
  scheduledTime: string; // 기존 time -> scheduledTime
  scheduledAmount: number; // 기존 amount -> scheduledAmount
  isActive: boolean; // 활성화 여부
}

// ReservationItem 컴포넌트의 props 타입 정의
interface ReservationItemProps {
  reservation: Reservation;
  onToggle: (id: string) => void;
  onEdit: (reservation: Reservation) => void;
  onDelete: (id: string) => void;
}

// 시간 포맷 변환 함수 (24시간 -> 12시간 형식)
const formatTimeTo12Hour = (
  time: string
): { period: string; formattedTime: string } => {
  const [hour, minute] = time.split(":").map(Number);
  const period = hour >= 12 ? "오후" : "오전";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return { period, formattedTime: `${formattedHour}:${minute.toString().padStart(2, "0")}` };
};

// 예약 항목 컴포넌트
const ReservationItem: React.FC<ReservationItemProps> = ({
  reservation,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const [translateX, setTranslateX] = useState<number>(0); // 스와이프 이동 상태

  // 터치 시작 핸들러
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    e.currentTarget.dataset.startX = e.touches[0].clientX.toString();
    setTranslateX(0);
  };

  // 터치 이동 핸들러
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>): void => {
    const startX = parseFloat(e.currentTarget.dataset.startX || "0");
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;

    if (deltaX < -30) setTranslateX(deltaX); // 왼쪽으로 스와이프
  };

  // 터치 종료 핸들러
  const handleTouchEnd = (): void => {
    if (translateX <= -100) setTranslateX(-100); // 삭제 버튼 노출
    else setTranslateX(0); // 원래 위치로 복귀
  };

  const { period, formattedTime } = formatTimeTo12Hour(reservation.scheduledTime);

  return (
    <div className="relative w-full overflow-hidden">
      {/* 예약 항목 */}
      <div
        className="flex items-center justify-between p-4 h-20 mb-5 bg-white rounded-lg border shadow-sm transform transition-transform"
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => onEdit(reservation)}
      >
        <div className="flex items-center space-x-2">
          <span className={`text-xs mt-1 ${reservation.isActive ? "text-gray-500" : "text-gray-300"}`}>
            {period}
          </span>
          <span className={`text-xl font-bold ${reservation.isActive ? "text-black" : "text-gray-300"}`}>
            {formattedTime}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <p className={`text-lg me-3 ${reservation.isActive ? "text-black" : "text-gray-300"}`}>
            {reservation.scheduledAmount}g
          </p>
          <Switch
            checked={reservation.isActive}
            onChange={() => onToggle(reservation.id)}
            offColor="#E5E5E5"
            onColor="#FFE76B"
            uncheckedIcon={false}
            checkedIcon={false}
            height={28}
            width={48}
          />
        </div>
      </div>

      {/* 삭제 버튼 */}
      {translateX <= -100 && (
        <button
          onClick={() => onDelete(reservation.id)}
          className="absolute right-0 top-0 h-20 w-[85px] bg-red-500 text-white text-sm font-medium rounded-md flex items-center justify-center shadow-md"
        >
          삭제하기
        </button>
      )}
    </div>
  );
};

export default ReservationItem;
