import React, { useState, useEffect } from "react";
import { useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { AiOutlinePlus, AiOutlineCalendar } from "react-icons/ai";
import { BsClock } from "react-icons/bs";
import TopBar from "../../components/TopBar";
import ContentSection from "../../components/ContentSection";
import BottomBar from "../../components/BottomBar";

const MedicalRecords = ({ catId }: { catId?: string }) => {
  const navigate = useNavigate();

  // Redux에서 의료 기록 데이터 가져오기
  const medicalRecords = useAppSelector((state) =>
    state.medicalRecords.records.filter((record) => record.catId === "cat1")
  );

  // 로컬 상태로 필터링 조건 관리
  const [filterType, setFilterType] = useState<"전체" | "정기검진" | "치료" | "기타">("전체");
  const [startDate, setStartDate] = useState<string>(""); // 시작 날짜
  const [endDate, setEndDate] = useState<string>(""); // 종료 날짜

  // 컴포넌트가 마운트될 때 기본 날짜 설정
  useEffect(() => {
    const today = new Date();

    // 현재 달의 시작일 계산
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // 현재 달의 마지막 날 계산
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // 상태 업데이트 (YYYY-MM-DD 형식으로 변환)
    setStartDate(firstDayOfMonth.toISOString().split("T")[0]);
    setEndDate(lastDayOfMonth.toISOString().split("T")[0]);
  }, []);

  // 필터링된 데이터 계산
  const filteredRecords = medicalRecords.filter((record) => {
    const recordDate = new Date(record.date).getTime();
    const start = startDate ? new Date(startDate).getTime() : null;
    const end = endDate ? new Date(endDate).getTime() : null;

    const isWithinDateRange =
      (!start || recordDate >= start) && (!end || recordDate <= end);

    const isTypeMatch =
      filterType === "전체" || record.type === filterType;

    return isWithinDateRange && isTypeMatch;
  });

  return (
    <div
      className="min-h-screen flex flex-col pb-[60px] bg-cover bg-center"
      style={{ backgroundImage: "url('/gradient_background.png')" }}
    >
      {/* 상단 바 */}
      <TopBar />

      {/* 본문 */}
      <ContentSection>
        {/* 의료기록 조회 제목 */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">의료기록 조회</h1>
          <button className="bg-yellow-400 text-white rounded-full w-8 h-8 flex items-center justify-center">
            <AiOutlinePlus size={16} />
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
        <div className="space-y-4">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <div
                key={record.id}
                onClick={() => navigate(`/medical-records/${record.id}`)}
                className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white flex justify-between items-start"
              >
                {/* 왼쪽 정보 */}
                <div>
                  {/* 분류 태그와 제목을 가로로 나란히 배치 */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block px-3 py-[2px] text-xs font-bold rounded ${
                        record.type === "정기검진"
                          ? "bg-yellow text-white"
                          : record.type === "치료"
                          ? "bg-orange text-white"
                          : "bg-blue text-white"
                      }`}
                    >
                      {record.type}
                    </span>
                    <h3 className="font-semibold text-base">{record.title}</h3>
                  </div>
                  {/* 날짜 및 시간 */}
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                    <AiOutlineCalendar size={14} /> {record.date}{" "}
                    <BsClock size={14} /> {record.time}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center mt-24 h-full">
              <img
                src="/sleeping_cat.png"
                alt="로고 이미지"
                className="w-35 h-32 animate-fade-in"
              />
              <h1 className="text-xs font-Gidugu text-gray-900 mt-4">
                의료기록이 없습니다...
              </h1>
            </div>
          )}
        </div>
      </ContentSection>

      {/* 하단 바 */}
      <BottomBar />
    </div>
  );
};

export default MedicalRecords;
