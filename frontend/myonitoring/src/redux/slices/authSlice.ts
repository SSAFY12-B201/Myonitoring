import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false, // 로그인 여부
  accessToken: null, // 액세스 토큰(jwt토큰)
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.accessToken = action.payload.accessToken;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.accessToken = null;
    },
    refreshAccessToken(state, action) {
      state.accessToken = action.payload.accessToken;
    },
  },
});

export const { login, logout, refreshAccessToken } = authSlice.actions;
export default authSlice.reducer;
