// src/components/Medicalcomponent/MedicalList.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineCalendar } from "react-icons/ai";
import { BsClock } from "react-icons/bs";

interface MedicalRecord {
  id: string;
  category: string;
  title: string;
  visitDate: string;
  visitTime: string;
}

interface MedicalListProps {
  records: MedicalRecord[];
  isLoading: boolean;
  onDelete: (id: string) => void; // 삭제 동작 콜백
}

const MedicalList: React.FC<MedicalListProps> = ({ records, isLoading, onDelete }) => {
  const navigate = useNavigate();
  const [translateX, setTranslateX] = useState<{ [key: string]: number }>({}); // 각 항목의 슬라이드 상태 저장

  // 터치 시작 시 X 좌표 저장
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, id: string) => {
    e.currentTarget.dataset.startX = e.touches[0].clientX.toString();
    setTranslateX((prev) => ({ ...prev, [id]: 0 })); // 초기화
  };

  // 터치 이동 시 X 좌표 변화 계산
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>, id: string) => {
    const startX = parseFloat(e.currentTarget.dataset.startX || "0");
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;

    // 왼쪽으로 일정 거리 이상 이동 시 translateX 업데이트
    if (deltaX < -30) {
      setTranslateX((prev) => ({ ...prev, [id]: deltaX }));
    }
  };

  // 터치 종료 시 위치에 따라 삭제 버튼 표시
  const handleTouchEnd = (id: string) => {
    if (translateX[id] <= -100) {
      setTranslateX((prev) => ({ ...prev, [id]: -100 })); // 삭제 버튼 완전히 노출
    } else {
      setTranslateX((prev) => ({ ...prev, [id]: 0 })); // 원래 위치로 복귀
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-24 h-full">
        <img
          src="/Cat.png"
          alt="로고 이미지"
          className="w-35 h-32 animate-fade-in"
        />
        <h1 className="text-sm text-gray-600 mt-6">
          등록된 의료 기록이 없습니다.
        </h1>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div key={record.id} className="relative w-full overflow-hidden">
          {/* 삭제 버튼 */}
          <button
            onClick={() => onDelete(record.id)} // 삭제 동작 호출
            className="absolute right-0 top-0 h-[85px] w-[85px] bg-red-500 text-white text-sm font-medium rounded-md flex items-center justify-center "
            style={{
              transform: `translateX(${translateX[record.id] === -100 ? "0" : "100%"})`,
              transition: "transform 0.3s ease",
            }}
          >
            삭제
          </button>

          {/* 의료 기록 카드 */}
          <div
            className={`border border-gray-200 rounded-lg p-4 shadow-sm bg-white flex justify-between items-start`}
            style={{
              transform: `translateX(${translateX[record.id] || 0}px)`,
              transition: "transform 0.2s ease",
            }}
            onTouchStart={(e) => handleTouchStart(e, record.id)}
            onTouchMove={(e) => handleTouchMove(e, record.id)}
            onTouchEnd={() => handleTouchEnd(record.id)}
            onClick={() => navigate(`/medical-records/${record.id}`)} // 상세 페이지 이동
          >
            {/* 왼쪽 정보 */}
            <div>
              {/* 분류 태그와 제목을 가로로 나란히 배치 */}
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block px-3 py-[2px] text-xs font-bold rounded ${
                    record.category === "CHECKUP"
                      ? "bg-yellow text-white"
                      : record.category === "TREATMENT"
                      ? "bg-orange text-white"
                      : "bg-blue text-white"
                  }`}
                >
                  {record.category === "CHECKUP"
                    ? "정기검진"
                    : record.category === "TREATMENT"
                    ? "치료"
                    : "기타"}
                </span>
                <h3 className="font-semibold text-base">{record.title}</h3>
              </div>
              {/* 날짜 및 시간 */}
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                <AiOutlineCalendar size={14} /> {record.visitDate}{" "}
                <BsClock size={14} /> {record.visitTime}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MedicalList;
