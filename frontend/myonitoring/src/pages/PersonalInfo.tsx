import { useState } from "react";
import Input from "../components/Input";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import WideButton from "../components/WideButton";

const PersonalInfo = () => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const handleNext = () => {
    console.log("닉네임:", nickname);
    console.log("휴대폰 번호:", phoneNumber);
    console.log("주소:", address);
    alert("다음 단계로 이동합니다.");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 상단 헤더 */}
      <Header title="개인 정보 입력" onBack={() => navigate(-1)} />

      <main className="p-6 flex-grow">
        {/* 설명 */}
        <h2 className="text-lg font-semibold mb-2">처음 가입하시네요!</h2>
        <p className="text-xs text-gray-400 mb-6">
          회원님의 추가 정보를 입력해주세요.
        </p>


        {/* 입력 폼 */}
        <form className="pt-5 space-y-4">
          <Input
            label="닉네임"
            type="text"
            value={nickname}
            onChange={setNickname}
            placeholder="닉네임을 입력하세요"
          />
          <Input
            label="핸드폰 번호"
            type="tel"
            value={phoneNumber}
            onChange={setPhoneNumber}
            placeholder="010-0000-0000"
          />
          <Input
            label="주소"
            type="text"
            value={address}
            onChange={setAddress}
            placeholder="주소를 입력하세요"
          />
        </form>
      </main>

      {/* 하단 버튼 */}
      <footer className="p-4">
        {/* WideButton 컴포넌트 사용 */}
        <WideButton
          text="다음"
          textColor="text-white"
        />
      </footer>
    </div>
  );
};

export default PersonalInfo;
