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

          const token = response.data.access_token;

          // const token = response.data.accessToken;
          // const token = response.data.token;
          // const token = response.data;  // 토큰이 직접 오는 경우

          console.log("Token value: ",token);
          if(token) {
            localStorage.setItem("accessToken", token);
            // 약관 동의 페이지로 이동
            navigate("/agreements");
          } else {
            console.error("Token not found in response");
          }

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
