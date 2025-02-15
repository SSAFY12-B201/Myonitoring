import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios"; // Axios 인스턴스 임포트
import Header from "../../components/Header";
import ExceptTopContentSection from "../../components/ExceptTopContentSection";
import WideButton from "../../components/WideButton";
import Input from "../../components/Input";
import { useAppDispatch } from "../../redux/hooks"; // Redux 디스패치 훅

const EditPersonal = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [terms, setTerms] = useState({
    termsOfService: true,
    privacyPolicy: true,
  });

  const [error, setError] = useState(false); // 에러 상태 관리

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("jwt_access_token"); // 로컬 스토리지에서 토큰 가져오기
      if (!token) throw new Error("No access token found");

      // 로그아웃 API 호출
      await api.post("/api/auth/signout", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Redux 상태 초기화
      dispatch({ type: "resetAllState" });

      // 로컬 스토리지 정리
      localStorage.removeItem("kakao_access_token");
      localStorage.removeItem("jwt_access_token");

      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      setError(true);
    }
  };

  const handleWithdraw = async () => {
    try {
      const token = localStorage.getItem("jwt_access_token");
      if (!token) throw new Error("No access token found");

      // 회원탈퇴 API 호출
      await api.delete("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Redux 상태 초기화
      dispatch({ type: "resetAllState" });

      // 로컬 스토리지 정리
      localStorage.removeItem("kakao_access_token");
      localStorage.removeItem("jwt_access_token");

      alert("회원탈퇴가 완료되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("회원탈퇴 실패:", error);
      alert("회원탈퇴에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <Header title="마이 페이지" onBack={() => navigate(-1)} />
      <ExceptTopContentSection>
        <div className="max-w-md mx-auto bg-white pb-6">
          {/* 이름 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              이름
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed">
              김철수
            </div>
          </div>

          {/* 닉네임 */}
          <Input label="닉네임" type="text" value="냥집사 도라에몽" onChange={(value) => console.log("닉네임 변경:", value)} />

          {/* 이메일 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              이메일
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed">
              example@google.com
            </div>
          </div>

          {/* 휴대폰 번호 */}
          <Input label="휴대폰 번호" type="tel" value="010-1234-5678" onChange={(value) => console.log("휴대폰 번호 변경:", value)} />

          {/* 주소 */}
          <Input label="주소" type="text" value="대전광역시 유성구 동서대로 98-39" onChange={(value) => console.log("주소 변경:", value)} />

          {/* 연동 계정 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              연동 계정
            </label>
            <div className="w-full px-[12px] py-[10px] border border-gray-[#ccc] text-gray-500 rounded-md bg-[#f7f7f7] cursor-not-alowed">
              카카오 로그인
            </div>
          </div>

          {/* 로그아웃 | 회원탈퇴 */}
          <div className="flex text-xs justify-end items-center space-x-2">
            <span onClick={handleLogout} className="cursor-pointer hover:text-orange transition-colors duration-[200ms]">로그아웃</span>
            <span>|</span>
            <span onClick={handleWithdraw} className="cursor-pointer hover:text-orange transition-colors duration-[200ms]">회원탈퇴</span>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p className="text-red-500 text-xs mt-2">로그아웃에 실패했습니다. 다시 시도해주세요.</p>
          )}
        </div>
      </ExceptTopContentSection>

      {/* 저장 버튼 */}
      <footer className="fixed bottom-2 left-0 w-full p-4">
        <WideButton
          text="저장하기"
          onClick={() =>
            terms.termsOfService && terms.privacyPolicy ? console.log("저장되었습니다.") : console.log("필수 항목에 동의해주세요.")
          }
          disabled={!terms.termsOfService || !terms.privacyPolicy}
          bgColor={terms.termsOfService && terms.privacyPolicy ? "bg-orange" : "bg-lightGray cursor-not-allowed"}
          textColor={terms.termsOfService && terms.privacyPolicy ? "text-white" : "text-gray-400"}
        />
      </footer>
    </>
  );
};

export default EditPersonal;
