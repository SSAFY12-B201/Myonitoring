import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    user: {
      id: number;
      name: string;
      email: string;
      socialProvider: 'google' | 'kakao' | 'naver';
      phone?: string;
      address?: string;
      nickname?: string;
    } | null; // 로그인 전에는 null
    isLoggedIn: boolean;
    loading: boolean;
    error: string | null;
  }
  
  const initialState: UserState = {
    user: null,
    isLoggedIn: false,
    loading: false,
    error: null,
  };

  const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      login(state, action: PayloadAction<UserState['user']>) {
        state.user = action.payload;
        state.isLoggedIn = true;
      },
      logout(state) {
        state.user = null;
        state.isLoggedIn = false;
      },
      setError(state, action: PayloadAction<string>) {
        state.error = action.payload;
      },
    },
  });
  
  export const { login, logout, setError } = userSlice.actions;

  export default userSlice.reducer;