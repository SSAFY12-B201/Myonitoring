import React, { useState } from "react";
import Switch from "react-switch";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import TopBar from "../../components/TopBar";
import ContentSection from "../../components/ContentSection";
import BottomBar from "../../components/BottomBar";
import {
  toggleReservation,
  addReservation,
  deleteReservation,
  updateReservation,
} from "../../redux/slices/reservationsSlice";
<<<<<<< HEAD
=======
import BottomBar from "../../components/BottomBar";
>>>>>>> dev
import { PlusIcon } from "@heroicons/react/outline";

// 시간 형식 변환 함수
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

interface Reservation {
  id: string;
  time: string;
  amount: number;
  isActive: boolean;
}

const Reservation: React.FC = () => {
  const dispatch = useAppDispatch();
  const reservations = useAppSelector(
    (state) => state.reservation.reservations
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 수정 모달 상태
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // 추가 모달 상태
  const [editingReservation, setEditingReservation] =
    useState<Reservation | null>(null); // 수정 중인 예약 상태
  const [newReservation, setNewReservation] = useState({
    time: "",
    amount: "",
    isActive: true,
  }); // 새 예약 데이터

  const totalAmount = reservations.reduce(
    (sum, r) => (r.isActive ? sum + r.amount : sum),
    0
  );

  const handleToggle = (id: string) => {
    dispatch(toggleReservation(id));
  };

  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingReservation) {
      dispatch(updateReservation(editingReservation));
    }
    setIsEditModalOpen(false);
    setEditingReservation(null);
  };

  const handleAdd = () => {
    if (newReservation.time && newReservation.amount) {
      dispatch(
        addReservation({
          time: newReservation.time,
          amount: Number(newReservation.amount),
          isActive: true,
        })
      );
      setNewReservation({ time: "", amount: "", isActive: true });
      setIsAddModalOpen(false);
    }
  };

  const handleDelete = (id: string) => {
    dispatch(deleteReservation(id));
  };

  return (
    <div
      className="min-h-screen flex flex-col pb-[60px] bg-cover bg-center"
      style={{ backgroundImage: "url('/gradient_background.png')" }}
    >
      {/* 상단 바 */}
      <TopBar />

      <ContentSection>
        {/* 총 예약 정보 */}
        <div className="bg-white w-60 mx-auto rounded-lg border border-gray-200 p-6 mb-12 text-center">
          <h1 className="text-xl font-bold mb-4">총 {totalAmount}g 예약</h1>
          <button
            onClick={() => setIsAddModalOpen(true)} // 추가 모달 열기
            className="inline-flex items-center px-5 py-2 bg-yellow text-black rounded-full"
          >
            <PlusIcon className="h-5 w-5 text-black mr-2" />
            일정 추가
          </button>
        </div>

        {/* 예약 리스트 */}
        <div>
          {reservations.map((reservation) => (
            <ReservationItem
              key={reservation.id}
              reservation={reservation}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </ContentSection>

      <BottomBar />

      {/* 수정 모달 */}
      {isEditModalOpen && editingReservation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-700 bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-[85%] max-w-lg mx-auto border border-gray-300">
            <h2 className="text-xl font-bold mb-4 text-center">예약 수정</h2>

            {/* 시간 설정 */}
            <div className="mb-6">
              <label htmlFor="edit-time" className="block text-gray-700 font-bold mb-2">
                시간
              </label>
              <input
                id="edit-time"
                type="time"
                value={editingReservation.time}
                onChange={(e) =>
                  setEditingReservation({
                    ...editingReservation,
                    time: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            {/* 급식량 설정 */}
            <div className="mb-6">
              <label htmlFor="edit-amount" className="block text-gray-700 font-bold mb-2">
                급식량 (g)
              </label>
              <input
                id="edit-amount"
                type="number"
                value={editingReservation.amount}
                onChange={(e) =>
                  setEditingReservation({
                    ...editingReservation,
                    amount: Number(e.target.value),
                  })
                }
                min={1}
                max={100}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            {/* 버튼 섹션 */}
            <div className="flex justify-between">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="py-2 px-4 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              >
                취소하기
              </button>
              <button
                onClick={handleSaveEdit}
                className="py-2 px-4 bg-yellow text-black rounded-lg hover:bg-yellow-500"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 추가 모달 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-700 bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-[85%] max-w-lg mx-auto border border-gray-300">
            <h2 className="text-xl font-bold mb-4 text-center">일정 추가</h2>

            {/* 시간 설정 */}
            <div className="mb-6">
              <label htmlFor="add-time" className="block text-gray-700 font-bold mb-2">
                시간
              </label>
              <input
                id="add-time"
                type="time"
                value={newReservation.time}
                onChange={(e) =>
                  setNewReservation({ ...newReservation, time: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            {/* 급식량 설정 */}
            <div className="mb-6">
              <label htmlFor="add-amount" className="block text-gray-700 font-bold mb-2">
                급식량 (g)
              </label>
              <input
                id="add-amount"
                type="number"
                value={newReservation.amount}
                onChange={(e) =>
                  setNewReservation({
                    ...newReservation,
                    amount: e.target.value,
                  })
                }
                min={1}
                max={100}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            {/* 버튼 섹션 */}
            <div className="flex justify-between">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="py-2 px-4 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              >
                취소하기
              </button>
              <button
                onClick={handleAdd}
                className="py-2 px-4 bg-yellow text-black rounded-lg hover:bg-yellow-500"
              >
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ReservationItemProps {
  reservation: Reservation;
  onToggle: (id: string) => void;
  onEdit: (reservation: Reservation) => void;
  onDelete: (id: string) => void;
}

const ReservationItem: React.FC<ReservationItemProps> = ({
  reservation,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const [translateX, setTranslateX] = useState(0);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.currentTarget.dataset.startX = e.touches[0].clientX.toString();
    setTranslateX(0);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const startX = parseFloat(e.currentTarget.dataset.startX || "0");
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;

    if (deltaX < -30) {
      setTranslateX(deltaX);
    }
  };

  const handleTouchEnd = () => {
    if (translateX <= -100) {
      setTranslateX(-100);
    } else {
      setTranslateX(0);
    }
  };

  // 시간 변환 처리
  const { period, formattedTime } = formatTimeTo12Hour(reservation.time);

  return (
    <div className="relative w-full overflow-hidden">
      {/* 삭제 버튼 */}
      {translateX <= -100 && (
        <button
          onClick={() => onDelete(reservation.id)}
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
        onClick={() => onEdit(reservation)}
      >
        {/* 시간 정보 */}
        <div className="flex items-center space-x-2">
          {/* 오전/오후 정보 */}
          <span
            className={`text-xs mt-1 ${
              reservation.isActive ? "text-gray-500" : "text-gray-300"
            }`}
          >
            {period}
          </span>
          {/* 시각 숫자 */}
          <span
            className={`text-xl font-bold ${
              reservation.isActive ? "text-black" : "text-gray-300"
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
              reservation.isActive ? "text-black" : "text-gray-300"
            }`}
          >
            {reservation.amount}g
          </p>

          {/* 토글 버튼 */}
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
    </div>
  );
};

export default Reservation;
