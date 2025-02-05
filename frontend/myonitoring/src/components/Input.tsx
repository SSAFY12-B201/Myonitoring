import React from "react";

interface InputProps {
  label: string; // 입력 필드의 레이블
  type: "text" | "date" | "time" | "tel" | "select"; // 입력 필드의 타입
  value: string; // 입력된 값
  onChange: (value: string) => void; // 값 변경 핸들러
  placeholder?: string; // 플레이스홀더 텍스트
  options?: string[]; // 드롭다운 옵션 (type이 select일 때 사용)
}

const Input: React.FC<InputProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder = "",
  options = [],
}) => {
  return (
    <div className="mb-6">
      {/* 레이블 */}
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {/* 입력 필드 */}
      {type === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <option value="" disabled>
            {placeholder || "선택하세요"}
          </option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      )}
    </div>
  );
};

export default Input;
