import React, { useState } from "react";
import { Notifications, ChatBubbleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface Cat {
  id: number;
  name: string;
  profileImageUrl: string;
}

const cats: Cat[] = [
  {
    id: 1,
    name: "가을이",
    profileImageUrl: "../public/logo_cat.png",
  },
  {
    id: 2,
    name: "현덩이",
    profileImageUrl: "../public/logo_cat.png",
  },
];

const TopBar: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<Cat>(cats[0]); // 기본 선택된 고양이
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate(); // 페이지 이동을 위한 hook

  const handleCatSelect = (cat: Cat) => {
    setSelectedCat(cat);
    setIsDropdownOpen(false);
  };

  const handleCatDetail = (catId: number) => {
    navigate(`/cat-detail/${catId}`); // 고양이 상세 페이지로 이동
  };

  return (
    <div className="relative">
      {/* 고정된 TopBar */}
      <div className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-3 bg-white z-50">
        {/* 왼쪽: 고양이 이미지와 이름 */}
        <div className="flex items-center">
          <img
            src={selectedCat.profileImageUrl}
            alt="고양이"
            className="w-10 h-10 rounded-full mr-3"
          />
          <span className="text-lg font-semibold">{selectedCat.name}</span>
          <span
            className="ml-2 text-gray-500 cursor-pointer text-xl"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            &#9662; {/* ▼ 아이콘 */}
          </span>
        </div>

        {/* 오른쪽: 알림 및 챗봇 아이콘 */}
        <div className="flex items-center space-x-4">
          <Notifications className="text-gray-700" style={{ fontSize: 24 }} />
          <ChatBubbleOutline className="text-gray-700" style={{ fontSize: 24 }} />
        </div>
      </div>

      {/* 드롭다운 메뉴 */}
      <div
        className={`fixed top-[60px] left-0 w-full bg-white border-t border-gray-200 z-40 rounded-b-lg shadow-md transition-all duration-300 ease-in-out transform ${
          isDropdownOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
        } origin-top`}
      >
        <div className="p-4">
          {/* 고양이 리스트 */}
          {cats.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => handleCatSelect(cat)}
            >
              <div className="flex items-center">
                <img
                  src={cat.profileImageUrl}
                  alt={cat.name}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <span className="text-gray-800 font-medium">{cat.name}</span>
              </div>
              <span
                className="text-gray-500 text-lg cursor-pointer hover:text-gray-700"
                onClick={(e) => {
                  e.stopPropagation(); // 부모 클릭 이벤트 전파 방지
                  handleCatDetail(cat.id); // 상세 페이지로 이동
                }}
              >
                &#9654; {/* ▶ 아이콘 */}
              </span>
            </div>
          ))}

          {/* 새로운 기기 등록 */}
          <div className="flex items-center justify-center p-3 mt-6 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
            <span className="text-gray-600 font-medium">+ 새로운 기기 등록하기</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
