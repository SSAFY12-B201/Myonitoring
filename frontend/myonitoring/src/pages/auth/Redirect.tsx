import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import { api } from "../../api/axios";
import { motion } from "framer-motion";

const Redirect: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Redux dispatch 사용

  // 공통 애니메이션 설정
  const floatAnimation1 = (delay: number) => ({
    animate: {
      y: [0, -20, 0], // 위아래로 움직임
    },
    transition: {
      duration: 2, // 2초 동안 애니메이션
      repeat: Infinity, // 무한 반복
      ease: "easeInOut", // 부드러운 움직임
      delay, // 각 이미지마다 다른 시작 시간
    },
  });
  const floatAnimation2 = (delay: number) => ({
    animate: {
      y: [0, -20, 0], // 위아래로 움직임
    },
    transition: {
      duration: 2, // 2초 동안 애니메이션
      repeat: Infinity, // 무한 반복
      ease: "easeInOut", // 부드러운 움직임
      delay, // 각 이미지마다 다른 시작 시간
    },
  });

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      // 카카오 인증 코드를 백엔드로 전달
      console.log(code);
      api
        .post(`/api/auth/kakao/authenticate`, null, {
          params: { code }, // URL 파라미터로 인증 코드 전달
        })
        .then((response) => {
          console.log("Response:", response.data);

          // 카카오 토큰 저장
          const authToken = response.data.auth_token;
          // 로컬 스토리지에 토큰 저장 (선택 사항)
          localStorage.setItem("kakao_access_token", authToken);

          // 회원 여부에 따라 화면 이동
          const isRegistered = response.data.is_registered;
          // 회원이면 jwt 토큰 저장하고 로그인 처리
          if (isRegistered == true) {
            const accessToken = response.data.token.accessToken;
            localStorage.setItem("jwt_access_token", accessToken);
            dispatch(login({ accessToken }));
            navigate("/home");
          } else {
            navigate("/agreements");
          }
        })
        .catch((error) => {
          alert("로그인에 실패했습니다. 다시 시도해 주세요.");
          navigate("/");
        });
    }
  }, [navigate, dispatch]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      {/* 텍스트 */}
      <h1 className="absolute bottom-52 text-5xl font-Gidugu text-gray-900">
        Mynitoring
      </h1>
      {/* 중앙 Cat 이미지 */}
      <motion.img
        src="/Cat.png"
        alt="로딩 이미지"
        className="w-44 h-44"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
      />

      {/* 좌측 상단 이미지 */}
      <motion.img
        src="/food1.png"
        alt="로딩 이미지"
        className="absolute w-12 h-12"
        style={{ top: "56%", left: "24%" }} // Cat 주변에 위치 조정
        {...floatAnimation1(0)} // 딜레이 없음
      />

      {/* 우측 하단 이미지 */}
      <motion.img
        src="/health0.png"
        alt="로딩 이미지"
        className="absolute w-11 h-11"
        style={{ bottom: "35%", right: "28%" }} // Cat 주변에 위치 조정
        {...floatAnimation2(0.5)} // 0.5초 딜레이 추가
      />

      {/* 우측 상단 이미지 */}
      <motion.img
        src="/magnifier.png"
        alt="로딩 이미지"
        className="absolute w-12 h-12"
        style={{ top: "38%", right: "27%" }} // Cat 주변에 위치 조정
        {...floatAnimation1(1)} // 1초 딜레이 추가
      />
    </div>
  );
};

export default Redirect;
