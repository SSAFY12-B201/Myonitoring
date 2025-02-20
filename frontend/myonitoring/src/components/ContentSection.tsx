// src/components/ContentSection.tsx
import React from "react";

interface ContentSectionProps {
  children: React.ReactNode;
  className?: string; // 추가적인 클래스 이름을 받을 수 있도록 설정
}

const ContentSection: React.FC<ContentSectionProps> = ({ children, className }) => {
  return (
    <div className={`px-8 py-5 mt-20 ${className}`}>
      {children}
    </div>
  );
};

export default ContentSection;
