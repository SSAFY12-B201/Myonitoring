import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom"; // React Router 사용
import {
  setFilterType,
  filterRecords,
} from "../../redux/slices/medicalRecordsSlice";
import { AiOutlinePlus, AiOutlineCalendar } from "react-icons/ai"; // 아이콘 사용
import { BsClock } from "react-icons/bs";
import TopBar from "../../components/TopBar";
import ContentSection from "../../components/ContentSection";
import BottomBar from "../../components/BottomBar";

const MedicalRecords = ({ catId }: { catId?: string }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Redux 상태에서 필터링된 의료기록 가져오기
  const medicalRecords = useAppSelector(
    (state) => state.medicalRecords.filteredRecords
  );
  const filterType = useAppSelector((state) => state.medicalRecords.filterType);

  // 필터링 초기화
  useEffect(() => {
    dispatch(filterRecords()); // 초기 필터링 (전체)
  }, [dispatch]);

  // 필터 타입 변경 시 필터링 실행
  useEffect(() => {
    dispatch(filterRecords()); // filterType이 변경될 때마다 필터링 실행
  }, [filterType, dispatch]);

  // 필터 변경 핸들러
  const handleFilterChange = (type: "전체" | "정기검진" | "치료" | "기타") => {
    dispatch(setFilterType(type)); // 필터 타입 설정
  };

  return (
    <div className="min-h-screen flex flex-col pb-[60px] bg-cover bg-center" style={{ backgroundImage: "url('/gradient_background.png')" }}>
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
            defaultValue="2024-01-31"
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          />
          <span>~</span>
          <input
            type="date"
            defaultValue="2025-01-31"
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>

        {/* 탭 메뉴 */}
        <div className="flex justify-around text-sm border-gray-300 mb-4">
          {["전체", "정기검진", "치료", "기타"].map((type) => (
            <button
              key={type}
              onClick={() =>
                handleFilterChange(
                  type as "전체" | "정기검진" | "치료" | "기타"
                )
              }
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
          {medicalRecords.length > 0 ? (
            medicalRecords.map((record) => (
              <div
                key={record.id}
                onClick={() => navigate(`/medical-records/${record.id}`)}
                className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white flex justify-between items-start"
              >
                {/* 왼쪽 정보 */}
                <div>
                  {/* 분류 태그 */}
                  <span
                    className={`inline-block px-3 py-[2px] text-xs font-bold rounded ${
                      record.type === "정기검진"
                        ? "bg-yellow text-white" // 정기검진: 노란색
                        : record.type === "치료"
                        ? "bg-orange text-white" // 치료: 주황색
                        : "bg-blue text-white" // 기타: 파란색
                    }`}
                  >
                    {record.type}
                  </span>
                  {/* 제목 */}
                  <h3 className="mt-2 font-semibold text-base">
                    {record.title}
                  </h3>
                  {/* 날짜 및 시간 */}
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
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
