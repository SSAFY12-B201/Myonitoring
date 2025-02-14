import { useAppDispatch, useAppSelector } from "../../redux/hooks"; // 커스텀 훅 가져오기
import { updateUserInfo } from "../../redux/slices/userSlice";
import Input from "../../components/Input";
import Header from "../../components/Header";
import WideButton from "../../components/WideButton";
import ExceptTopContentSection from "../../components/ExceptTopContentSection";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { slideInVariants, defaultTransition } from "../../animations";

const UserInfo = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Redux 상태 가져오기
  const userInfo = useAppSelector((state) => state.user);

  // 상태 관리: 각 필드의 오류 여부
  const [errors, setErrors] = useState({
    nickname: false,
    phoneNumber: false,
    address: false,
  });

  const handleNext = () => {
    // 각 필드의 오류 상태 업데이트
    const newErrors = {
      nickname: !userInfo.nickname,
      phoneNumber: !userInfo.phoneNumber || userInfo.phoneNumber.length !== 13, // 전화번호 길이 검증 추가
      address: !userInfo.address,
    };
    setErrors(newErrors);

    // 하나라도 비어 있으면 진행 중단
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    // 모든 필드가 채워졌다면 다음 단계로 이동
    navigate("/device-guide");
  };

  return (
    <motion.div
      // initial="initial"
      // animate="animate"
      // exit="exit"
      // variants={slideInVariants}
      // transition={defaultTransition}
    >
      <div className="min-h-screen bg-white flex flex-col">
        {/* 상단 헤더 */}
        <Header title="개인 정보 입력" onBack={() => navigate(-1)} />

        <ExceptTopContentSection>
          <div>
            {/* 설명 */}
            <h2 className="text-lg font-semibold mb-2">처음 가입하시네요!</h2>
            <p className="text-xs text-gray-400 mb-4">
              회원님의 추가 정보를 입력해주세요.
            </p>

            {/* 입력 폼 */}
            <form className="pt-5 space-y-4">
              {/* 닉네임 입력 */}
              <Input
                label="닉네임"
                type="text"
                value={userInfo.nickname || ""}
                onChange={(value) => {
                  dispatch(updateUserInfo({ nickname: value }));
                  setErrors({ ...errors, nickname: false }); // 수정 시 오류 해제
                }}
                placeholder="닉네임을 입력하세요"
                error={errors.nickname}
                errorMessage="닉네임을 입력해주세요."
              />

            {/* 핸드폰 번호 입력 */}
            <Input
              label="핸드폰 번호"
              type="tel"
              value={userInfo.phoneNumber || ""}
              onChange={(value) => {
                dispatch(updateUserInfo({ phoneNumber: value }));
                setErrors({ ...errors, phoneNumber: false }); // 수정 시 오류 해제
              }}
              placeholder="010-0000-0000"
              error={errors.phoneNumber}
              errorMessage="올바른 핸드폰 번호를 입력해주세요."
            />

              {/* 주소 입력 */}
              <Input
                label="주소"
                type="text"
                value={userInfo.address || ""}
                onChange={(value) => {
                  dispatch(updateUserInfo({ address: value }));
                  setErrors({ ...errors, address: false }); // 수정 시 오류 해제
                }}
                placeholder="주소를 입력하세요"
                error={errors.address}
                errorMessage="주소를 입력해주세요."
              />
            </form>
          </div>
        </ExceptTopContentSection>

        {/* 하단 버튼 */}
        <footer className="fixed bottom-0 left-0 w-full p-4 bg-white">
          {/* WideButton 컴포넌트 사용 */}
          <WideButton
            text="다음"
            textColor="text-white"
            bgColor={
              userInfo.nickname && userInfo.phoneNumber && userInfo.address
                ? "bg-darkGray"
                : "bg-gray-300 cursor-not-allowed"
            }
            onClick={handleNext}
          />
        </footer>
      </div>
    </motion.div>
  );
};

export default UserInfo;
