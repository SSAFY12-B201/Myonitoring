import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CatInfoState {
  image: string | null;
  name: string;
  breed: string;
  gender: "남아" | "여아" | "";
  neutered: "중성화 전" | "중성화 완료" | "";
  birthdate: string;
  age: number | null;
  weight: number | null;
  characteristics: string;
  selectedCatId: number | null;
}

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
  selectedCatId: null,
};

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
      state.selectedCatId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase("resetAllState", () => initialState); // 상태 초기화
  },
});

export const { updateCatInfo, resetCatInfo, setSelectedCatId } =
  catSlice.actions;
export default catSlice.reducer;
