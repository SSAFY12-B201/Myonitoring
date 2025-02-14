import { useLocation, useNavigate } from "react-router-dom"; // React Router 사용
import Header from "../../components/Header";
import termsDetails from "../../data/TermsDetails";
import ExceptTopContentSection from "../../components/ExceptTopContentSection";
import { motion } from "framer-motion";
import {
  slideInVariants,
  slideOutVariants,
  defaultTransition,
} from "../../animations";

const slideVariants = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
};

const slideTransition = {
  duration: 0.5,
  ease: "easeInOut",
};

const AgreementDetail = () => {
  const navigate = useNavigate(); // 화면 전환을 위한 useNavigate 훅
  const location = useLocation();
  const { type } = location.state || {}; // 전달받은 type 값
  // 뒤로 가기 여부 확인
  const isBackNavigation = location.state?.isBack;

  // 동적으로 애니메이션 설정
  const animationVariants = isBackNavigation
    ? slideOutVariants
    : slideInVariants;

  const detail = termsDetails[type] || {
    title: "유효하지 않은 항목",
    content: [],
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={animationVariants}
      transition={defaultTransition}
    >
      <div>
        {/* 상단 헤더 */}
        <Header title="약관 상세 내용" onBack={() => navigate(-1)} />

        <ExceptTopContentSection>
          {/* 상세 내용 */}
          <main>
            {/* 제목 */}
            <h2 className="text-md font-bold mb-4">{detail.title}</h2>

            {/* 소제목과 내용 */}
            <div className="space-y-6">
              {detail.content.map((item, index) => (
                <div key={index}>
                  {/* 소제목 */}
                  <h3 className="text-sm font-semibold mb-2">
                    {item.subtitle}
                  </h3>
                  {/* 내용 */}
                  <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-wrap">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </main>
        </ExceptTopContentSection>
      </div>
    </motion.div>
  );
};

export default AgreementDetail;
