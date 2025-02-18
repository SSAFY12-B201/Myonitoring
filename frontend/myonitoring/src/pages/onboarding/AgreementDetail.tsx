import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import termsDetails from "../../data/TermsDetails";
import ExceptTopContentSection from "../../components/ExceptTopContentSection";
import { motion } from "framer-motion";
import { fadeVariants, fadeTransition } from "../../animations";

const slideVariants = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
};

const slideTransition = {
  duration: 0.3,
  ease: "easeInOut",
};

const AgreementDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = location.state || {}; // 전달받은 type 값

  // 약관 상세 데이터 가져오기
  const detail = termsDetails[type] || {
    title: "유효하지 않은 항목",
    content: [],
  };

  return (
    <motion.div>
      <div>
        {/* 상단 헤더 */}
        <Header
          title="약관 상세 내용"
          onBack={() =>
            navigate("/agreements", { state: { fromDetail: true } })
          }
        />

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
