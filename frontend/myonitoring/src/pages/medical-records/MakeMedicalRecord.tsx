import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../../api/axios"; // Axios 인스턴스 임포트 
import { useAppSelector } from "../../redux/hooks"; // 고양이 ID 가져오기
import Input from "../../components/Input";
import ExceptTopContentSection from "../../components/ExceptTopContentSection";
import WideButton from "../../components/WideButton";
import Header from "../../components/Header";

const MakeMedicalRecord = () => {
  const navigate = useNavigate();
  const selectedCatId = useAppSelector((state) => state.cat.selectedCatId); // 고양이 ID 가져오기

  // UI와 서버 간 매핑 객체
  const categoryMapping: Record<string, string> = {
    정기검진: "CHECKUP",
    치료: "TREATMENT",
    기타: "OTHER",
  };

  // 초기 상태 (빈 값)
  const [record, setRecord] = useState({
    category: "",
    title: "",
    description: "",
    hospitalName: "",
    visitDate: "",
    visitTime: "",
  });

  // 입력값 변경 핸들러
  const handleChange = (field: string, value: string) => {
    setRecord((prev) => ({ ...prev, [field]: value }));
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (!selectedCatId) {
      alert("고양이를 선택해주세요.");
      return;
    }

    try {
      const token = localStorage.getItem("jwt_access_token");
      if (!token) throw new Error("No access token found");

      const newRecord = {
        ...record,
        category: categoryMapping[record.category], // UI 값 -> 서버 값 변환
      };

      await api.post(`/api/medical/${selectedCatId}`, newRecord, {
        headers: {
           Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // JSON 형식 명시
        },
      });

      navigate(-1); // 이전 페이지로 이동
    } catch (error) {
      console.error("Error creating medical record:", error);
    }
  };

  return (
    <div>
      {/* 상단 헤더 */}
      <Header title="의료기록 생성" onBack={() => navigate(-1)} />

      {/* 상세 정보 입력 폼 */}
      <ExceptTopContentSection>
        {/* 분류 */}
        <Input
          label={
            <>
              분류<span className="text-red-500"> *</span>
            </>
          }
          type="select"
          value={record.category}
          onChange={(value) => handleChange("category", value)} // UI 데이터 반영
          options={Object.keys(categoryMapping)} // ["정기검진", "치료", "기타"]
        />

        {/* 제목 */}
        <Input
          label={
            <>
              제목<span className="text-red-500"> *</span>
            </>
          }
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
          label={
            <>
              병원<span className="text-red-500"> *</span>
            </>
          }
          type="text"
          value={record.hospitalName}
          onChange={(value) => handleChange("hospitalName", value)}
        />

        {/* 날짜 */}
        <Input
          label={
            <>
              날짜<span className="text-red-500"> *</span>
            </>
          }
          type="date"
          value={record.visitDate}
          onChange={(value) => handleChange("visitDate", value)}
        />

        {/* 시간 */}
        <Input
          label={
            <>
              시간<span className="text-red-500"> *</span>
            </>
          }
          type="time"
          value={record.visitTime}
          onChange={(value) => handleChange("visitTime", value)}
        />
      </ExceptTopContentSection>

      {/* 하단 버튼 */}
      <footer className="bottom-0 left-0 w-full p-4">
        <WideButton text="저장" textColor="text-white" onClick={handleSave} />
      </footer>
    </div>
  );
};

export default MakeMedicalRecord;
