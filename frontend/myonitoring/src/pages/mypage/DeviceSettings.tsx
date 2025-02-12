import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 훅
import Header from "../../components/Header";
import ExceptTopContentSection from "../../components/ExceptTopContentSection";
import WideButton from "../../components/WideButton";

// 샘플 데이터 (device_data.json)
const deviceData = [
  {
    id: 1,
    registrationDate: "2025-02-03",
    serialNumber: "452B54",
    cat: {
      id: 1,
      name: "가을이",
    },
    users: [
      {
        id: 1,
        username: "testUser",
      },
    ],
  },
  {
    id: 2,
    registrationDate: "2025-02-03",
    serialNumber: "612C56",
    cat: null, // 고양이 없음
    users: [
      {
        id: 1,
        username: "testUser",
      },
    ],
  },
];

const DeviceSettings = () => {
  const navigate = useNavigate(); // useNavigate 훅 선언

  const handleAddDevice = () => {
    console.log("기기 추가 버튼이 클릭되었습니다.");
    // 기기 추가 로직을 여기에 작성하세요.
  };

  return (
    <>
      <Header title="연동 기기 설정" onBack={() => navigate(-1)} />
      <ExceptTopContentSection>
        <div className="max-w-md mx-auto mt-4">
          {/* 연동된 기기 리스트 */}
          <div className="space-y-4 mb-20">
            {deviceData.map((device) => (
              <div
                key={device.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  device.cat ? "bg-yellow" : "bg-gray-200"
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
                    {device.cat ? device.cat.name : "등록된 고양이가 없습니다."}
                  </p>
                </div>
                {/* 화살표 아이콘 */}
                <button
                  onClick={() =>
                    navigate(`/device-detail`, {
                      state: {
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
