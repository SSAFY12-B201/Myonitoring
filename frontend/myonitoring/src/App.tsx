import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Splash from "./pages/onboarding/Splash"; // 스플래쉬 화면
import LoginSignUp from "./pages/auth/LoginSignUp"; // 로그인 화면
import Agreement from "./pages/onboarding/Agreements"; // 약관 동의 화면
import AgreementDetail from "./pages/onboarding/AgreementDetail"; // 약관 상세 화면
import UserInfo from "./pages/onboarding/UserInfo"; // 개인정보 등록 화면
import CatInfo from "./pages/onboarding/CatInfo"; // 고양이 정보 등록 화면
import Greeting from "./pages/onboarding/Greeting"; // 그리팅 화면
import Home from "./pages/Home"; // 홈 화면
import Redirect from "./pages/auth/Redirect";


const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true); // 스플래시 화면 표시 여부
  const navigate = useNavigate();

  const handleSplashFinish = () => {
    setShowSplash(false); // 스플래시 종료
    navigate("/login"); // 로그인 화면 이동동
  };

  if (showSplash) {
    return <Splash onFinish={handleSplashFinish} />;
  }

  return (
    <Routes>
      {/* 로그인 및 회원가입 */}
      <Route path="/login" element={<LoginSignUp />} />

      {/* 로그인 리다이렉트 화면 */}
      <Route path="/oauth2/callback/kakao" element={<Redirect/>} />


      {/* 약관 동의 및 상세 */}
      <Route path="/agreements" element={<Agreement />} />
      <Route path="/agreement-detail" element={<AgreementDetail />} />

      {/* 개인정보 등록 */}
      <Route path="/user-info" element={<UserInfo />} />

      {/* 고양이 정보 등록 */}
      <Route path="/cat-info" element={<CatInfo />} />

      {/* 그리팅 화면 */}
      <Route path="/greeting" element={<Greeting />} />

      {/* 홈 화면 */}
      <Route path="/home" element={<Home />} />
    </Routes>
  );
};

export default App;
