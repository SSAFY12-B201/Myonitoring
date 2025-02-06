import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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
});

export const { updateUserInfo, resetUserInfo } = userSlice.actions;
export default userSlice.reducer;
