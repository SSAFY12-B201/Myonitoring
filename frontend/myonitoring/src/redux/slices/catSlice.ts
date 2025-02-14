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
  selectedCatId: number | null; // 선택된 고양이 ID 추가
}

// 초기 상태 값 설정
const initialState: CatInfoState = {
  image: null,
  name: "",
  breed: "",
  gender: "",
  neutered: "",
  birthdate: "",
  age: null,
  weight: null,
  characteristics: "",
  selectedCatId: null, // 초기값
};

// Slice 생성
const catSlice = createSlice({
  name: "cat",
  initialState,
  reducers: {
    updateCatInfo(state, action: PayloadAction<Partial<CatInfoState>>) {
      return { ...state, ...action.payload };
    },
    resetCatInfo() {
      return initialState;
    },
    setSelectedCatId(state, action: PayloadAction<number>) {
      state.selectedCatId = action.payload; // 선택된 고양이 ID 설정
    },
  },
});

// 액션 및 리듀서 내보내기
export const { updateCatInfo, resetCatInfo, setSelectedCatId } =
  catSlice.actions;
export default catSlice.reducer;
