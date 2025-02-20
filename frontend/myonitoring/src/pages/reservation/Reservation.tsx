import React, { useState, useEffect } from "react";
import { api } from "../../api/axios";
import TopBar from "../../components/TopBar";
import ContentSection from "../../components/ContentSection";
import BottomBar from "../../components/BottomBar";
import ReservationItem from "./ReservationItem";
import ReservationModal from "./ReservationModal";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  setReservations,
  addReservation,
  toggleReservation,
  updateReservationDetails,
  deleteReservation,
} from "../../redux/slices/reservationsSlice";

// Reservation 인터페이스 정의
interface Reservation {
  id: string;
  scheduledTime: string; // 예약 시간 (24시간 형식)
  scheduledAmount: number; // 급식량
  isActive: boolean; // 활성화 여부
}

const Reservation: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedCatId = useAppSelector((state) => state.cat.selectedCatId); // Redux에서 selectedCatId 가져오기

  // 현재 선택된 고양이의 예약 데이터 가져오기
  const reservations = useAppSelector((state) =>
    selectedCatId
      ? state.reservation.reservationsByCat[selectedCatId] || []
      : []
  );

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

  // 예약 조회 API 호출 함수
  const fetchReservations = async () => {
    try {
      if (!selectedCatId) {
        setError("선택된 고양이가 없습니다. 고양이를 선택해주세요.");
        return;
      }

      const token = localStorage.getItem("jwt_access_token");
      const response = await api.get(`/api/schedule/${selectedCatId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      // 응답 데이터 변환 및 Redux 상태 업데이트
      const fetchedReservations: Reservation[] = response.data.map(
        (item: any) => ({
          id: item.id.toString(),
          scheduledTime: item.time,
          scheduledAmount: item.amount,
          isActive: item.isActive,
        })
      );

      dispatch(
        setReservations({
          catId: selectedCatId,
          reservations: fetchedReservations,
        })
      );

      setError(null); // 에러 초기화
    } catch (err) {
      console.error("Failed to fetch reservations:", err);
      setError("예약 조회에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 컴포넌트 마운트 시 예약 조회 호출
  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCatId]);

  // API 요청 함수 - 예약 추가
  const handleAddReservation = async (reservation: Omit<Reservation, "id">) => {
    try {
      if (!selectedCatId) {
        setError("선택된 고양이가 없습니다. 고양이를 선택해주세요.");
        return;
      }

      const token = localStorage.getItem("jwt_access_token");

      const scheduledTime = formatTimeWithSeconds(reservation.scheduledTime);

      // API 요청 데이터 변환
      const requestData = {
        scheduledTime,
        scheduledAmount: reservation.scheduledAmount,
      };

      await api.post(`/api/schedule/${selectedCatId}`, requestData, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      await fetchReservations(); // 예약 조회를 통해 Redux 상태 동기화

      setError(null); // 에러 초기화
    } catch (err) {
      console.error("Failed to add reservation:", err);
      setError("예약 추가에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleToggleReservation = async (
    id: string,
    isActive: boolean
  ): Promise<void> => {
    try {
      if (!selectedCatId) {
        setError("선택된 고양이가 없습니다. 고양이를 선택해주세요.");
        return;
      }

      const token = localStorage.getItem("jwt_access_token");
      await api.put(
        `/api/schedule/detail/${id}/active`, // API 엔드포인트
        { isActive }, // 활성화 여부 데이터
        { headers: { Authorization: token ? `Bearer ${token}` : "" } }
      );

      dispatch(toggleReservation({ catId: selectedCatId, id, isActive })); // Redux 상태 업데이트
    } catch (err) {
      console.error("Failed to toggle reservation:", err);
      setError("예약 활성화 상태 변경에 실패했습니다.");
    }
  };

  const handleUpdateReservation = async (
    id: string,
    updates: { scheduledTime?: string; scheduledAmount?: number }
  ): Promise<void> => {
    try {
      if (!selectedCatId) {
        setError("선택된 고양이가 없습니다. 고양이를 선택해주세요.");
        return;
      }

      const token = localStorage.getItem("jwt_access_token");

      const requestData = {
        ...(updates.scheduledTime && {
          scheduledTime: formatTimeWithSeconds(updates.scheduledTime),
        }),
        ...(updates.scheduledAmount && {
          scheduledAmount: updates.scheduledAmount,
        }),
      };

      await api.put(`/api/schedule/detail/${id}`, requestData, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      dispatch(
        updateReservationDetails({ catId: selectedCatId, id, ...updates })
      );
    } catch (err) {
      console.error("Failed to update reservation:", err);
      setError("예약 수정에 실패했습니다.");
    }
  };

  const handleSave = async (
    reservation: Omit<Reservation, "id">
  ): Promise<void> => {
    if (modalMode === "edit" && currentReservation) {
      await handleUpdateReservation(currentReservation.id, reservation);
    } else if (modalMode === "add") {
      await handleAddReservation(reservation);
    }
    setIsModalOpen(false);
    setCurrentReservation(null);
  };

  const handleToggle = (id: string): void => {
    const reservation = reservations.find((r) => r.id === id);
    if (reservation) {
      handleToggleReservation(id, !reservation.isActive);
    }
  };

  const handleEdit = (reservation: Reservation): void => {
    setCurrentReservation(reservation);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleAdd = (): void => {
    setCurrentReservation(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      if (!selectedCatId) {
        setError("선택된 고양이가 없습니다. 고양이를 선택해주세요.");
        return;
      }

      const token = localStorage.getItem("jwt_access_token");
      await api.delete(`/api/schedule/detail/${id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      dispatch(deleteReservation({ catId: selectedCatId, id }));
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
        <div className="bg-white w-60 mx-auto rounded-lg border shadow-sm border-gray-200 p-6 mb-10 text-center">
          <h1 className="text-xl font-bold mb-4">총 {totalAmount}g 예약</h1>
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-5 py-2 custom-tap rounded-full"
          >
            일정 추가하기
          </button>
        </div>

        {/* 예약 내역이 없을 경우 */}
        {reservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-24 h-full">
            <img
              src="/Cat.png"
              alt="로고 이미지"
              className="w-35 h-32 animate-fade-in"
            />
            <h1 className="text-sm text-gray-600 mt-6">
              배급 예약이 없습니다.
            </h1>
          </div>
        ) : (
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
        )}
      </ContentSection>

      <BottomBar />

      <ReservationModal
        isOpen={isModalOpen}
        mode={modalMode}
        reservationData={currentReservation}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      {error && (
        <div className="fixed bottom-0 left-0 w-full bg-red-500 text-white text-center py-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default Reservation;
