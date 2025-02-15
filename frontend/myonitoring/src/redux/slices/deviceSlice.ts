import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Device 데이터 타입 정의
interface Device {
  id: number;
  serialNumber: string;
  userId: number; // 해당 기기를 소유한 유저 ID
  catId: number | null; // 연결된 고양이 ID (없으면 null)
}

// 초기 상태 정의
const initialState: Device[] = []; // 기기 데이터를 배열로 관리

// Devices Slice 생성
const devicesSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    // 기기 추가
    addDevice(state, action: PayloadAction<Device>) {
      state.push(action.payload); // 배열에 새로운 기기 추가
    },

    // 여러 기기 추가
    addDevices(state, action: PayloadAction<Device[]>) {
      state.push(...action.payload); // 배열에 여러 기기 추가
    },

    // 기기 수정
    updateDevice(
      state,
      action: PayloadAction<{ id: number; changes: Partial<Device> }>
    ) {
      const { id, changes } = action.payload;
      const index = state.findIndex((device) => device.id === id); // ID로 기기 찾기
      if (index !== -1) {
        state[index] = { ...state[index], ...changes }; // 기존 데이터에 변경 사항 병합
      }
    },

    // 기기 삭제
    removeDevice(state, action: PayloadAction<number>) {
      const id = action.payload;
      return state.filter((device) => device.id !== id); // 해당 ID의 기기를 제외한 새로운 배열 반환
    },

    // 고양이를 기기에 연결 (1:1 관계)
    assignCatToDevice(
      state,
      action: PayloadAction<{ deviceId: number; catId: number }>
    ) {
      const { deviceId, catId } = action.payload;
      const device = state.find((device) => device.id === deviceId);
      if (device) {
        device.catId = catId; // 고양이 ID 연결
      }
    },

    // 기기에서 고양이 연결 해제
    removeCatFromDevice(state, action: PayloadAction<number>) {
      const deviceId = action.payload;
      const device = state.find((device) => device.id === deviceId);
      if (device) {
        device.catId = null; // 고양이 연결 해제
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase("resetAllState", () => initialState); // 상태 초기화
  },
});

// 액션 및 리듀서 내보내기
export const {
  addDevice,
  addDevices,
  updateDevice,
  removeDevice,
  assignCatToDevice,
  removeCatFromDevice,
} = devicesSlice.actions;

export default devicesSlice.reducer;
