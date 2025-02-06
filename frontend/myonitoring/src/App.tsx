import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Graph from "./pages/Graph"; // 그래프 페이지 컴포넌트
import Statistics from "./pages/Statistics"; // 통계 페이지 컴포넌트

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
         {/* 기본 경로를 /graph로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/graph" replace />} />
        <Route path="/graph" element={<Graph />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </Router>
  );
};

export default App;
