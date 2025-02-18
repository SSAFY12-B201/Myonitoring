import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios"; // Axios 인스턴스 사용
import Header from "../../components/Header";
import ExceptTopContentSection from "../../components/ExceptTopContentSection";
import WideButton from "../../components/WideButton";
import { useAppDispatch, useAppSelector } from "../../redux/hooks"; // Redux 훅
import { setDevices } from "../../redux/slices/deviceSlice"; // Redux 액션
import { setSelectedCatId } from "../../redux/slices/catSlice"; // Redux 액션

const DeviceSettings = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const devices = useAppSelector((state) => state.device); // Redux 상태에서 기기 데이터 가져오기

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 디바이스 데이터 조회
  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("jwt_access_token"); // 토큰 가져오기
        if (!token) throw new Error("No access token found");

        const response = await api.get("/api/devices", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Redux 상태에 디바이스 데이터 설정
        dispatch(setDevices(response.data)); // catId 포함 데이터 저장
        setError(null); // 에러 초기화
      } catch (err) {
        console.error(err);
        setError("기기를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceData();
  }, [dispatch]);

  const handleAddDevice = () => {
    console.log("기기 추가 버튼이 클릭되었습니다.");
    navigate("/device-guide"); // 기기 추가 페이지로 이동
  };

  const handleDeviceClick = (deviceId: number, catId: number | null) => {
    if (catId !== null) {
      dispatch(setSelectedCatId(catId)); // 선택된 고양이 ID를 Redux 상태에 저장
    }
    navigate(`/device-detail/${deviceId}`); // 상세 페이지로 이동
  };

  return (
    <>
      <Header title="연동 기기 설정" onBack={() => navigate(-1)} />
      <ExceptTopContentSection>
        <div className="max-w-md mx-auto">
          {/* 로딩 상태 */}
          {loading && <p className="text-center text-gray-600">로딩 중...</p>}

          {/* 에러 상태 */}
          {error && <p className="text-center text-red-500">{error}</p>}

          {/* 연동된 기기 리스트 */}
          {!loading && !error && (
            <div className="space-y-4 mb-20">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    device.catName ? "bg-yellow" : "bg-gray-200"
                  }`}
                >
                  {/* 기기 정보 */}
                  <div className="flex-grow ml-2">
                    <p className="font-bold text-sm text-gray-700">
                      <span className="text-gray-600">시리얼 번호 :</span>{" "}
                      {device.serialNumber}
                    </p>
                    <p className="text-xs text-gray-700 mt-1">
                      <span className="text-gray-700">고양이 :</span>{" "}
                      {device.catName || "등록된 고양이가 없습니다."}
                    </p>
                  </div>
                  {/* 화살표 아이콘 */}
                  <button
                    onClick={() =>
                      handleDeviceClick(device.id, device.catId)
                    }
                  >
                    <span className="text-gray-700 text-lg px-2">&#x276F;</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 기기 추가 버튼 */}
          <footer className="fixed bottom-2 left-0 w-full p-4">
            <WideButton
              text="기기 추가"
              onClick={handleAddDevice}
              bgColor="bg-[#595959]"
              textColor="text-white"
            />
          </footer>
        </div>
      </ExceptTopContentSection>
    </>
  );
};

export default DeviceSettings;
