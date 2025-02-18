import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import { login } from "./redux/slices/authSlice";
import { ToastContainer } from "react-toastify"; // Toastify 추가

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
import MakeMedicalRecord from "./pages/medical-records/MakeMedicalRecord";
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
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Redux에서 인증 상태 가져오기
  const { isLoggedIn } = useAppSelector((state) => state.auth);

  // 로딩 상태 관리
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  // 유저 상태 확인 함수
  const checkUserStatus = async () => {
    const token = localStorage.getItem("jwt_access_token");
    if (token) {
      // 토큰이 존재하면 로그인 상태로 설정
      dispatch(login({ accessToken: token }));
      console.log("로그인 상태: true"); // 로그인 상태 콘솔 출력
      return true;
    }
    console.log("로그인 상태: false"); // 로그인 상태 콘솔 출력
    return false;
  };

  useEffect(() => {
    const initializeApp = async () => {
      await checkUserStatus(); // 유저 상태 확인
      setTimeout(() => {
        setIsSplashVisible(false); // 2초 후 스플래시 화면 종료
      }, 2000);
    };

    initializeApp();
  }, [dispatch]);

  if (isSplashVisible) {
    return <Splash />; // 스플래시 화면 표시
  }

  return (
    <>
      <ToastContainer position="bottom-center" autoClose={2000} />{" "}
      {/* ToastContainer 추가 */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* 공통 라우트 */}
          <Route path="/kakao-redirect/*" element={<Redirect />} />

          {/* 조건부 라우팅 */}
          {!isLoggedIn ? (
            <>
              <Route path="/" element={<LoginSignUp />} />
              <Route path="/agreements" element={<Agreement />} />
              <Route path="/agreement-detail" element={<AgreementDetail />} />
              <Route path="/user-info" element={<UserInfo />} />
              <Route path="/edit-personal" element={<EditPersonal />} />
            </>
          ) : (
            <>
              {/* 메인 페이지 */}
              <Route path="/user-info" element={<UserInfo />} />
              <Route path="/edit-personal" element={<EditPersonal />} />
              <Route path="/device-guide" element={<DeviceGuide />} />
              <Route
                path="/serial-number-input"
                element={<SerialNumberInput />}
              />
              <Route
                path="/connection-success"
                element={<ConnectionSuccess />}
              />
              <Route path="/cat-info" element={<CatInfo />} />
              <Route path="/greeting" element={<Greeting />} />
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/medical-records" element={<MedicalRecords />} />
              <Route
                path="/make-medical-record"
                element={<MakeMedicalRecord />}
              />
              <Route
                path="/medical-records/:id"
                element={<MedicalRecordDetail />}
              />
              <Route path="/graph" element={<Graph />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              {/* 마이페이지 */}
              <Route path="/my-page" element={<MyPage />} />
              <Route path="/edit-personal" element={<EditPersonal />} />
              <Route path="/device-settings" element={<DeviceSettings />} />
              <Route
                path="/device-detail/:id"
                element={<DeviceDetailedSettings />}
              />
              {/* 기타 */}
              <Route path="/notification" element={<Notification />} />
              <Route path="/cateyeinfo" element={<CatEyeInfo />} />
              <Route path="/catinfoedit/:id" element={<CatInfoEdit />} />
            </>
          )}
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default App;
