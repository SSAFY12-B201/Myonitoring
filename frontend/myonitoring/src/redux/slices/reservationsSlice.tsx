import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Reservation 인터페이스 정의 (Reservation 컴포넌트 기준)
interface Reservation {
  id: string;
  scheduledTime: string; // 기존 time -> scheduledTime
  scheduledAmount: number; // 기존 amount -> scheduledAmount
  isActive: boolean;
}

interface ReservationState {
  reservations: Reservation[];
}

// 초기 상태에 더미 데이터 추가
const initialState: ReservationState = {
  reservations: [],
};

const reservationsSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    // 서버에서 반환된 예약 데이터를 Redux 상태에 추가
    addReservation(state, action: PayloadAction<Reservation>) {
      state.reservations.push(action.payload); // 서버에서 반환된 데이터 그대로 추가
    },

    // 활성화 여부 토글 (isActive 상태만 업데이트)
    toggleReservation(
      state,
      action: PayloadAction<{ id: string; isActive: boolean }>
    ) {
      const reservation = state.reservations.find(
        (res) => res.id === action.payload.id
      );
      if (reservation) {
        reservation.isActive = action.payload.isActive; // 서버에서 반환된 활성화 상태로 업데이트
      }
    },

    // 배급 시간 및 배급량 수정
    updateReservationDetails(
      state,
      action: PayloadAction<{
        id: string;
        scheduledTime?: string;
        scheduledAmount?: number;
      }>
    ) {
      const reservation = state.reservations.find(
        (res) => res.id === action.payload.id
      );
      if (reservation) {
        if (action.payload.scheduledTime !== undefined) {
          reservation.scheduledTime = action.payload.scheduledTime; // 시간 업데이트
        }
        if (action.payload.scheduledAmount !== undefined) {
          reservation.scheduledAmount = action.payload.scheduledAmount; // 배급량 업데이트
        }
      }
    },

    // 예약 삭제
    deleteReservation(state, action: PayloadAction<string>) {
      state.reservations = state.reservations.filter(
        (res) => res.id !== action.payload
      );
    },
  },
});

export const {
  addReservation,
  toggleReservation,
  updateReservationDetails,
  deleteReservation,
} = reservationsSlice.actions;

export default reservationsSlice.reducer;
