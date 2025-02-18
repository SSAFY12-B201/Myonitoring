import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Reservation {
  id: string;
  scheduledTime: string;
  scheduledAmount: number;
  isActive: boolean;
}

interface ReservationState {
  reservationsByCat: {
    [catId: number]: Reservation[];
  };
}

const initialState: ReservationState = {
  reservationsByCat: {},
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
    setReservations(
      state,
      action: PayloadAction<{ catId: number; reservations: Reservation[] }>
    ) {
      state.reservationsByCat[action.payload.catId] = sortReservations(
        action.payload.reservations
      );
    },
    addReservation(
      state,
      action: PayloadAction<{ catId: number; reservation: Reservation }>
    ) {
      const { catId, reservation } = action.payload;
      if (!state.reservationsByCat[catId]) {
        state.reservationsByCat[catId] = [];
      }
      state.reservationsByCat[catId].push(reservation);
      state.reservationsByCat[catId] = sortReservations(
        state.reservationsByCat[catId]
      );
    },
    toggleReservation(
      state,
      action: PayloadAction<{ catId: number; id: string; isActive: boolean }>
    ) {
      const { catId, id, isActive } = action.payload;
      const reservation = state.reservationsByCat[catId]?.find(
        (res) => res.id === id
      );
      if (reservation) {
        reservation.isActive = isActive;
      }
    },
    updateReservationDetails(
      state,
      action: PayloadAction<{
        catId: number;
        id: string;
        scheduledTime?: string;
        scheduledAmount?: number;
      }>
    ) {
      const { catId, id, scheduledTime, scheduledAmount } = action.payload;
      const reservation = state.reservationsByCat[catId]?.find(
        (res) => res.id === id
      );
      if (reservation) {
        if (scheduledTime !== undefined) {
          reservation.scheduledTime = scheduledTime;
        }
        if (scheduledAmount !== undefined) {
          reservation.scheduledAmount = scheduledAmount;
        }
        state.reservationsByCat[catId] = sortReservations(
          state.reservationsByCat[catId]
        );
      }
    },
    deleteReservation(
      state,
      action: PayloadAction<{ catId: number; id: string }>
    ) {
      const { catId, id } = action.payload;
      if (state.reservationsByCat[catId]) {
        state.reservationsByCat[catId] = state.reservationsByCat[
          catId
        ].filter((res) => res.id !== id);
      }
    },
  },
});

export const {
  setReservations,
  addReservation,
  toggleReservation,
  updateReservationDetails,
  deleteReservation,
} = reservationsSlice.actions;

export default reservationsSlice.reducer;
