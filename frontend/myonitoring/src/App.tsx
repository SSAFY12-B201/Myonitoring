import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// 온보딩 관련 페이지
import Splash from "./pages/onboarding/Splash";
import Agreement from "./pages/onboarding/Agreements";
import AgreementDetail from "./pages/onboarding/AgreementDetail";
import UserInfo from "./pages/onboarding/UserInfo";
import DeviceGuide from "./pages/onboarding/DeviceGuide";
import SerialNumberInput from "./pages/onboarding/SerialNumInput";
import ConnectionSuccess from "./pages/onboarding/ConnectionSuccess";
import CatInfo from "./pages/onboarding/CatInfo";
import Greeting from "./pages/onboarding/Greeting";

// 인증 관련 페이지
import LoginSignUp from "./pages/auth/LoginSignUp";
import Redirect from "./pages/auth/Redirect";

// 메인 기능 관련 페이지
import Home from "./pages/Home";
import Reservation from "./pages/reservation/Reservation";
import MedicalRecords from "./pages/medical-records/MedicalRecords";
import MedicalRecordDetail from "./pages/medical-records/MedicalRecordsDetail";
import Graph from "./pages/report/Graph";
import StatisticsPage from "./pages/report/Statistics";

// 마이페이지 관련 페이지
import MyPage from "./pages/mypage/Mypage";
import EditPersonal from "./pages/mypage/EditPersonal";
import DeviceSettings from "./pages/mypage/DeviceSettings";

// 기타 페이지
import Notification from "./pages/Notification";
import CatEyeInfo from "./pages/report/CatEyeInfo";

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true); // 스플래쉬 화면 표시 여부
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부
  const [isRegistered, setIsRegistered] = useState(false); // 회원가입 여부

  const location = useLocation(); // 현재 경로 가져오기

  useEffect(() => {
    const initializeApp = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const userStatus = await checkUserStatus();
      setIsLoggedIn(userStatus.isLoggedIn);
      setIsRegistered(userStatus.isRegistered);
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  const checkUserStatus = async () => {
    return {
      isLoggedIn: false,
      isRegistered: false,
    };
  };

  if (isLoading) {
    return <Splash />;
  }

  return (
    <Routes location={location} key={location.pathname}>
      {/* 온보딩 관련 라우트 */}
      {!isRegistered && (
        <>
          <Route path="/" element={<LoginSignUp />} />
          <Route path="/kakao-redirect" element={<Redirect />} />
          <Route path="/" element={<Agreement />} />
          <Route path="/agreement-detail" element={<AgreementDetail />} />
          <Route path="/user-info" element={<UserInfo />} />
          <Route path="/device-guide" element={<DeviceGuide />} />
          <Route path="/serial-number-input" element={<SerialNumberInput />} />
          <Route path="/connection-success" element={<ConnectionSuccess />} />
          <Route path="/cat-info" element={<CatInfo />} />
          <Route path="/greeting" element={<Greeting />} />
        </>
      )}

      {/* 인증 관련 라우트 */}
      {isRegistered && !isLoggedIn && (
        <>
        </>
      )}

      {/* 메인 기능 관련 라우트 */}
      {isLoggedIn && (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route
            path="/medical-records/:id"
            element={<MedicalRecordDetail />}
          />
          <Route path="/graph" element={<Graph />} />
          <Route path="/statistics" element={<StatisticsPage />} />

          {/* 마이페이지 관련 라우트 */}
          <Route path="/my-page" element={<MyPage />} />
          <Route path="/edit-personal" element={<EditPersonal />} />
          <Route path="/device-settings" element={<DeviceSettings />} />

          {/* 기타 라우트 */}
          <Route path="/notification" element={<Notification />} />
        </>
      )}
    </Routes>
  );
};

export default App;
