import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 navigate 사용
import Header from "../../components/Header";
import ContentSection from "../../components/ContentSection";
import WideButton from "../../components/WideButton";
import { FaTrashAlt } from "react-icons/fa"; // 쓰레기통 아이콘
import Input from "../../components/Input";

const EditPersonal = () => {
  const navigate = useNavigate(); // navigate 훅 선언
  const [terms, setTerms] = useState({
    termsOfService: true,
    privacyPolicy: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리

  const handleSave = () => {
    if (terms.termsOfService && terms.privacyPolicy) {
      console.log("저장되었습니다.");
    } else {
      console.log("필수 항목에 동의해주세요.");
    }
  };

  const handleLogoutOrDelete = (option: string) => {
    if (option === "회원탈퇴") {
      setIsModalOpen(true); // 회원탈퇴 클릭 시 모달 열기
    } else {
      navigate("/"); // 로그아웃 시 홈으로 이동
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    console.log("회원탈퇴가 완료되었습니다."); // 회원탈퇴 로직 추가 가능
    setIsModalOpen(false);
    navigate("/"); // 회원탈퇴 후 홈으로 이동
  };

  return (
    <>
      <Header title="마이 페이지" onBack={() => navigate("/")} />
      <ContentSection>
        <div className="max-w-md mx-auto bg-white pb-6">
          {/* 이름 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">이름</label>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed">
              김철수
            </div>
          </div>

          {/* 닉네임 */}
          <Input
            label="닉네임"
            type="text"
            value="냥집사 도라에몽"
            onChange={(value) => console.log("닉네임 변경:", value)}
          />

          {/* 이메일 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">이메일</label>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed">
              example@google.com
            </div>
          </div>

          {/* 휴대폰 번호 */}
          <Input
            label="휴대폰 번호"
            type="tel"
            value="010-1234-5678"
            onChange={(value) => console.log("휴대폰 번호 변경:", value)}
          />

          {/* 주소 */}
          <Input
            label="주소"
            type="text"
            value="대전광역시 유성구 동서대로 98-39"
            onChange={(value) => console.log("주소 변경:", value)}
          />

          {/* 연동 계정 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">연동 계정</label>
            <div className="w-full px-[12px] py-[10px] border border-gray-[#ccc] text-gray-500 rounded-md bg-[#f7f7f7] cursor-not-alowed">
              카카오 로그인
            </div>
          </div>

          {/* 로그아웃 | 회원탈퇴 */}
          <div className="flex text-xs justify-end items-center space-x-2">
            <span
              onClick={() => handleLogoutOrDelete("로그아웃")}
              className="cursor-pointer hover:text-orange transition-colors duration-[200ms]"
            >
              로그아웃
            </span>
            <span>|</span>
            <span
              onClick={() => handleLogoutOrDelete("회원탈퇴")}
              className="cursor-pointer hover:text-orange transition-colors duration-[200ms]"
            >
              회원탈퇴
            </span>
          </div>
        </div>
      </ContentSection>

      {/* 저장 버튼 */}
      <footer className="fixed bottom-[15px] left-[0] w-full px-[10px]">
        <WideButton
          text="저장하기"
          onClick={handleSave}
          disabled={!terms.termsOfService || !terms.privacyPolicy}
          bgColor={
            terms.termsOfService && terms.privacyPolicy ? "bg-orange" : "bg-lightGray cursor-not-allowed"
          }
          textColor={
            terms.termsOfService && terms.privacyPolicy ? "text-white" : "text-gray-400"
          }
        />
      </footer>

      {/* 회원탈퇴 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-[0.5] z-[1000]">
          <div className="bg-white p-[24px] m-[16px] rounded-lg shadow-lg max-w-sm w-full relative">
            
            {/* 닫기 버튼 */}
            <button onClick={closeModal} className="absolute top-[10px] right-[10px] text-gray-400 hover:text-black">
              ✕
            </button>

            {/* 아이콘 및 메시지 */}
            <div className="text-center mb-[20px] flex flex-col items-center">
              <FaTrashAlt size={38} color="#000" className="mb-2" />
              <h2 className="font-bold text-lg mt-[10px]">정말 탈퇴하시겠어요?</h2>
              <p className="text-sm mt-[5px]">탈퇴 버튼 선택 시 계정은 삭제되며 복구되지 않습니다.</p>
            </div>

            {/* 버튼들 */}
            <div className="flex justify-between mt-[20px]">
              <button
                onClick={closeModal}
                className="w-[48%] py-[10px] bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-[200ms]"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="w-[48%] py-[10px] bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-[200ms]"
              >
                탈퇴
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditPersonal;
