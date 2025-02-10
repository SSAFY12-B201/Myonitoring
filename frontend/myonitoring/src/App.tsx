import React from "react";
import { Routes, Route } from "react-router-dom";
import Graph from "./pages/report/Graph";
import Statistics from "./pages/report/Statistics";
import CatEyeInfo from "./pages/report/CatEyeInfo";
import UserInfo from "./pages/onboarding/UserInfo";
import CatInfo from "./pages/onboarding/CatInfo";


const App: React.FC = () => {
  return (
    <Routes>
      {/* 로그인 및 회원가입 */}
      <Route path="/" element={<CatEyeInfo />} />
      <Route path="/graph" element={<Graph />} />
      <Route path="/statistics" element={<Statistics />} />
      <Route path="/user" element={<UserInfo />} />
      <Route path="/catinfo" element={<CatInfo />} />
    </Routes>
    
  );
};

export default App;
