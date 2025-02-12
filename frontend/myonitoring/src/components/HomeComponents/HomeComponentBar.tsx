import React from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// 공통 클래스 정의
const containerClass =
  "flex items-center justify-between rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow border border-gray-200";
const titleClass = "text-lg font-bold flex items-center space-x-2 mb-2"; // 아이콘과 제목 한 줄
const descriptionClass = "text-sm text-gray-500";
const badgeClass = "px-2 py-1 rounded-full font-bold";

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
      <div>
        <span className={titleClass}>
          {icon}
          {title}
        </span>
        <span className={`${descriptionClass} flex items-center`}>
          {badge && (
            <span className={`${badgeClass} ${badgeColor} mr-2`}>
              {badge}
            </span>
          )}
          {description}
        </span>
      </div>
      <ChevronRightIcon style={{ color: "#FFD700" }} />
    </div>
  );
};

export default HomeComponentBar;
