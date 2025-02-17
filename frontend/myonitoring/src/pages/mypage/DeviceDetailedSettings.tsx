import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hooks"; // Redux 훅
import { removeDevice } from "../../redux/slices/deviceSlice"; // Redux 액션
import Header from "../../components/Header";
import ExceptTopContentSection from "../../components/ExceptTopContentSection";
import WideButton from "../../components/WideButton";

const DeviceDetailedSettings: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>(); // URL 파라미터에서 기기 ID 가져오기
  const deviceId = parseInt(id || "", 10); // 문자열 ID를 숫자로 변환

  console.log(id);
  console.log(deviceId);

  // Redux 상태에서 기기 데이터 가져오기
  const device = useAppSelector((state) =>
    state.device.find((device) => device.id === deviceId)
  );

  if (!device) {
    return (
      <div className="text-center text-red-500">
        <p>기기 정보를 찾을 수 없습니다.</p>
        <button
          className="mt-4 text-blue-500 underline"
          onClick={() => navigate("/device-settings")}
        >
          기기 목록으로 돌아가기
        </button>
      </div>
    );
  }

  // 고양이 등록/수정 페이지로 이동 처리
  const handleCatAction = () => {
    if (device.catName) {
      navigate(`/catinfoedit/${deviceId}`); // 고양이 정보 수정 페이지로 이동
    } else {
      navigate(`/register-cat`); // 새 고양이 등록 페이지로 이동
    }
  };

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
  return (
    <>
      {/* 상단 헤더 */}
      <Header title="연동 기기 설정" onBack={() => navigate(-1)} />

      {/* 콘텐츠 섹션 */}
      <ExceptTopContentSection>
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
                {device.catName || "등록된 고양이가 없습니다."}
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
            <span className="text-black">{device.serialNumber}</span>
          </div>

          {/* 기기 등록일 */}
          <div className="border-b border-gray-300 py-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              기기 등록일
            </label>
            <span className="text-black">{device.registrationDate}</span>
          </div>
        </div>
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
