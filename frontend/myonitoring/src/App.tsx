import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Graph from "./pages/Graph"; // 그래프 페이지 컴포넌트
import Statistics from "./pages/Statistics"; // 통계 페이지 컴포넌트
import CatEyeInfo from "./pages/CatEyeInfo";

const App: React.FC = () => {
  return (
    <Routes>
      {/* 기본 경로를 /graph로 리다이렉트 */}
      <Route path="/" element={<CatEyeInfo/>} />
      {/* <Route path="/graph" element={<Graph />} /> */}
      <Route path="/statistics" element={<Statistics />} />
    </Routes>
    
  );
};

export default App;
