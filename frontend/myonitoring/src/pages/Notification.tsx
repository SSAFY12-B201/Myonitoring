import React from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import ContentSection from "../components/ContentSection";

const Notification: React.FC = () => {
    const navigate = useNavigate(); // useNavigate 훅 선언
    return (
        <>
        <Header title="알림" onBack={() => navigate(-1)}/>
        <ContentSection>
            <div>

            </div>
        </ContentSection>
        </>
    )

}

export default Notification