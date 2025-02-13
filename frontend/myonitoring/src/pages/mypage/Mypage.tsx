import { FaCog, FaFileAlt, FaChevronRight } from "react-icons/fa"; // react-icons에서 아이콘 가져오기
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 훅
import Header from "../../components/Header";
import ExceptTopContentSection from "../../components/ExceptTopContentSection";
import BottomBar from "../../components/BottomBar";

const MyPage = () => {
    const navigate = useNavigate(); // useNavigate 훅 선언

    return (
        <>
        <Header title="마이 페이지" onBack={() => navigate(-1)}/>
        <ExceptTopContentSection>
            <div className="max-w-md mx-auto bg-white">
              {/* 계정 설정 */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-orange mb-4 flex items-center">
                  <FaCog className="mr-2 text-orange" /> 계정설정
                </h2>
                <ul className="space-y-2">
                  <li 
                    className="flex justify-between items-center border-b pb-3 cursor-pointer"
                    onClick={() => navigate("/edit-personal")} // 클릭 시 EditPersonal.tsx로 이동
                  >
                    <span>개인정보 수정</span>
                    <FaChevronRight className="text-yellow" />
                  </li>
                  <li 
                    className="flex justify-between items-center border-b pb-3 cursor-pointer"
                    onClick={() => navigate("/device-settings")}
                  >
                    <span>연동 기기 설정</span>
                    <FaChevronRight className="text-yellow" />
                  </li>
                </ul>
              </div>
        
              {/* 더보기 */}
              <div>
                <h2 className="text-lg font-semibold text-orange mb-4 flex items-center">
                  <FaFileAlt className="mr-2 text-orange" /> 더보기
                </h2>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center border-b pb-3">
                    <span>문의하기</span>
                    <FaChevronRight className="text-yellow" />
                  </li>
                  <li className="flex justify-between items-center border-b pb-3">
                    <span>알림 설정</span>
                    <FaChevronRight className="text-yellow" />
                  </li>
                  <li className="flex justify-between items-center border-b pb-3">
                    <span>약관 및 정책</span>
                    <FaChevronRight className="text-yellow" />
                  </li>
                  <li className="flex justify-between items-center border-b pb-3">
                    <span>버전 정보</span>
                    <FaChevronRight className="text-yellow" />
                  </li>
                </ul>
              </div>
            </div>
        </ExceptTopContentSection>
        <BottomBar/>
        </>
    );
  };
  
  export default MyPage;
