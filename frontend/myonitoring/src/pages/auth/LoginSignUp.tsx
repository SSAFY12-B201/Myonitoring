import React, { useState } from "react";
import naverIcon from "../../assets/images/naver_icon.png";
import kakaoIcon from "../../assets/images/kakao_icon.png";
import googleIcon from "../../assets/images/google_icon.png";

const LoginSignUp: React.FC = () => {
  // 현재 활성화된 탭 상태 (login 또는 signup)
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  // 제목과 설명 텍스트
  const title =
    activeTab === "login"
      ? "묘니터링에 오신 것을 환영해요!"
      : "묘니터링에 가입하세요!";
  const description =
    activeTab === "login"
      ? "고양이 급식과 건강을 한 번에!\n묘니터링에 오신 것을 환영합니다."
      : "고양이 급식과 건강을 한 번에!\n묘니터링에 오신 것을 환영합니다.";

  // 하단 텍스트 (로그인/회원가입 전환 링크)
  const footerText =
    activeTab === "login" ? (
      <p className="mt-6 text-sm text-gray-500">
        계정이 없으신가요?{" "}
        <span
          onClick={() => setActiveTab("signup")}
          className="text-blue-500 cursor-pointer hover:underline"
        >
          회원가입 하러 가기
        </span>
      </p>
    ) : (
      <p className="mt-6 text-sm text-gray-500">
        이미 계정이 있으신가요?{" "}
        <span
          onClick={() => setActiveTab("login")}
          className="text-blue-500 cursor-pointer hover:underline"
        >
          로그인 하러 가기
        </span>
      </p>
    );

  const handleKakaoLogin = () => {
    const REST_API_KEY = import.meta.env.VITE_KAKAO_API_KEY; // 카카오 REST API 키
    const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URL; // Redirect URI
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    window.location.href = KAKAO_AUTH_URL; // 카카오 로그인 페이지로 리디렉션
  };

  // 소셜 로그인 버튼 내용
  const socialButtons = [
    {
      id: "naver",
      icon: naverIcon,
      alt: "네이버 로고",
      text: activeTab === "login" ? "네이버 로그인" : "네이버로 가입하기",
      bgColor: "#06BE34", // 네이버 색상 코드
      textColor: "#FFFFFF",
    },
    {
      id: "kakao",
      icon: kakaoIcon,
      alt: "카카오 로고",
      text: activeTab === "login" ? "카카오 로그인" : "카카오로 가입하기",
      bgColor: "#FDDC3F", // 카카오 색상 코드
      onClick: handleKakaoLogin, // 카카오 로그인 핸들러 추가
    },
    {
      id: "google",
      icon: googleIcon,
      alt: "구글 로고",
      text: activeTab === "login" ? "구글 로그인" : "구글로 가입하기기",
      bgColor: "#FFFFFF", // 구글 색상 코드 (흰색)
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* 상단 탭 */}
      <div className="flex w-full max-w-md justify-around border-b border-gray-300">
        <button
          className={`w-1/2 py-2 text-center text-lg ${
            activeTab === "login" ? "font-bold text-black" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("login")}
        >
          Log in
        </button>
        <button
          className={`w-1/2 py-2 text-center text-lg ${
            activeTab === "signup" ? "font-bold text-black" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("signup")}
        >
          Sign up
        </button>
      </div>

      {/* 공통 레이아웃 */}
      <div className="flex flex-col items-center mt-8 px-4 overflow-hidden">
        {/* 제목과 설명 */}
        <h1 className="text-xl mb-3 font-bold">{title}</h1>
        <p className="text-gray-500 text-center leading-relaxed whitespace-pre-line">
          {description}
        </p>

        {/* 소셜 로그인 버튼 */}
        <div className="flex flex-col gap-4 mt-6 w-full max-w-xs">
          {socialButtons.map((button) => (
            <div key={button.id} className="w-full flex justify-center">
              <button
                onClick={button.onClick} // 버튼 클릭 이벤트 추가
                className={`flex items-center justify-center gap-2 py-[12px] px-[16px] rounded-md shadow ${button.bgColor}`}
                style={{
                  width: "250px",
                  height: "48px",
                  minWidth: "250px",
                  backgroundColor: button.bgColor, // 인라인 스타일로 배경색 설정
                  color: button.textColor,
                }} // 버튼 크기 고정
              >
                <img src={button.icon} alt={button.alt} className="w-5 h-5" />
                <span className="truncate">{button.text}</span>{" "}
                {/* 텍스트 생략 처리 */}
              </button>
            </div>
          ))}
        </div>

        {/* 하단 텍스트 */}
        <div>{footerText}</div>

        {/* 하단 이미지 */}
        <div className="mt-auto">
          <img
            src="/logo_cat.png"
            alt="로고 고양이"
            className="w-full max-w-xs"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
