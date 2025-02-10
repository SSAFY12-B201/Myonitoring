import React from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import ExceptTopContentSection from "../components/ExceptTopContentSection";

const Notification: React.FC = () => {
    const navigate = useNavigate(); // useNavigate 훅 선언
    return (
        <>
        <Header title="알림" onBack={() => navigate(-1)}/>
        <ExceptTopContentSection>
            <div>

            </div>
        </ExceptTopContentSection>
        </>
    )

}

export default Notification