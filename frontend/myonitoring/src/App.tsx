import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// 페이지 컴포넌트 임포트
import Splash from "./pages/onboarding/Splash";
import Redirect from "./pages/auth/Redirect";
import LoginSignUp from "./pages/auth/LoginSignUp";
import Agreement from "./pages/onboarding/Agreements";
import AgreementDetail from "./pages/onboarding/AgreementDetail";
import UserInfo from "./pages/onboarding/UserInfo";
import DeviceGuide from "./pages/onboarding/DeviceGuide";
import SerialNumberInput from "./pages/onboarding/SerialNumInput";
import ConnectionSuccess from "./pages/onboarding/ConnectionSuccess";
import CatInfo from "./pages/onboarding/CatInfo";
import Greeting from "./pages/onboarding/Greeting";
import Home from "./pages/Home";
import Reservation from "./pages/reservation/Reservation";
import MedicalRecords from "./pages/medical-records/MedicalRecords";
import MedicalRecordDetail from "./pages/medical-records/MedicalRecordsDetail";
import Graph from "./pages/report/Graph";
import StatisticsPage from "./pages/report/Statistics";
import MyPage from "./pages/mypage/Mypage";
import EditPersonal from "./pages/mypage/EditPersonal";
import DeviceSettings from "./pages/mypage/DeviceSettings";
import DeviceDetailedSettings from "./pages/mypage/DeviceDetailedSettings";

// 기타 페이지
import Notification from "./pages/Notification";
import CatEyeInfo from "./pages/report/CatEyeInfo";
import CatInfoEdit from "./pages/CatInfoEdit";

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const location = useLocation();

  // 유저 상태 확인 함수
  const checkUserStatus = async () => {
    return {
      isLoggedIn: false,
      isRegistered: false,
    };
  };

  useEffect(() => {
    const initializeApp = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 스플래시 대기
      const userStatus = await checkUserStatus();
      setIsLoggedIn(userStatus.isLoggedIn);
      setIsRegistered(userStatus.isRegistered);
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <Splash />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 공통 라우트 */}
        <Route path="/kakao-redirect/*" element={<Redirect />} />

        {/* 조건부 라우팅 */}
        {!isRegistered ? (
          <>
            <Route path="/" element={<LoginSignUp />} />
            <Route path="/agreements" element={<Agreement />} />
            <Route path="/agreement-detail" element={<AgreementDetail />} />
            <Route path="/user-info" element={<UserInfo />} />
            <Route path="/device-guide" element={<DeviceGuide />} />
            <Route path="/serial-number-input" element={<SerialNumberInput />} />
            <Route path="/connection-success" element={<ConnectionSuccess />} />
            <Route path="/cat-info" element={<CatInfo />} />
            <Route path="/greeting" element={<Greeting />} />
          </>
        ) : isLoggedIn ? (
          <>
            {/* 메인 페이지 */}
            <Route path="/home" element={<Home />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/medical-records/:id" element={<MedicalRecordDetail />} />
            <Route path="/graph" element={<Graph />} />
            <Route path="/statistics" element={<StatisticsPage />} />

            {/* 마이페이지 */}
            <Route path="/my-page" element={<MyPage />} />
            <Route path="/edit-personal" element={<EditPersonal />} />
            <Route path="/device-settings" element={<DeviceSettings />} />

            {/* 기타 */}
            <Route path="/notification" element={<Notification />} />
          </>
        ) : (
          <>
            <Route path="/" element={<LoginSignUp />} />
            <Route path="/kakao-redirect" element={<Redirect />} />
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
            <Route path="/cateyeinfo" element={<CatEyeInfo />} />

            {/* 마이페이지 관련 라우트 */}
            <Route path="/my-page" element={<MyPage />} />
            <Route path="/edit-personal" element={<EditPersonal />} />
            <Route path="/device-settings" element={<DeviceSettings />} />
            <Route path="/device-detail" element={<DeviceDetailedSettings />} />

            {/* 기타 라우트 */}
            <Route path="/notification" element={<Notification />} />
            <Route path="/catinfoedit/:id" element={<CatInfoEdit />} />
          </>
        )}
      </Routes>
    </AnimatePresence>
  );
};

export default App;