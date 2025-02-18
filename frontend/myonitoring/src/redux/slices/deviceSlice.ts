// devicesSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Device 데이터 타입 정의
interface Device {
  id: number;
  serialNumber: string;
  registrationDate: string; // 등록 날짜
  catId: number | null; // 고양이 ID (없으면 null)
  catName: string | null; // 고양이 이름 (없으면 null)
}

// 초기 상태 정의
const initialState: Device[] = []; // 기기 데이터를 배열로 관리

// Devices Slice 생성
const devicesSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    // 디바이스 데이터 설정 (조회 후 상태 업데이트)
    setDevices(state, action: PayloadAction<Device[]>) {
      return action.payload; // 기존 상태를 덮어씌움 (조회된 데이터로 갱신)
    },

    addDevice(state, action: PayloadAction<Device>) {
      state.push(action.payload);
    },
    updateDevice(
      state,
      action: PayloadAction<{ id: number; changes: Partial<Device> }>
    ) {
      const { id, changes } = action.payload;
      const index = state.findIndex((device) => device.id === id);
      if (index !== -1) {
        state[index] = { ...state[index], ...changes };
      }
    },
    removeDevice(state, action: PayloadAction<number>) {
      return state.filter((device) => device.id !== action.payload);
    },
  },
});

export const { setDevices, addDevice, updateDevice, removeDevice } =
  devicesSlice.actions;

export default devicesSlice.reducer;
