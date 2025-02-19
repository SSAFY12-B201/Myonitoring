import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { api } from "../../api/axios"; // Axios 인스턴스 임포트
import { RootState } from "../../redux/store";
import TopBar from "../../components/TopBar";
import BottomBar from "../../components/BottomBar";
import ContentSection from "../../components/ContentSection";
import EyeHealthScale from "../../components/GraphComponents/EyeHealthScale";
import EyeInfoBox from "../../components/GraphComponents/EyeInfoBox";

// 질병명 매핑 (영어 -> 한국어)
const diseaseNamesMap: Record<string, string> = {
  blepharitis_prob: "안검염",
  corneal_ulcer_prob: "각막 궤양",
  conjunctivitis_prob: "결막염",
  corneal_sequestrum_prob: "각막부골편",
  non_ulcerative_keratitis_prob: "비궤양성 각막염",
};

// JSON 데이터 타입 정의
interface DiseaseData {
  [key: string]: {
    right: number;
    left: number;
  };
}

interface ImageData {
  [key: string]: {
    left: string;
    right: string;
  };
}

interface CatEyeData {
  date_time?: string;
  images?: {
    left: string;
    right: string;
  };
  data?: DiseaseData[];
  message?: string; // 증상이 없을 때 메시지
}

const today = new Date().toISOString().split("T")[0]; // 오늘 날짜 (YYYY-MM-DD)

const CatEyeInfo: React.FC = () => {
  const [data, setData] = useState<CatEyeData | null>(null); // 데이터를 저장할 상태
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 관리
  const [error, setError] = useState<string | null>(null); // 에러 상태 관리

  const selectedCatId = useSelector(
    (state: RootState) => state.cat.selectedCatId
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCatId) return;

      try {
        const token = localStorage.getItem("jwt_access_token");
        if (!token) throw new Error("No access token found");
        setLoading(true);
        const response = await api.get(
          `/api/eye/${selectedCatId}/detail?day=${today}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json", // JSON 응답 명시
            },
          }
        );
        setData(response.data);
        setError(null); // 에러 초기화
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCatId]);

  return (
    <>
      <TopBar />
      <ContentSection>
        <div className="mb-16">
          {/* 로딩 상태 */}
          {loading && !error && (
            <p className="text-center text-gray-600">데이터를 불러오는 중...</p>
          )}

          {/* 에러 상태 */}
          {error && <p className="text-center text-red-500">{error}</p>}

          {/* 데이터가 있을 경우 */}
          {!loading && !error && data && (
            <>
              {/* 증상이 없을 경우 */}
              {data.message ? (
                <div className="space-y-6">
                  {/* 안구 건강 척도 */}
                  <EyeHealthScale />

                  <hr className="mt-6 mb-6 border-gray-300" />

                  {/* 이미지 데이터 렌더링 */}
                  {data.images && (
                    <div className="flex justify-center items-center space-x-4 mt-6">
                      {/* 왼쪽 눈 이미지 */}
                      {data.images.left && (
                        <img
                          src={data.images.left}
                          alt="왼쪽 눈 이미지"
                          className="w-36 h-28 rounded-lg shadow-sm border-4 border-gray-500"
                        />
                      )}
                      {/* 오른쪽 눈 이미지 */}
                      {data.images.right && (
                        <img
                          src={data.images.right}
                          alt="오른쪽 눈 이미지"
                          className="w-36 h-28 rounded-lg shadow-sm border-4 border-gray-500"
                        />
                      )}
                    </div>
                  )}

                  <hr className="mt-6 mb-6 border-gray-300" />

                  {/* 안구 건강 상태 메시지 */}
                  <div className="p-6 bg-green-50 rounded-lg border border-green-300 shadow-sm">
                    <h1 className="text-lg font-bold text-green-700 mb-2">
                      고양이의 안구 건강에 문제가 없습니다.
                    </h1>
                    <p className="text-sm text-gray-800">{data.message}</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* 증상이 있을 경우 */}
                  <div>
                  <div className="flex items-center">
                      {/* 아이콘 */}
                      <img
                        src="/bell.png"
                        alt="알림 아이콘"
                        className="w-6 h-6 mr-2" // 아이콘 크기와 간격 조정
                      />
                      {/* 제목 */}
                      <h1 className="text-xl font-bold text-black">
                        AI 분석 결과{" "}
                        <span className="text-red-500">의심 증상 발견</span>
                      </h1>
                    </div>
                    {/* 부제목 */}
                    <p className="text-sm text-gray-800 mt-2">
                      아래와 같은 증상이 있을 수 있습니다.
                    </p>
                    {/* 확인일 */}
                    <p className="text-sm text-gray-600 mt-1">
                      확인일{" "}
                      {data.date_time
                        ? new Date(data.date_time).toLocaleDateString("ko-KR")
                        : "날짜 정보 없음"}
                    </p>
                  </div>

                  <hr className="mt-6 mb-6 border-gray-300" />

                  {/* 이미지 데이터 렌더링 */}
                  {data.images && (
                    <div className="flex justify-center items-center space-x-4 mt-6">
                      {/* 왼쪽 눈 이미지 */}
                      {data.images.left && (
                        <img
                          src={data.images.left}
                          alt="왼쪽 눈 이미지"
                          className="w-36 h-28 rounded-3xl shadow-sm border-4 border-orange"
                        />
                      )}
                      {/* 오른쪽 눈 이미지 */}
                      {data.images.right && (
                        <img
                          src={data.images.right}
                          alt="오른쪽 눈 이미지"
                          className="w-36 h-28 rounded-3xl shadow-sm border-4 border-orange"
                        />
                      )}
                    </div>
                  )}

                  <hr className="mt-6 mb-6 border-gray-300" />

                  {/* 안구 건강 척도 */}
                  <EyeHealthScale />

                  {/* EyeInfoBox 컴포넌트 반복 렌더링 */}
                  {data.data?.map((diseaseData, index) => {
                    const key = Object.keys(diseaseData)[0]; // 첫 번째 키 가져오기
                    const values = diseaseData[key]; // 해당 키의 값 가져오기

                    return (
                      <EyeInfoBox
                        key={index}
                        symptom={diseaseNamesMap[key] || key} // 영어 -> 한국어 변환
                        rightEyeProbability={values.right * 100} // 소수 -> 퍼센트 변환
                        leftEyeProbability={values.left * 100} // 소수 -> 퍼센트 변환
                      />
                    );
                  })}
                </>
              )}
            </>
          )}
        </div>
      </ContentSection>
      <BottomBar />
    </>
  );
};

export default CatEyeInfo;
