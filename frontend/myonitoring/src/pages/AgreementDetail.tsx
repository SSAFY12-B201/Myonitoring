import { useLocation, useNavigate } from "react-router-dom"; // React Router 사용
import Header from "../components/Header";
import termsDetails from "../data/TermsDetails";


const AgreementDetail = () => {
  const navigate = useNavigate(); // 화면 전환을 위한 useNavigate 훅
  const location = useLocation();
  const { type } = location.state || {}; // 전달받은 type 값

  const detail = termsDetails[type] || { title: "유효하지 않은 항목", content: [] };

  return (
    <div>
      {/* 상단 헤더 */}
      <Header title="약관 상세 내용" onBack={() => navigate(-1)} />

      {/* 상세 내용 */}
      <main className="p-6">
        {/* 제목 */}
        <h2 className="text-md font-bold mb-4">{detail.title}</h2>

        {/* 소제목과 내용 */}
        <div className="space-y-6">
          {detail.content.map((item, index) => (
            <div key={index}>
              {/* 소제목 */}
              <h3 className="text-sm font-semibold mb-2">{item.subtitle}</h3>
              {/* 내용 */}
              <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-wrap">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AgreementDetail;
