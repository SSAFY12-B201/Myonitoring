import React from "react";

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
  const [scheduledTime, setScheduledTime] = React.useState<string>(
    reservationData?.scheduledTime || ""
  );
  const [scheduledAmount, setScheduledAmount] = React.useState<number>(
    reservationData?.scheduledAmount || 0
  );

  const handleSave = () => {
    if (!scheduledTime || scheduledAmount <= 0) {
      console.error("유효하지 않은 예약 데이터:", { scheduledTime, scheduledAmount });
      return;
    }
  
    const updatedReservation = {
      scheduledTime,
      scheduledAmount,
      isActive: true, // 기본 활성 상태
    };
  
    onSave(updatedReservation);
    onClose();
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
            onChange={(e) => setScheduledAmount(Number(e.target.value))}
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
            className="py-2 px-4 bg-yellow text-black rounded-lg hover:bg-yellow-500"
          >
            {mode === "add" ? "추가하기" : "저장하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
