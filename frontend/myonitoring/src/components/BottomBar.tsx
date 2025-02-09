import React, { useState } from 'react';
import { Home, BarChart, Schedule, MedicalServices, Person } from '@mui/icons-material';

const BottomBar: React.FC = () => {
  // 현재 활성화된 탭 상태 관리
  const [activeTab, setActiveTab] = useState('home');

  // 탭 데이터 정의
  const tabs = [
    { id: 'schedule', label: '예약', icon: <Schedule /> },
    { id: 'report', label: '리포트', icon: <BarChart /> },
    { id: 'home', label: '홈', icon: <Home /> },
    { id: 'medical', label: '의료', icon: <MedicalServices /> },
    { id: 'profile', label: '내 정보', icon: <Person /> },
  ];

  return (
    <div className="flex justify-around bg-white items-center py-2 w-full">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex flex-col items-center cursor-pointer ${
            activeTab === tab.id ? 'text-gray-800' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {/* 아이콘 */}
          <div className="text-2xl">{tab.icon}</div>
          {/* 라벨 */}
          <span className="text-xs mt-1">{tab.label}</span>
        </div>
      ))}
    </div>
  );
};

export default BottomBar;
