import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios"; // Axios 인스턴스 임포트 
import Header from "../../components/Header";
import ExceptTopContentSection from "../../components/ExceptTopContentSection";
import WideButton from "../../components/WideButton";

const DeviceSettings = () => {
  const navigate = useNavigate(); // useNavigate 훅 선언
  const [deviceData, setDeviceData] = useState<any[]>([]); // API 데이터 상태
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태

  // API 데이터 가져오기
  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const token = localStorage.getItem("jwt_access_token");
        if (!token) throw new Error("No access token found");

        setLoading(true); // 로딩 시작
        const response = await api.get("/api/devices", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDeviceData(response.data); // 데이터 설정
        setError(null); // 에러 초기화
      } catch (err) {
        setError("기기를 불러오는 중 오류가 발생했습니다."); // 에러 메시지 설정
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchDeviceData();
  }, []);

  const handleAddDevice = () => {
    console.log("기기 추가 버튼이 클릭되었습니다.");
    // 기기 추가 로직을 여기에 작성하세요.
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
              {deviceData.map((device) => (
                <div
                  key={device.id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    device.cat ? "bg-yellow-100" : "bg-gray-200"
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
                      {device.cat
                        ? device.cat.name
                        : "등록된 고양이가 없습니다."}
                    </p>
                  </div>
                  {/* 화살표 아이콘 */}
                  <button
                    onClick={() =>
                      navigate(`/device-detail`, {
                        state: {
                          id: device.id,
                          registrationDate: device.registrationDate,
                          serialNumber: device.serialNumber,
                          cat: device.cat,
                        },
                      })
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
              bgColor="bg-[#595959]" // 주황색 배경
              textColor="text-white" // 흰색 텍스트
            />
          </footer>
        </div>
      </ExceptTopContentSection>
    </>
  );
};

export default DeviceSettings;
