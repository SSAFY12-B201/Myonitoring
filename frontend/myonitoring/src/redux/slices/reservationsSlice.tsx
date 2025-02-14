import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Reservation {
  id: string;
  time: string;
  amount: number;
  isActive: boolean;
}

interface ReservationState {
  reservations: Reservation[];
}

// 초기 상태에 더미 데이터 추가
const initialState: ReservationState = {
  reservations: [
    {
      id: "1",
      time: "08:00",
      amount: 50,
      isActive: true,
    },
    {
      id: "2",
      time: "12:00",
      amount: 70,
      isActive: true,
    },
    {
      id: "3",
      time: "18:00",
      amount: 60,
      isActive: false,
    },
  ],
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
    toggleReservation(state, action: PayloadAction<{ id: string; isActive: boolean }>) {
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
      action: PayloadAction<{ id: string; time?: string; amount?: number }>
    ) {
      const reservation = state.reservations.find(
        (res) => res.id === action.payload.id
      );
      if (reservation) {
        if (action.payload.time !== undefined) {
          reservation.time = action.payload.time; // 시간 업데이트
        }
        if (action.payload.amount !== undefined) {
          reservation.amount = action.payload.amount; // 배급량 업데이트
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
