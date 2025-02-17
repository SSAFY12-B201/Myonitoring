import React from "react";

const containerClass =
  "flex flex-col items-center shadow-sm justify-between rounded-xl p-4 border border-gray-200 bg-white w-full max-w-[500px] max-h-[400px] h-40 sm:h-48 md:h-56 lg:h-64";
const titleWithIconClass = "flex items-center space-x-3 mb-2 text-gray-700"; // 아이콘과 제목을 더 간격 있게 정렬
const titleClass = "font-bold"; // 제목 스타일
const descriptionClass = "text-sm text-gray-500 text-center"; // 설명 스타일
const badgeClass = "text-sm font-semibold px-3 py-1 rounded-full mt-2"; // 배지 스타일

interface Badge {
  text: string; // 배지 텍스트
  color?: string; // 배지 색상 (선택 사항)
}

interface HomeComponentBarProps {
  icon: React.ReactNode; // 아이콘 컴포넌트
  title: string; // 제목
  badge?: string; // 단일 배지 내용 (선택 사항)
  badgeColor?: string; // 단일 배지 색상 (선택 사항)
  badges?: Badge[]; // 여러 개의 배지 (선택 사항)
  description: string; // 설명 텍스트
  onClick: () => void; // 클릭 이벤트 핸들러
}

const HomeComponentBar: React.FC<HomeComponentBarProps> = ({
  icon,
  title,
  badge,
  badgeColor = "", // 기본 단일 배지 색상
  badges = [], // 기본값 빈 배열
  description,
  onClick,
}) => {
  return (
    <div className={containerClass} onClick={onClick}>
      {/* 아이콘과 제목 */}
      <div className={titleWithIconClass}>
        <div className="h-6 w-4">{icon}</div> {/* 아이콘 크기 조정 */}
        <h1 className={titleClass}>{title}</h1>
      </div>

      {/* 단일 배지 */}
      {badge && (
        <span className={`${badgeClass} ${badgeColor}`}>{badge}</span>
      )}

      {/* 여러 개의 배지 */}
      {badges.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {badges.map((badge, index) => (
            <span key={index} className={`${badgeClass} ${badge.color}`}>
              {badge.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeComponentBar;
