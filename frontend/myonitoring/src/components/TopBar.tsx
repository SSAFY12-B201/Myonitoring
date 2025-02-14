import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCatId } from "../redux/slices/catSlice";
import axios from "axios";
import { Notifications, ChatBubbleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { FaChevronRight } from "react-icons/fa"; // react-icons에서 아이콘 가져오기

interface Cat {
  id: number;
  name: string;
  profileImageUrl: string;
}

const TopBar: React.FC = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedCatId = useSelector((state: RootState) => state.cat.selectedCatId)

  // API 요청으로 고양이 데이터 가져오기
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await axios.get("/api/cats", {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBteWFpY3Jvc29mdC5jb20iLCJpZCI6MSwicm9sZSI6IkFETUlOIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJpYXQiOjE3MzkyNDU3NDksImV4cCI6MTc3MDc4MTc0OX0.Yr_U3xrz-WcyKL4xVzcKlWeooWS3AG0BU7-kYyyvD1vAJOzoYD3IeVOrLYeueyxGLuHNGutMP2448VOf0rj-xg`, // 실제 토큰 값 입력
          },
        });
        setCats(response.data);

        if (response.data.length > 0) {
          const currentCat = response.data.find((cat: Cat) => cat.id === selectedCatId);
          if (currentCat) {
            setSelectedCat(currentCat); // Redux와 일치하는 고양이를 선택
          } else {
            setSelectedCat(response.data[0]); // 기본값으로 첫 번째 고양이 선택
            dispatch(setSelectedCatId(response.data[0].id)); // Redux에 저장
          }
        }
      } catch (error) {
        console.error("Failed to fetch cats", error);
      }
    };

    fetchCats();
  }, [dispatch]);

  // 고양이 선택 처리
  const handleCatSelect = (cat: Cat) => {
    setSelectedCat(cat);
    dispatch(setSelectedCatId(cat.id)); // 선택된 고양이 ID를 Redux에 저장
    setIsDropdownOpen(false);
  };

  // 고양이 상세 페이지로 이동
  const handleCatDetail = (catId: number) => {
    navigate(`/catinfoedit/${catId}`);
  };

  return (
    <div className="relative">
      {/* 고정된 TopBar */}
      <div className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-3 bg-white z-50">
        {/* 왼쪽: 고양이 이미지와 이름 */}
        <div className="flex items-center">
          {selectedCat && (
            <>
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
            </>
          )}
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
                className="text-gray-500 text-lg mr-1 cursor-pointer hover:text-gray-700"
                onClick={(e) => {
                  e.stopPropagation(); // 부모 클릭 이벤트 전파 방지
                  dispatch(setSelectedCatId(cat.id)); // Redux 상태에 클릭한 고양이 ID 저장
                  handleCatDetail(cat.id); // 상세 페이지로 이동
                }}
              >
               <FaChevronRight/>
              </span>
            </div>
          ))}

          {/* 새로운 기기 등록 */}
          <div className="flex items-center justify-center p-3 mt-6 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
            <span className="text-gray-600 font-medium">새로운 기기 등록하기</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
