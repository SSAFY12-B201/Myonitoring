import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      const code = new URL(window.location.href).searchParams.get("code");

      if (code) {
        try {
          const response = await axios.post("https://kauth.kakao.com/oauth/token", null, {
            params: {
              grant_type: "authorization_code",
              client_id: "YOUR_KAKAO_REST_API_KEY",
              redirect_uri: process.env.REACT_APP_KAKAO_REDIRECT_URI,
              code,
            },
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          });

          const { access_token } = response.data;
          console.log("Access Token:", access_token);

          // 액세스 토큰 저장 후 홈 화면으로 이동
          localStorage.setItem("kakao_access_token", access_token);
          navigate("/home");
        } catch (error) {
          console.error("토큰 요청 실패:", error);
          navigate("/login");
        }
      }
    };

    fetchToken();
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
};

export default AuthCallback;
