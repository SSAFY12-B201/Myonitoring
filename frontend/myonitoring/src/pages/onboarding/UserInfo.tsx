import { useAppDispatch } from "../../redux/hooks"; // 커스텀 훅 가져오기
import { api } from '../../api/axios';
import { updateUserInfo } from "../../redux/slices/userSlice";
import { login } from "../../redux/slices/authSlice";
import Input from "../../components/Input";
import Header from "../../components/Header";
import WideButton from "../../components/WideButton";
import ExceptTopContentSection from "../../components/ExceptTopContentSection";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";


const UserInfo = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // 로컬 상태 관리: 입력 중인 데이터를 관리
  const [formData, setFormData] = useState({
    nickname: "",
    phoneNumber: "",
    address: "",
  });

  // 각 필드의 오류 여부 관리
  const [errors, setErrors] = useState({
    nickname: false,
    phoneNumber: false,
    address: false,
  });

  const handleNext = async () => {
    // 각 필드의 오류 상태 업데이트
    const newErrors = {
      nickname: !formData.nickname,
      phoneNumber: !formData.phoneNumber || formData.phoneNumber.length !== 13, // 전화번호 길이 검증 추가
      address: !formData.address,
    };
    setErrors(newErrors);

    // 하나라도 비어 있으면 진행 중단
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    try {
      const authToken = localStorage.getItem("kakao_access_token"); // 로컬 스토리지에서 토큰 가져오기

      // axios로 백엔드에 토큰과 함께 추가 개인정보 전달
      const response = await api.post(
        "api/auth/kakao/register",
        {
          nickname: formData.nickname,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
        },
        {
          headers: {
            "Content-Type": "application/json", // Content-Type 헤더 유지
          },
          params: {
            authToken, // 토큰을 쿼리 파라미터로 전달
          },
        }
      );

      console.log(response.data);

      // Redux 유저 정보 업데이트 (입력 완료된 데이터 저장)
      dispatch(updateUserInfo(formData));

      // Redux 인증 상태 업데이트 (isLoggedIn: true, accessToken을 jwt 토큰으로 저장)
      const accessToken = response.data.accessToken;
      dispatch(login({ accessToken }));

      // 로컬 스토리지에 jwt 토큰 저장 (선택 사항)
      localStorage.setItem("jwt_access_token", accessToken);

      // 모든 필드가 채워졌다면 다음 단계로 이동
      navigate("/device-guide");
    } catch (error) {
      console.error("Error registering userinfo:", error);
      alert("유저 추가 정보 입력에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <motion.div>
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
                value={formData.nickname}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, nickname: value }))
                }
                placeholder="닉네임을 입력하세요"
                error={errors.nickname}
                errorMessage="닉네임을 입력해주세요."
              />

              {/* 핸드폰 번호 입력 */}
              <Input
                label="핸드폰 번호"
                type="tel"
                value={formData.phoneNumber}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, phoneNumber: value }))
                }
                placeholder="010-0000-0000"
                error={errors.phoneNumber}
                errorMessage="올바른 핸드폰 번호를 입력해주세요."
              />

              {/* 주소 입력 */}
              <Input
                label="주소"
                type="text"
                value={formData.address}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, address: value }))
                }
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
              formData.nickname && formData.phoneNumber && formData.address
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
