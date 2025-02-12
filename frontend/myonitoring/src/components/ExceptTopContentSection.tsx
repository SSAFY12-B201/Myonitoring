// src/components/ContentSection.tsx
import React from "react";

interface ExceptTopContentSectionProps {
  children: React.ReactNode;
  className?: string; // 추가적인 클래스 이름을 받을 수 있도록 설정
}

const ExceptTopContentSection: React.FC<ExceptTopContentSectionProps> = ({ children, className }) => {
  return (
    <div className={`px-8 py-5 ${className}`}>
      {children}
    </div>
  );
};

export default ExceptTopContentSection;