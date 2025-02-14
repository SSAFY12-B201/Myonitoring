import React from "react";

interface Reservation {
  id: string;
  time: string;
  amount: number;
  isActive: boolean;
}

interface ReservationModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  reservationData: Reservation | null; // 수정 시 전달되는 데이터
  onClose: () => void;
  onSave: (reservation: Reservation) => void; // 저장 핸들러
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  mode,
  reservationData,
  onClose,
  onSave,
}) => {
  const [time, setTime] = React.useState<string>(reservationData?.time || "");
  const [amount, setAmount] = React.useState<number>(
    reservationData?.amount || 0
  );

  const handleSave = () => {
    if (time && amount > 0) {
      const updatedReservation = {
        ...reservationData,
        time,
        amount,
        isActive: true, // 기본 활성 상태
      } as Reservation;
      onSave(updatedReservation);
      onClose();
    }
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
            value={time}
            onChange={(e) => setTime(e.target.value)}
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
