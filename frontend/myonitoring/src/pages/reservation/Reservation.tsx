import React, { useState } from "react";
import { api } from "../../api/axios";
import TopBar from "../../components/TopBar";
import ContentSection from "../../components/ContentSection";
import BottomBar from "../../components/BottomBar";
import ReservationItem from "./ReservationItem";
import ReservationModal from "./ReservationModal";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  addReservation,
  toggleReservation,
  updateReservationDetails,
  deleteReservation,
} from "../../redux/slices/reservationsSlice";
import { log } from "console";

// Reservation 인터페이스 정의
interface Reservation {
  id: string;
  scheduledTime: string; // 예약 시간 (24시간 형식)
  scheduledAmount: number; // 급식량
  isActive: boolean; // 활성화 여부
}

const Reservation: React.FC = () => {
  const dispatch = useAppDispatch();
  const reservations = useAppSelector(
    (state) => state.reservation.reservations as Reservation[]
  );
  const selectedCatId = useAppSelector((state) => state.cat.selectedCatId); // Redux에서 selectedCatId 가져오기

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentReservation, setCurrentReservation] =
    useState<Reservation | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 총 예약량 계산
  const totalAmount = reservations.reduce(
    (sum, r) => (r.isActive ? sum + r.scheduledAmount : sum),
    0
  );

  // 시간 형식을 "HH:mm:ss"로 변환하는 함수
  const formatTimeWithSeconds = (time: string): string => {
    if (time.length === 5) {
      return `${time}:00`; // "HH:mm" -> "HH:mm:ss"
    }
    return time; // 이미 초 단위가 포함된 경우 그대로 반환
  };

  // API 요청 함수 - 예약 추가
  const handleAddReservation = async (reservation: Omit<Reservation, "id">) => {
    try {
      console.log(`선택된 고양이 id: ${selectedCatId}`);
      if (!selectedCatId) {
        setError("선택된 고양이가 없습니다. 고양이를 선택해주세요.");
        return;
      }

      const token = localStorage.getItem("jwt_access_token");
      console.log(token);

      const scheduledTime = formatTimeWithSeconds(reservation.scheduledTime);
      if (!scheduledTime) {
        throw new Error("예약 시간이 유효하지 않습니다.");
      }

      // API 요청 데이터 변환
      const requestData = {
        scheduledTime: formatTimeWithSeconds(reservation.scheduledTime), // 초 단위 추가
        scheduledAmount: reservation.scheduledAmount,
      };
      console.log(requestData);

      const response = await api.post(
        `/api/schedule/${selectedCatId}`,
        requestData,
        {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        }
      );

      const newReservation = response.data;

      // Redux 상태 업데이트 (응답 데이터를 Redux 상태 형식으로 변환)
      dispatch(
        addReservation({
          id: newReservation.id,
          scheduledTime: newReservation.scheduledTime,
          scheduledAmount: newReservation.scheduledAmount,
          isActive: newReservation.isActive,
        })
      );

      setError(null); // 에러 초기화
    } catch (err) {
      console.error("Failed to add reservation:", err);
      setError("예약 추가에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // API 요청 함수 - 활성화 여부 토글
  const handleToggleReservation = async (id: string, isActive: boolean) => {
    try {
      if (!selectedCatId) {
        setError("선택된 고양이가 없습니다. 고양이를 선택해주세요.");
        return;
      }

      const token = localStorage.getItem("jwt_access_token");
      await api.put(
        `/api/schedule/${id}/active`,
        { isActive },
        { headers: { Authorization: token ? `Bearer ${token}` : "" } }
      );

      dispatch(toggleReservation({ id, isActive }));
    } catch (err) {
      console.error("Failed to toggle reservation:", err);
      setError("예약 활성화 상태 변경에 실패했습니다.");
    }
  };

  // API 요청 함수 - 예약 수정
  const handleUpdateReservation = async (
    id: string,
    updates: { scheduledTime?: string; scheduledAmount?: number }
  ) => {
    try {
      if (!selectedCatId) {
        setError("선택된 고양이가 없습니다. 고양이를 선택해주세요.");
        return;
      }

      const token = localStorage.getItem("jwt_access_token");

      // API 요청 데이터 변환
      const requestData = {
        ...(updates.scheduledTime && {
          scheduledTime: formatTimeWithSeconds(updates.scheduledTime), // 초 단위 추가
        }),
        ...(updates.scheduledAmount && {
          scheduledAmount: updates.scheduledAmount,
        }),
      };

      await api.put(`/api/schedule/${id}`, requestData, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      dispatch(updateReservationDetails({ id, ...updates }));
    } catch (err) {
      console.error("Failed to update reservation:", err);
      setError("예약 수정에 실패했습니다.");
    }
  };

  // 예약 저장 핸들러
  const handleSave = async (
    reservation: Omit<Reservation, "id">
  ): Promise<void> => {
    if (modalMode === "edit" && currentReservation) {
      await handleUpdateReservation(currentReservation.id, reservation); // 수정 API 호출
    } else if (modalMode === "add") {
      await handleAddReservation(reservation); // 생성 API 호출
    }
    setIsModalOpen(false);
    setCurrentReservation(null);
  };

  // 활성화 여부 토글 핸들러
  const handleToggle = async (id: string): Promise<void> => {
    const reservation = reservations.find((r) => r.id === id);
    if (reservation) {
      await handleToggleReservation(id, !reservation.isActive); // API 호출 및 Redux 업데이트
    }
  };

  // 예약 수정 핸들러
  const handleEdit = (reservation: Reservation): void => {
    setCurrentReservation(reservation);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  // 예약 추가 핸들러
  const handleAdd = (): void => {
    setCurrentReservation(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  // 예약 삭제 핸들러
  const handleDelete = async (id: string): Promise<void> => {
    try {
      if (!selectedCatId) {
        setError("선택된 고양이가 없습니다. 고양이를 선택해주세요.");
        return;
      }

      const token = localStorage.getItem("jwt_access_token");
      await api.delete(`/api/schedule/${id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      dispatch(deleteReservation(id)); // Redux 상태 업데이트
    } catch (err) {
      console.error("Failed to delete reservation:", err);
      setError("예약 삭제에 실패했습니다.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col pb-[60px] bg-cover bg-center"
      style={{ backgroundImage: "url('/gradient_background.png')" }}
    >
      <TopBar />
      <ContentSection>
        {/* 총 예약 정보 */}
        <div className="bg-white w-60 mx-auto rounded-lg border border-gray-200 p-6 mb-10 text-center">
          <h1 className="text-xl font-bold mb-4">총 {totalAmount}g 예약</h1>
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-5 py-2 bg-yellow text-black rounded-full"
          >
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

      {/* 모달 */}
      <ReservationModal
        isOpen={isModalOpen}
        mode={modalMode}
        reservationData={currentReservation}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      {/* 에러 메시지 */}
      {error && (
        <div className="fixed bottom-0 left-0 w-full bg-red-500 text-white text-center py-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default Reservation;
