import React from "react";
import { Routes, Route } from "react-router-dom";
import Notification from "./pages/Notification";


const App: React.FC = () => {
  return (
    <Routes>
      {/* 로그인 및 회원가입 */}
      <Route path="/" element={<Notification />} />
    </Routes>
    
  );
};

export default App;
