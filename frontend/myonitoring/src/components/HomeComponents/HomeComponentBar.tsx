import React from "react";

const containerClass =
  "flex flex-col items-center shadow-sm justify-between rounded-lg p-4 cursor-pointer transition-transform transform border border-gray-200 w-full max-w-[500px] hover:scale-105";
const titleClass = "text-md font-bold text-orange mb-4";
const descriptionClass = "text-sm font-medium text-gray-600";

interface HomeComponentBarProps {
  icon: React.ReactNode; // 아이콘 컴포넌트
  title: string; // 제목
  description: string; // 설명
  badge?: string; // 강조 배지 내용 (선택 사항)
  badgeColor?: string; // 배지 배경색 (선택 사항)
  onClick: () => void; // 클릭 이벤트 핸들러
}

const HomeComponentBar: React.FC<HomeComponentBarProps> = ({
  icon,
  title,
  description,
  badge,
  badgeColor = "", // 기본 배지 색상
  onClick,
}) => {
  return (
    <div className={containerClass} onClick={onClick}>
      {/* 제목 */}
      <h1 className={titleClass}>{title}</h1>

      {/* 아이콘 */}
      <div className="mb-4">{icon}</div>

      {/* 설명 또는 배지 */}
      {badge ? (
        <span className={`text-base font-bold ${badgeColor}`}>{badge}</span>
      ) : (
        <p className={descriptionClass}>{description}</p>
      )}
    </div>
  );
};

export default HomeComponentBar;
