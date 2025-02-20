import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 의료기록 데이터 타입 정의
interface MedicalRecord {
  id: string; // 고유 ID
  catId: string; // 고양이 ID
  type: "정기검진" | "치료" | "기타"; // 분류
  title: string; // 제목
  description: string; // 설명
  hospital: string; // 병원 이름
  date: string; // 날짜 (YYYY-MM-DD)
  time: string; // 시간 (HH:mm)
}

interface MedicalRecordsState {
  records: MedicalRecord[]; // 의료 기록 배열
}

const initialState: MedicalRecordsState = {
  records: [
    {
      id: "1",
      catId: "cat1",
      type: "정기검진",
      title: "고양이종합백신 2회차",
      description: "종합백신 접종 완료",
      hospital: "행복동물병원",
      date: "2025-01-28",
      time: "10:00",
    },
    {
      id: "2",
      catId: "cat1",
      type: "기타",
      title: "결막염 치료",
      description: "결막염 약 처방 및 치료",
      hospital: "행복동물병원",
      date: "2025-01-02",
      time: "10:00",
    },
    {
      id: "3",
      catId: "cat1",
      type: "정기검진",
      title: "고양이종합백신 1회차",
      description: "종합백신 접종 완료",
      hospital: "행복동물병원",
      date: "2025-02-10",
      time: "10:00",
    },
    {
      id: "4",
      catId: "cat1",
      type: "기타",
      title: "예방 접종",
      description: "예방 접종 1회차차",
      hospital: "행복동물병원",
      date: "2025-02-10",
      time: "16:00",
    },
  ],
};

const medicalRecordsSlice = createSlice({
  name: "medicalRecords",
  initialState,
  reducers: {
    addRecord(state, action: PayloadAction<MedicalRecord>) {
      state.records.push(action.payload);
    },
    updateRecord(state, action: PayloadAction<MedicalRecord>) {
      const index = state.records.findIndex(
        (record) => record.id === action.payload.id
      );
      if (index !== -1) {
        state.records[index] = action.payload;
      }
    },
    deleteRecord(state, action: PayloadAction<string>) {
      state.records = state.records.filter(
        (record) => record.id !== action.payload
      );
    },
  },
});

export const { addRecord, updateRecord, deleteRecord } =
  medicalRecordsSlice.actions;

export default medicalRecordsSlice.reducer;
