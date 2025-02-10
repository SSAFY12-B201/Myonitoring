import React from 'react';
import { Notifications, ChatBubbleOutline } from '@mui/icons-material';

const TopBar: React.FC = () => (
  <div className="flex items-center justify-between px-4 py-2 bg-transparent">
    {/* 왼쪽: 고양이 이미지와 이름 */}
    <div className="flex items-center">
      <img
        src="../public/logo_cat.png" // 고양이 이미지 URL
        alt="고양이"
        className="w-10 h-10 rounded-full mr-2"
      />
      <span className="text-lg font-medium">가을이</span>
      <span className="ml-1 text-gray-500">&#9662;</span> {/* ▼ 아이콘 */}
    </div>

    {/* 오른쪽: 알림 및 챗봇 아이콘 */}
    <div className="flex items-center space-x-4">
      <Notifications className="text-gray-800" style={{ fontSize: 24 }} />
      <ChatBubbleOutline className="text-gray-800" style={{ fontSize: 24 }} />
    </div>
  </div>
);

export default TopBar;
