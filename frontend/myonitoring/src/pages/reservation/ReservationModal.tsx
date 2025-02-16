import React, { useEffect } from "react";

interface Reservation {
  id: string;
  scheduledTime: string; // 기존 time -> scheduledTime
  scheduledAmount: number; // 기존 amount -> scheduledAmount
  isActive: boolean;
}

interface ReservationModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  reservationData: Reservation | null; // 수정 시 전달되는 데이터
  onClose: () => void;
  onSave: (reservation: Omit<Reservation, "id">) => void; // 저장 핸들러
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  mode,
  reservationData,
  onClose,
  onSave,
}) => {
  const [scheduledTime, setScheduledTime] = React.useState<string>("");
  const [scheduledAmount, setScheduledAmount] = React.useState<string>("");

  // 모달 열릴 때 입력값 초기화
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && reservationData) {
        // 수정 모드일 경우 기존 예약 데이터를 입력값으로 설정
        setScheduledTime(reservationData.scheduledTime);
        setScheduledAmount(reservationData.scheduledAmount.toString());
      } else if (mode === "add") {
        // 추가 모드일 경우 입력값 초기화
        setScheduledTime("");
        setScheduledAmount("");
      }
    }
  }, [isOpen, mode, reservationData]);

  const handleSave = () => {
    const amount = Number(scheduledAmount);

    if (!scheduledTime || amount <= 0) {
      console.error("유효하지 않은 예약 데이터:", { scheduledTime, amount });
      return;
    }

    const updatedReservation = {
      scheduledTime,
      scheduledAmount: amount,
      isActive: reservationData?.isActive ?? true, // 기본 활성 상태 유지 (수정 모드) 또는 기본 활성화 (추가 모드)
    };

    onSave(updatedReservation);
    onClose();
  };

  // 입력값 유효성 검사
  const isFormValid = (): boolean => {
    const amount = Number(scheduledAmount);
    return !!scheduledTime && amount > 0 && !isNaN(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-700 bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-[85%] max-w-lg mx-auto border border-gray-300">
        <h2 className="text-xl font-bold mb-4 text-center">
          {mode === "add" ? "일정 추가" : "예약 수정"}
        </h2>

        {/* 시간 설정 */}
        <div className="mb-6">
          <label htmlFor="modal-time" className="block text-gray-700 font-bold mb-2">
            시간
          </label>
          <input
            id="modal-time"
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        {/* 급식량 설정 */}
        <div className="mb-6">
          <label htmlFor="modal-amount" className="block text-gray-700 font-bold mb-2">
            급식량 (g)
          </label>
          <input
            id="modal-amount"
            type="number"
            value={scheduledAmount}
            onChange={(e) => setScheduledAmount(e.target.value)} // 문자열로 처리
            min={1}
            max={100}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        {/* 버튼 섹션 */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
          >
            취소하기
          </button>
          <button
            onClick={handleSave}
            disabled={!isFormValid()} // 유효하지 않으면 버튼 비활성화
            className={`py-2 px-4 rounded-lg ${
              isFormValid() ? "bg-yellow text-black hover:bg-yellow-500" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {mode === "add" ? "추가하기" : "저장하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
