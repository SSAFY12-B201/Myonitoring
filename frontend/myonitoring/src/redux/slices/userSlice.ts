import { createSlice } from "@reduxjs/toolkit";

interface userState {
  nickname: string 
  phoneNumber: string 
  address: string 
}

const initialState:userState  = {
  nickname: "",
  phoneNumber: "",
  address: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserInfo(state, action) {
      return { ...state, ...action.payload };
    },
    resetUserInfo() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase("resetAllState", () => initialState); // 상태 초기화
  },
});

export const { updateUserInfo, resetUserInfo } = userSlice.actions;
export default userSlice.reducer;
