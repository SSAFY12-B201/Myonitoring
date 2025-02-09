import React from "react";
import { Routes, Route } from "react-router-dom";
import MyPage from "./pages/mypage/mypage";
import EditPersonal from "./pages/mypage/EditPersonal";
import DeviceSettings from "./pages/mypage/DeviceSettings";
import DeviceDetailedSettings from "./pages/mypage/DeviceDetailedSettings";


const App: React.FC = () => {
  return (
    <Routes>
      {/* 로그인 및 회원가입 */}
      <Route path="/" element={<MyPage />} />
      <Route path="/edit-personal" element={<EditPersonal />} />
      <Route path="/device" element={<DeviceSettings />} />
      <Route path="/device-detail" element={<DeviceDetailedSettings />} />
    </Routes>
    
  );
};

export default App;
