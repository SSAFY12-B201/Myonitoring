import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const containerClass =
  "flex flex-col shadow-sm justify-between rounded-xl p-4 border border-gray-200 bg-white w-full max-w-[500px] max-h-[400px] h-44 sm:h-48 md:h-56 lg:h-64 overflow-auto"
const titleWithIconClass = "flex space-x-3 mb-2 text-gray-700"; // 제목 스타일
const titleClass = "font-bold text-gray-600"; // 제목 스타일
const badgeClass = "text-sm font-extrabold px-2 py-1 rounded-full mt-1"; // 배지 스타일

interface Badge {
  text: string; // 배지 텍스트
  color?: string; // 배지 색상 (선택 사항)
}

interface HomeComponentBarProps {
  title: string; // 제목
  badge?: string; // 단일 배지 내용 (선택 사항)
  badgeColor?: string; // 단일 배지 색상 (선택 사항)
  badges?: Badge[]; // 여러 개의 배지 (선택 사항)
  description: string; // 설명 텍스트 (선택 사항)
  image?: string; // 이미지 경로 (선택 사항)
  chartData?: { name: string; value: number }[];
  onClick: () => void; // 클릭 이벤트 핸들러
}

const HomeComponentBar: React.FC<HomeComponentBarProps> = ({
  title,
  badge,
  badgeColor = "", // 기본 단일 배지 색상
  badges = [], // 기본값 빈 배열
  description,
  image,
  chartData,
  onClick,
}) => {
  return (
    <div className={containerClass} onClick={onClick}>
      {/* 이미지 */}

      {/* 제목 */}
      <div className={titleWithIconClass}>
        <h1 className={titleClass}>{title}</h1>
      </div>

      {/* 설명 */}
      {description && (
        <div>
          <p className="text-xs text-center">{description}</p>
        </div>
      )}

      {/* TinyAreaChart */}
      {chartData && (
        <div className="w-full h-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFDA83" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid horizontal={false} vertical={false} />
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#FFDA83" fillOpacity={1} fill="url(#colorGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {image && (
        <div className="flex justify-center">
          <img
            src={image}
            alt={title}
            className="w-16 h-16 object-cover rounded-full"
          />
        </div>
      )}
      {/* 단일 배지 */}
      {badge && (
        <div className="flex justify-center">
          <span className={`${badgeClass} ${badgeColor}`}>{badge}</span>
        </div>
      )}

      {/* 여러 개의 배지 중 첫 번째만 중앙에 표시 */}
      {badges.length > 0 && (
        <div className="flex justify-center items-center">
          <span className={`${badgeClass} ${badges[0].color}`}>
            {badges[0].text}
          </span>
        </div>
      )}
    </div>
  );
};

export default HomeComponentBar;
