import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeVariants, fadeTransition } from "../../animations";
import WideButton from "../../components/WideButton";
import Header from "../../components/Header";
import ExceptTopContentSection from "../../components/ExceptTopContentSection";

const Agreement = () => {
  const [allChecked, setAllChecked] = useState(false);
  const [terms, setTerms] = useState({
    termsOfService: false,
    privacyPolicy: false,
    marketingInfo: false,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const handleAllCheck = () => {
    const newValue = !allChecked;
    setAllChecked(newValue);
    setTerms({
      termsOfService: newValue,
      privacyPolicy: newValue,
      marketingInfo: newValue,
    });
  };

  const handleIndividualCheck = (key: string) => {
    const newTerms = { ...terms, [key]: !terms[key as keyof typeof terms] };
    setTerms(newTerms);
    setAllChecked(Object.values(newTerms).every((value) => value));
  };

  // 상세 화면으로 이동하는 함수
  const navigateToDetail = (type: string) => {
    navigate(`/agreement-detail`, { state: { type, fromAgreement: true } }); // 출발 정보를 전달
  };

  // 다음 단계로 이동하는 함수
  const handleNext = () => {
    navigate(`/user-info`);
  };

  // 뒤로가기 핸들러 (로그인 화면으로 이동)
  const handleBack = () => {
    navigate("/login", { replace: true }); // 로그인 화면으로 이동하며 히스토리를 대체
  };

  return (
    <motion.div>
      <div className="min-h-screen bg-white flex flex-col">
        {/* 상단 헤더 */}
        <Header title="약관 동의" onBack={handleBack} />
        {/* 설명 */}
        <ExceptTopContentSection>
          <main className="flex-grow">
            <h2 className="text-lg font-semibold mb-2">
              서비스 이용을 위해 아래 약관에 동의해주세요.
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              묘니터링 서비스 이용을 위해서는 아래의 약관 내용 동의가
              필요합니다.
            </p>

            {/* 약관 리스트 */}
            <div className="space-y-4">
              {/* 전체 동의 */}
              <label className="flex items-center py-3 border-b">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={handleAllCheck}
                  className="w-5 h-5 accent-yellow mr-3"
                />
                <span className="text-sm">약관 전체 동의</span>
              </label>

              {/* 이용 약관 동의 */}
              <label className="flex justify-between items-center py-3 border-b">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={terms.termsOfService}
                    onChange={() => handleIndividualCheck("termsOfService")}
                    className="w-5 h-5 accent-yellow mr-3"
                  />
                  <span className="text-sm">서비스 이용 동의 (필수)</span>
                </div>
                <button
                  onClick={() => navigateToDetail("termsOfService")}
                  className="text-yellow text-sm"
                >
                  {">"}
                </button>
              </label>

              {/* 개인정보 수집 및 이용 동의 */}
              <label className="flex justify-between items-center py-3 border-b">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={terms.privacyPolicy}
                    onChange={() => handleIndividualCheck("privacyPolicy")}
                    className="w-5 h-5 accent-yellow mr-3"
                  />
                  <span className="text-sm">
                    개인정보 수집 이용 동의 (필수)
                  </span>
                </div>
                <button
                  onClick={() => navigateToDetail("privacyPolicy")}
                  className="text-yellow text-sm"
                >
                  {">"}
                </button>
              </label>

              {/* 광고성 정보 수집 동의 */}
              <label className="flex justify-between items-center py-3 border-b">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={terms.marketingInfo}
                    onChange={() => handleIndividualCheck("marketingInfo")}
                    className="w-5 h-5 accent-yellow mr-3"
                  />
                  <span className="text-sm">광고성 정보 수신 동의</span>
                </div>
                <button
                  onClick={() => navigateToDetail("marketingInfo")}
                  className="text-yellow text-sm"
                >
                  {">"}
                </button>
              </label>
            </div>
          </main>
        </ExceptTopContentSection>

        {/* 하단 버튼 */}
        <footer className="fixed bottom-0 left-0 w-full p-4 bg-white">
          {/* WideButton 컴포넌트 사용 */}
          <WideButton
            text="다음"
            onClick={handleNext}
            disabled={!terms.termsOfService || !terms.privacyPolicy} // 필수 항목 체크 여부에 따라 활성화/비활성화
            bgColor={
              terms.termsOfService && terms.privacyPolicy
                ? "bg-darkGray" // 활성화 상태
                : "bg-lightGray cursor-not-allowed" // 비활성화 상태
            }
            textColor="text-white"
          />
        </footer>
      </div>
    </motion.div>
  );
};

export default Agreement;
