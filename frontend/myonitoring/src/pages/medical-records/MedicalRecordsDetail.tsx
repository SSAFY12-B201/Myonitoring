import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../../api/axios"; // Axios 인스턴스 임포트
import Input from "../../components/Input";
import ExceptTopContentSection from "../../components/ExceptTopContentSection";
import WideButton from "../../components/WideButton";
import Header from "../../components/Header";

const MedicalRecordDetail = () => {
  const { id } = useParams<{ id: string }>(); // URL 파라미터에서 ID 가져오기
  const navigate = useNavigate();

  const [record, setRecord] = useState<any>(null); // 의료 기록 상태
  const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 상태

  // UI와 서버 간 매핑 객체
  const categoryMapping: Record<string, string> = {
    정기검진: "CHECKUP",
    치료: "TREATMENT",
    기타: "OTHER",
  };

  const reverseCategoryMapping: Record<string, string> = {
    CHECKUP: "정기검진",
    TREATMENT: "치료",
    OTHER: "기타",
  };

  // 데이터 가져오기
  useEffect(() => {
    const fetchRecord = async () => {
      const token = localStorage.getItem("jwt_access_token");
      if (!token) throw new Error("No access token found");

      try {
        setIsLoading(true);
        const response = await api.get(`/api/medical/detail/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRecord(response.data); // 데이터 설정
      } catch (error) {
        console.error("Error fetching medical record:", error);
        alert("의료 기록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchRecord();
  }, [id]);

  // 입력값 변경 핸들러
  const handleChange = (field: string, value: string) => {
    setRecord((prev: any) => ({ ...prev, [field]: value }));
  };

  // 저장 핸들러
  const handleSave = async () => {
    const token = localStorage.getItem("jwt_access_token");
    if (!token) throw new Error("No access token found");

    try {
      await api.put(`/api/medical/detail/${id}`, record, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate(-1);
    } catch (error) {
      console.error("Error saving medical record:", error);
    }
  };

  if (isLoading) return <p>로딩 중...</p>;
  if (!record) return <p>존재하지 않는 기록입니다.</p>;

  return (
    <div>
      {/* 상단 헤더 */}
      <Header title="의료기록 수정" onBack={() => navigate(-1)} />

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
          value={reverseCategoryMapping[record.category]} // 서버 데이터 -> UI 표시 데이터 변환
          onChange={(value) => handleChange("category", categoryMapping[value])} // UI 데이터 -> 서버 데이터 변환
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

export default MedicalRecordDetail;
