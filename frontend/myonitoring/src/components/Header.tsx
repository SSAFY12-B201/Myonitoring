// components/Header.tsx
import React from "react";

interface HeaderProps {
  title: string; // 헤더 제목
  onBack?: () => void; // 뒤로가기 버튼 클릭 이벤트 (선택적)
}

const Header: React.FC<HeaderProps> = ({ title, onBack }) => {
  return (
    <header className="flex items-center p-4 ml-2">
      {onBack && (
        <button onClick={onBack} className="text-gray-500 text-lg">
          <span>&#x276E;</span>
        </button>
      )}
      <h1 className="flex-grow text-center text-sm font-bold">{title}</h1>
    </header>
  );
};

export default Header;
