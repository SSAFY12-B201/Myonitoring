import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux"; // Redux dispatch 사용
import { setSelectedCatId } from "../../redux/slices/catSlice"; // Redux 액션 가져오기
import Header from "../../components/Header";
import ExceptTopContentSection from "../../components/ExceptTopContentSection";
import WideButton from "../../components/WideButton";

const DeviceDetailedSettings: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { id: deviceId, registrationDate, serialNumber } = location.state || {}; // 디바이스 ID 포함

  const [catName, setCatName] = useState<string | null>(null); // 고양이 이름 상태
  const [catId, setCatId] = useState<number | null>(null); // 고양이 ID 상태
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태

  // 디바이스 상세 정보 가져오기
  useEffect(() => {
    const fetchDeviceDetails = async () => {
      try {
        setLoading(true); // 로딩 시작
        const response = await axios.get(`/api/devices/${deviceId}`, {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBteWFpY3Jvc29mdC5jb20iLCJpZCI6MSwicm9sZSI6IkFETUlOIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJpYXQiOjE3MzkyNDU3NDksImV4cCI6MTc3MDc4MTc0OX0.Yr_U3xrz-WcyKL4xVzcKlWeooWS3AG0BU7-kYyyvD1vAJOzoYD3IeVOrLYeueyxGLuHNGutMP2448VOf0rj-xg`, // 실제 토큰 값 입력
          },
        }); // GET 요청
        setCatName(response.data.cat ? response.data.cat.name : null); // 고양이 이름 설정
        setCatId(response.data.cat ? response.data.cat.id : null); // 고양이 ID 설정
        setError(null); // 에러 초기화
      } catch (err) {
        console.error("디바이스 상세 정보 가져오기 실패:", err);
        setError("디바이스 정보를 불러오는 중 오류가 발생했습니다."); // 에러 메시지 설정
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    if (deviceId) {
      fetchDeviceDetails();
    }
  }, [deviceId]);

  // 디바이스 삭제 처리
  const handleDeleteDevice = async () => {
    try {
      await axios.delete(`/api/devices/${deviceId}`, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBteWFpY3Jvc29mdC5jb20iLCJpZCI6MSwicm9sZSI6IkFETUlOIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJpYXQiOjE3MzkyNDU3NDksImV4cCI6MTc3MDc4MTc0OX0.Yr_U3xrz-WcyKL4xVzcKlWeooWS3AG0BU7-kYyyvD1vAJOzoYD3IeVOrLYeueyxGLuHNGutMP2448VOf0rj-xg`, // 실제 토큰 값 입력
        },
      }); // DELETE 요청
      navigate("/device-settings"); // DeviceSettings 페이지로 이동
    } catch (err) {
      console.error("디바이스 삭제 실패:", err);
      alert("디바이스 삭제 중 오류가 발생했습니다."); // 사용자 알림
    }
  };

  // 고양이 등록/수정 페이지로 이동 처리
  const handleCatAction = () => {
    if (catId) {
      dispatch(setSelectedCatId(catId)); 
      navigate(`/catinfoedit/:id`); 
    } else {
      navigate(`/register-cat`); // 새 고양이 등록 페이지로 이동
    }
  };

  return (
    <>
      {/* 상단 헤더 */}
      <Header title="연동 기기 설정" onBack={() => navigate(-1)} />

      {/* 콘텐츠 섹션 */}
      <ExceptTopContentSection>
        {/* 로딩 상태 */}
        {loading && <p className="text-center text-gray-600">로딩 중...</p>}

        {/* 에러 상태 */}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            {/* 기기 이미지 */}
            <div className="flex justify-center mb-6">
              <img
                src="/src/assets/images/device.png"
                alt="Device"
                className="w-32 h-auto object-contain" // 이미지 크기 조정
              />
            </div>

            <div className="max-w-md mx-auto mt-8 space-y-4">
              {/* 연동된 고양이 */}
              <div className="border-b border-gray-300 py-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  연동된 고양이
                </label>
                <div className="flex justify-between items-center">
                  <span className="text-black">
                    {catName || "등록된 고양이가 없습니다."}
                  </span>
                  <button
                    onClick={handleCatAction} // 고양이 등록/수정 함수 호출
                    className="text-gray-400 text-lg"
                  >
                    &#x276F;
                  </button>
                </div>
              </div>

              {/* 기기 시리얼 넘버 */}
              <div className="border-b border-gray-300 py-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  기기 시리얼 넘버
                </label>
                <span className="text-black">{serialNumber}</span>
              </div>

              {/* 기기 등록일 */}
              <div className="border-b border-gray-300 py-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  기기 등록일
                </label>
                <span className="text-black">{registrationDate}</span>
              </div>
            </div>
          </>
        )}
      </ExceptTopContentSection>

      {/* 기기 삭제 버튼 */}
      <footer className="fixed bottom-2 left-0 w-full p-4">
        <WideButton
          text="기기 삭제"
          onClick={handleDeleteDevice} // 삭제 처리 함수 연결
          bgColor="bg-[#595959]" // 주황색 배경
          textColor="text-white" // 흰색 텍스트
        />
      </footer>
    </>
  );
};

export default DeviceDetailedSettings;
