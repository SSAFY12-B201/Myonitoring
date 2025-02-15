import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  accessToken: null,
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
  extraReducers: (builder) => {
    builder.addCase("resetAllState", () => initialState); // 상태 초기화
  },
});

export const { login, logout, refreshAccessToken } = authSlice.actions;
export default authSlice.reducer;
