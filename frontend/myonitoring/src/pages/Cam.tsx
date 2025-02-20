import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import ExceptTopContentSection from "../components/ExceptTopContentSection";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { api } from "../api/axios"; // Axios 인스턴스 사용
import { motion } from "framer-motion"; // Framer Motion 사용
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";


const Cam: React.FC = () => {
  const navigate = useNavigate();
  const selectedCatId = useSelector(
    (state: RootState) => state.cat.selectedCatId
  ); // 선택된 고양이 ID
 
  return (
    <>
      <Header
        title="묘니터링 캠"
        onBack={() => {
          if (window.history.length > 1) {
            navigate(-1); // 이전 페이지가 있을 경우 뒤로가기
          } else {
            navigate("/"); // 이전 페이지가 없으면 홈 화면으로 이동
          }

        }}
      />

     
      <ExceptTopContentSection>
        <h3>캠 페이지</h3>
      </ExceptTopContentSection>
    </>
  );
};

export default Cam;
