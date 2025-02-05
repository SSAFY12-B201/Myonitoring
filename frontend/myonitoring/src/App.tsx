import React from "react";
import { Routes, Route } from "react-router-dom";
import Agreement from "./pages/Agreements";
import AgreementDetail from "./pages/AgreementDetail";
// import Home from "./pages/Home";
import PersonalInfo from "./pages/PersonalInfo";

const App: React.FC = () => {
  return (
    <Routes>
      {/* 메인 화면 */}
      {/* <Route path="/" element={<Home />} /> */}
      {/* 약관 화면 */}
      <Route path="/" element={<Agreement />} />
      {/* 약관 상세 화면 */}
      <Route path="/agreement-detail" element={<AgreementDetail />} />
      {/* 개인 정보 입력 화면 */}
      <Route path="/personal-info" element={<PersonalInfo />} />

    </Routes>
  );
};

export default App;
