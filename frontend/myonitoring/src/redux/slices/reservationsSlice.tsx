import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 예약 정보 타입 정의
export interface Reservation {
  id: string; // 고유 ID
  time: string; // 예약 시간 (24시간 형식, 예: "06:00")
  amount: number; // 급식량 (그램 단위)
  isActive: boolean; // 활성화 여부
}

interface ReservationState {
  reservations: Reservation[]; // 예약 목록
}

// 초기 상태
const initialState: ReservationState = {
  reservations: [
    { id: "1", time: "06:00", amount: 20, isActive: true },
    { id: "2", time: "09:00", amount: 20, isActive: true },
    { id: "3", time: "15:00", amount: 20, isActive: true },
  ],
};

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    // 예약 추가 (추가 후 정렬)
    addReservation(state, action: PayloadAction<Omit<Reservation, "id">>) {
      const newReservation = {
        id: Date.now().toString(), // 고유 ID 생성
        ...action.payload,
      };
      state.reservations.push(newReservation);

      // 시간 기준 오름차순 정렬
      state.reservations.sort((a, b) => a.time.localeCompare(b.time));
    },

    // 예약 수정
    updateReservation(state, action: PayloadAction<Reservation>) {
      const index = state.reservations.findIndex(
        (r) => r.id === action.payload.id
      );
      if (index !== -1) {
        state.reservations[index] = action.payload;
      }

      // 시간 기준 오름차순 정렬
      state.reservations.sort((a, b) => a.time.localeCompare(b.time));
    },

    // 활성화/비활성화 토글
    toggleReservation(state, action: PayloadAction<string>) {
      const index = state.reservations.findIndex((r) => r.id === action.payload);
      if (index !== -1) {
        state.reservations[index].isActive = !state.reservations[index].isActive;
      }
    },

    // 예약 삭제
    deleteReservation(state, action: PayloadAction<string>) {
      state.reservations = state.reservations.filter(
        (r) => r.id !== action.payload
      );
    },

    // 모든 예약 초기화
    resetReservations() {
      return initialState;
    },
  },
});

export const {
  addReservation,
  updateReservation,
  toggleReservation,
  deleteReservation,
  resetReservations,
} = reservationSlice.actions;

export default reservationSlice.reducer;
