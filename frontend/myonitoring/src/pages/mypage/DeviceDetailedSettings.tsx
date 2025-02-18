import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setSelectedCatId } from "../../redux/slices/catSlice"; // Redux 액션
import Header from "../../components/Header";
import ExceptTopContentSection from "../../components/ExceptTopContentSection";
import WideButton from "../../components/WideButton";

const DeviceDetailedSettings: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const deviceId = parseInt(id || "", 10);

  // Redux 상태에서 기기 데이터 가져오기
  const device = useAppSelector((state) =>
    state.device.find((device) => device.id === deviceId)
  );

  // Redux 상태에서 선택된 고양이 ID 가져오기
  const selectedCatId = useAppSelector((state) => state.cat.selectedCatId);

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

  // 연동된 고양이 버튼 클릭 핸들러
  const handleCatAction = () => {
    if (device.catName) {
      // Redux에서 catName으로 고양이 ID 찾기
      const catIdFromName = selectedCatId; // 이미 외부에서 설정된 selectedCatId 사용
      if (catIdFromName) {
        dispatch(setSelectedCatId(catIdFromName)); // 선택된 고양이 ID 설정
        navigate(`/catinfoedit/${catIdFromName}`); // 고양이 상세 페이지로 이동
      } else {
        alert("연동된 고양이를 찾을 수 없습니다.");
      }
    } else {
      navigate("/register-cat"); // 새 고양이 등록 페이지로 이동
    }
  };

  return (
    <>
      <Header title="연동 기기 설정" onBack={() => navigate(-1)} />
      <ExceptTopContentSection>
        <div className="flex justify-center mb-6">
          <img
            src="/src/assets/images/device.png"
            alt="Device"
            className="w-32 h-auto object-contain"
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
                onClick={handleCatAction} // 수정된 핸들러 호출
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
          onClick={() => {}}
          bgColor="bg-[#595959]"
          textColor="text-white"
        />
      </footer>
    </>
  );
};

export default DeviceDetailedSettings;
