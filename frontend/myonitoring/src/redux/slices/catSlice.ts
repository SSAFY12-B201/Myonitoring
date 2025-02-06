import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 초기 상태 정의
interface CatInfoState {
  image: string | null; // 이미지 URL 또는 Base64 문자열
  name: string; // 이름 (필수)
  breed: string; // 묘종 (선택)
  gender: "남아" | "여아" | ""; // 성별 (라디오박스)
  neutered: "중성화 전" | "중성화 완료" | ""; // 중성화 여부 (드롭다운)
  birthdate: string; // 생년월일 (날짜, 필수)
  age: number | null; // 나이 (숫자, 필수)
  weight: number | null; // 몸무게 (숫자, 선택)
  characteristics: string; // 특징 (텍스트, 선택)
}

const initialState: CatInfoState = {
  image: null, // 초기값은 null
  name: "",
  breed: "",
  gender: "",
  neutered: "",
  birthdate: "",
  age: null,
  weight: null,
  characteristics: "",
};

const catSlice = createSlice({
  name: "cat",
  initialState,
  reducers: {
    updateCatInfo(state, action: PayloadAction<Partial<CatInfoState>>) {
      return { ...state, ...action.payload }; // 상태 업데이트
    },
    resetCatInfo() {
      return initialState; // 초기 상태로 리셋
    },
  },
});

export const { updateCatInfo, resetCatInfo } = catSlice.actions;
export default catSlice.reducer;
