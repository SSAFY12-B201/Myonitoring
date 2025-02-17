import React, { ReactNode } from "react";

interface InputProps {
  label: ReactNode; // 입력 필드의 레이블 (문자열 또는 JSX 요소)
  type: "text" | "date" | "time" | "tel" | "select" | "textarea" | "number" | "email"; // 입력 필드의 타입
  value: string; // 입력된 값
  onChange: (value: string) => void; // 값 변경 핸들러
  placeholder?: string; // 플레이스홀더 텍스트
  options?: string[]; // 드롭다운 옵션 (type이 select일 때 사용)
  error?: boolean; // 에러 여부
  errorMessage?: string; // 에러 메시지
  className?: string; // 추가적인 클래스명 (선택 사항)
  disabled?: boolean; // disabled 속성 추가
}

const Input: React.FC<InputProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder = "",
  options = [],
  error = false, // 에러 여부 기본값 false
  errorMessage = "", // 에러 메시지 기본값 빈 문자열
  className = "", // 추가적인 클래스명 기본값 빈 문자열
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const inputValue = e.target.value;

    if (type === "tel") {
      // 핸드폰 번호 형식 검증 (숫자와 하이픈만 허용)
      const phoneNumberRegex = /^[0-9-]*$/;
      if (!phoneNumberRegex.test(inputValue)) return; // 잘못된 형식 차단

      // 하이픈 자동 추가 (010-0000-0000 형식)
      let formattedValue = inputValue.replace(/[^0-9]/g, ""); // 숫자만 남김
      if (formattedValue.length > 3 && formattedValue.length <= 7) {
        formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(3)}`;
      } else if (formattedValue.length > 7) {
        formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(
          3,
          7
        )}-${formattedValue.slice(7, 11)}`;
      }
      onChange(formattedValue);
      return;
    }

    onChange(inputValue); // 값 업데이트
  };

  return (
    <div className={`mb-${error ? "2" : "6"}`}>
      {/* 레이블 */}
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      {/* 다중 줄 텍스트 (textarea) */}
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 ${
            error ? "focus:ring-red-500" : "focus:ring-gray-500"
          } ${className}`}
          rows={4}
        />
      ) : type === "select" ? (
        <select
          value={value}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 ${
            error ? "focus:ring-red-500" : "focus:ring-gray-500"
          } ${className}`}
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
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 ${
            error ? "focus:ring-red-500" : "focus:ring-gray-500"
          } ${className}`}
        />
      )}

      {/* 오류 메시지 */}
      {error && errorMessage && (
        <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default Input;
