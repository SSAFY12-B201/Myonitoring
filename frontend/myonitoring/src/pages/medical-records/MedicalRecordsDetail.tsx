import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { updateRecord } from "../../redux/slices/medicalRecordsSlice";
import Input from "../../components/Input";
import ContentSection from "../../components/ContentSection";
import WideButton from "../../components/WideButton";
import Header from "../../components/Header";

const MedicalRecordDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux에서 해당 ID의 의료기록 가져오기
  const record = useAppSelector((state) =>
    state.medicalRecords.records.find((rec) => rec.id === id)
  );

  if (!record) {
    return <p>존재하지 않는 기록입니다.</p>;
  }

  // 입력값 변경 핸들러
  const handleChange = (field: string, value: string) => {
    dispatch(updateRecord({ ...record, [field]: value }));
  };

  return (
    <div>
      {/* 상단 헤더 */}
      <Header title="의료기록 수정" onBack={() => navigate(-1)} />

      {/* 상세 정보 입력 폼 */}
      <ContentSection>
        {/* 분류 */}
        <Input
          label="분류 *"
          type="select"
          value={record.type}
          onChange={(value) => handleChange("type", value)}
          options={["정기검진", "치료", "기타"]}
        />

        {/* 제목 */}
        <Input
          label="제목 *"
          type="text"
          value={record.title}
          onChange={(value) => handleChange("title", value)}
        />

        {/* 설명 */}
        <Input
          label="설명"
          type="textarea"
          value={record.description}
          onChange={(value) => handleChange("description", value)}
        />

        {/* 병원 */}
        <Input
          label="병원 *"
          type="text"
          value={record.hospital}
          onChange={(value) => handleChange("hospital", value)}
        />

        {/* 날짜 */}
        <Input
          label="날짜 *"
          type="date"
          value={record.date}
          onChange={(value) => handleChange("date", value)}
        />

        {/* 시간 */}
        <Input
          label="시간 *"
          type="time"
          value={record.time}
          onChange={(value) => handleChange("time", value)}
        />
      </ContentSection>

      {/* 하단 버튼 */}
      <footer className="bottom-0 left-0 w-full p-4">
        <WideButton
          text="저장"
          textColor="text-white"
        />
      </footer>
    </div>
  );
};

export default MedicalRecordDetail;
