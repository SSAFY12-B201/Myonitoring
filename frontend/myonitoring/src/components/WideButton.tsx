import React from "react";

interface ButtonProps {
  text: string; // 버튼에 표시될 텍스트
  onClick?: () => void; // 클릭 이벤트 핸들러 (선택적)
  disabled?: boolean; // 버튼 비활성화 여부
  bgColor?: string; // 배경색 클래스명
  textColor?: string; // 텍스트 색상 클래스명
}

const WideButton: React.FC<ButtonProps> = ({
  text,
  onClick,
  disabled = false,
  bgColor = "bg-darkGray", // 기본값: 어두운 회색
  textColor = "text-white", // 기본값: 흰색 텍스트
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 rounded-lg font-bold ${bgColor} ${textColor} ${
        disabled ? "cursor-not-allowed opacity-50" : "hover:opacity-90"
      }`}
    >
      {text}
    </button>
  );
};

export default WideButton;