import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios"; // Axios 인스턴스 임포트
import { useAppSelector } from "../../redux/hooks";
import TopBar from "../../components/TopBar";
import ContentSection from "../../components/ContentSection";
import BottomBar from "../../components/BottomBar";
import MedicalList from "../../components/MedicalComponent/MedicalList";

const MedicalRecords = () => {
  const navigate = useNavigate();
  const selectedCatId = useAppSelector((state) => state.cat.selectedCatId);
  const [filterType, setFilterType] = useState<
    "전체" | "정기검진" | "치료" | "기타"
  >("전체");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [fetchedRecords, setFetchedRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 날짜 초기화
  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 6,
      1
    );
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 11,
      0
    );
    setStartDate(firstDayOfMonth.toISOString().split("T")[0]);
    setEndDate(lastDayOfMonth.toISOString().split("T")[0]);
  }, []);

  // 데이터 가져오기
  const fetchMedicalRecords = async () => {
    const token = localStorage.getItem("jwt_access_token");
    if (!token) throw new Error("No access token found");

    if (!selectedCatId || !startDate || !endDate) return;

    try {
      setIsLoading(true);
      const response = await api.get(
        `/api/medical/${selectedCatId}?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFetchedRecords(response.data);
    } catch (error) {
      console.error("Error fetching medical records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 삭제 함수 정의
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("jwt_access_token");
    if (!token) throw new Error("No access token found");

    try {
      // 서버에 DELETE 요청
      await api.delete(`/api/medical/detail/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      // 성공적으로 삭제되었으면 상태 업데이트
      setFetchedRecords((prevRecords) =>
        prevRecords.filter((record) => record.id !== id)
      );
    } catch (error) {
      console.error("Error deleting medical record:", error);
      alert("삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 필터링된 데이터 계산
  const filteredRecords = fetchedRecords
    .filter((record) => {
      const recordDate = new Date(record.visitDate).getTime();
      const start = startDate ? new Date(startDate).getTime() : null;
      const end = endDate ? new Date(endDate).getTime() : null;

      return (
        (!start || recordDate >= start) &&
        (!end || recordDate <= end) &&
        (filterType === "전체" ||
          (filterType === "정기검진" && record.category === "CHECKUP") ||
          (filterType === "치료" && record.category === "TREATMENT") ||
          (filterType === "기타" && record.category === "OTHER"))
      );
    })
    .sort(
      (a, b) =>
        new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
    );

  // 데이터 가져오기 트리거
  useEffect(() => {
    if (startDate && endDate) fetchMedicalRecords();
  }, [selectedCatId, startDate, endDate]);

  return (
    <div
      className="min-h-screen flex flex-col pb-[60px] bg-cover bg-center"
      style={{ backgroundImage: "url('/gradient_background.png')" }}
    >
      <TopBar />
      <ContentSection>
        {/* 의료기록 조회 제목 */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">의료기록 조회</h1>
          <button
            className="custom-button fixed bottom-24 z-50 right-6 w-10 h-10"
            onClick={() => navigate("/make-medical-record")}
          >
            +
          </button>
        </div>

        {/* 날짜 필터 */}
        <div className="flex items-center justify-between mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          />
          <span>~</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>

        {/* 탭 메뉴 */}
        <div className="flex justify-around text-sm border-gray-300 mb-4">
          {["전체", "정기검진", "치료", "기타"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type as typeof filterType)}
              className={`flex-grow text-center py-2 ${
                filterType === type
                  ? "text-yellow-500 font-bold border-b-2 border-yellow-500"
                  : "text-gray-500 font-medium border-b-2 border-transparent"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* 의료 기록 리스트 */}
        <MedicalList
          records={filteredRecords}
          isLoading={isLoading}
          onDelete={handleDelete}
        />
      </ContentSection>
      <BottomBar />
    </div>
  );
};

export default MedicalRecords;
