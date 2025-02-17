import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Reservation {
  id: string;
  scheduledTime: string;
  scheduledAmount: number;
  isActive: boolean;
}

interface ReservationState {
  reservations: Reservation[];
}

const initialState: ReservationState = {
  reservations: [],
};

// 예약 데이터를 시간 기준으로 정렬하는 함수
const sortReservations = (reservations: Reservation[]) => {
  return reservations.sort((a, b) => {
    const timeA = a.scheduledTime.split(":").map(Number);
    const timeB = b.scheduledTime.split(":").map(Number);
    return timeA[0] - timeB[0] || timeA[1] - timeB[1]; // 시간과 분을 비교
  });
};

const reservationsSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    addReservation(state, action: PayloadAction<Reservation>) {
      state.reservations.push(action.payload);
      state.reservations = sortReservations(state.reservations); // 시간 기준 정렬
    },
    toggleReservation(state, action: PayloadAction<{ id: string; isActive: boolean }>) {
      const reservation = state.reservations.find((res) => res.id === action.payload.id);
      if (reservation) {
        reservation.isActive = action.payload.isActive;
      }
    },
    updateReservationDetails(
      state,
      action: PayloadAction<{ id: string; scheduledTime?: string; scheduledAmount?: number }>
    ) {
      const reservation = state.reservations.find((res) => res.id === action.payload.id);
      if (reservation) {
        if (action.payload.scheduledTime !== undefined) {
          reservation.scheduledTime = action.payload.scheduledTime;
        }
        if (action.payload.scheduledAmount !== undefined) {
          reservation.scheduledAmount = action.payload.scheduledAmount;
        }
      }
      state.reservations = sortReservations(state.reservations); // 시간 기준 정렬
    },
    deleteReservation(state, action: PayloadAction<string>) {
      state.reservations = state.reservations.filter((res) => res.id !== action.payload);
    },
  },
});

export const { addReservation, toggleReservation, updateReservationDetails, deleteReservation } =
  reservationsSlice.actions;

export default reservationsSlice.reducer;
