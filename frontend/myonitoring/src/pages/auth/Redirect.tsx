import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import { api } from "../../api/axios";

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

          // 카카오 토큰 저장
          const authToken = response.data.auth_token;
          // 로컬 스토리지에 토큰 저장 (선택 사항)
          localStorage.setItem("kakao_access_token", authToken);
          
          // 회원 여부에 따라 화면 이동
          const isRegistered = response.data.is_registered;
          // 회원이면 jwt 토큰 저장하고 로그인 처리
          if (isRegistered == true) {
            const accessToken = response.data.token.accessToken
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
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
      <img
        src="/loading.gif"
        alt="로고 이미지"
        className="w-32 h-32 animate-fade-in"
      />
      <h1 className="text-3xl font-Gidugu text-gray-900">Myonitoring</h1>
    </div>
  );
};

export default Redirect;
