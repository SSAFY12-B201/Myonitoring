import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice"
import { api } from '../../api/axios';

const Redirect: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Redux dispatch 사용

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

          // 액세스 토큰 추출
          const accessToken = response.data.auth_token;


          // 로컬 스토리지에 토큰 저장 (선택 사항)
          localStorage.setItem("kakao_access_token", accessToken);

          // 약관 동의 페이지로 이동
          navigate("/agreements");
        })
        .catch((error) => {
          alert('로그인에 실패했습니다. 다시 시도해 주세요.')
          navigate("/");
        });
    }
  }, [navigate, dispatch]);

  return <div>로그인 처리 중...</div>;
};

export default Redirect;
