import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from '../../api/axios';

const Redirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      // 카카오 인증 코드를 백엔드로 전달
      console.log(code)
      api
        .post(`/api/auth/kakao/authenticate`, null, {
          params: { code }, // URL 파라미터로 인증 코드 전달
        })
        .then((response) => {
          console.log("Response:", response.data);

          // 액세스 토큰 저장
          localStorage.setItem("kakao_access_token", response.data.access_token);

          // 약관 동의 페이지로 이동
          navigate("/agreements");
        })
        .catch((error) => {
          console.error("로그인 실패:", error);
          navigate("/login");
        });
    }
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
};

export default Redirect;
