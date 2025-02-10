import React from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import ContentSection from "../components/ContentSection";
import { useAppSelector } from "../redux/hooks";

const Notification: React.FC = () => {
  const navigate = useNavigate(); // 뒤로가기 네비게이션
  const notifications = useAppSelector((state) => state.notification.notifications);

  // 날짜별로 알림 그룹화
  const groupedNotifications = notifications.reduce((groups: any, notification) => {
    const date = notification.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});

  // 알림 유형에 따른 아이콘 및 색상 반환
  const getIcon = (type: string) => {
    switch (type) {
      case "error":
        return (
          <div className="bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full">
            ✖
          </div>
        );
      case "success":
        return (
          <div className="bg-green-500 text-white w-8 h-8 flex items-center justify-center rounded-full">
            ✔
          </div>
        );
      case "warning":
        return (
          <div className="bg-yellow text-white w-8 h-8 flex items-center justify-center rounded-full">
            !
          </div>
        );
      case "info":
        return (
          <div className="bg-blue text-white w-8 h-8 flex items-center justify-center rounded-full">
            ℹ
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* 상단 헤더 */}
      <Header title="알림" onBack={() => navigate(-1)} />

      {/* 본문 내용 */}
      <ContentSection>
        {Object.keys(groupedNotifications)
          .sort((a, b) => (a > b ? -1 : 1)) // 날짜 내림차순 정렬
          .map((date) => (
            <div key={date} className="mb-6">
              {/* 날짜 */}
              <h2 className="text-sm font-bold text-gray-600 mb-4">{date}</h2>

              {/* 알림 리스트 */}
              <div className="space-y-4">
                {groupedNotifications[date].map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-start bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                  >
                    {/* 아이콘 */}
                    {getIcon(item.type)}

                    {/* 내용 */}
                    <div className="ml-4">
                      <h3 className="text-sm font-bold text-gray-800">{item.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </ContentSection>
    </>
  );
};

export default Notification;
