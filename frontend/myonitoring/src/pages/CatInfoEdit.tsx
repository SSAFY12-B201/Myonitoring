import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks"; // 커스텀 훅 가져오기
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Header from "../components/Header";
import WideButton from "../components/WideButton";
import ExceptTopContentSection from "../components/ExceptTopContentSection";
import infoCat from "../assets/images/info_cat.png";

const CatInfoEdit: React.FC = () => {
  const selectedCatId = useAppSelector((state) => state.cat.selectedCatId);
  const navigate = useNavigate();

  // 상태 관리: 고양이 상세 정보
  const [catDetails, setCatDetails] = useState<{
    name: string;
    breed: string;
    gender: string;
    neutered: string;
    birthdate: string;
    age: number | ""; // 숫자 또는 빈 문자열
    weight: number | ""; // 숫자 또는 빈 문자열
    characteristics: string;
    image: string;
  }>({
    name: "",
    breed: "",
    gender: "",
    neutered: "",
    birthdate: "",
    age: "", // 초기값은 빈 문자열
    weight: "", // 초기값은 빈 문자열
    characteristics: "",
    image: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    gender: false,
    neutered: false,
    birthdate: false,
    age: false,
    weight: false,
  });

  // 고양이 상세 정보 가져오기
  useEffect(() => {
    const fetchCatDetails = async () => {
      try {
        const response = await axios.get(`/api/cats/${selectedCatId}`, {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBteWFpY3Jvc29mdC5jb20iLCJpZCI6MSwicm9sZSI6IkFETUlOIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJpYXQiOjE3MzkyNDU3NDksImV4cCI6MTc3MDc4MTc0OX0.Yr_U3xrz-WcyKL4xVzcKlWeooWS3AG0BU7-kYyyvD1vAJOzoYD3IeVOrLYeueyxGLuHNGutMP2448VOf0rj-xg`, // 실제 토큰 값 입력
          },
        });

        // API 응답 데이터를 상태에 맞게 변환
        const data = response.data;
        setCatDetails({
          name: data.name || "",
          breed: data.breed || "",
          gender: data.gender || "",
          neutered: data.isNeutered ? "중성화 완료" : "중성화 전", // 변환
          birthdate: data.birthDate || "", // 변환
          age: data.age || null,
          weight: data.weight || null,
          characteristics: data.characteristics || "",
          image: data.profileImageUrl || "",
        });
      } catch (error) {
        console.error("Failed to fetch cat details", error);
      }
    };

    if (selectedCatId) {
      fetchCatDetails();
    }
  }, [selectedCatId]);

  const handleSave = async () => {
    try {
      await axios.put(`/api/cats/${selectedCatId}`, {
        name: catDetails.name,
        breed: catDetails.breed,
        gender: catDetails.gender,
        isNeutered: catDetails.neutered === "중성화 완료", // 서버에서 기대하는 형식으로 변환
        birthDate: catDetails.birthdate,
        age: catDetails.age,
        weight: catDetails.weight,
        characteristics: catDetails.characteristics,
        profileImageUrl: catDetails.image,
      }, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBteWFpY3Jvc29mdC5jb20iLCJpZCI6MSwicm9sZSI6IkFETUlOIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJpYXQiOjE3MzkyNDU3NDksImV4cCI6MTc3MDc4MTc0OX0.Yr_U3xrz-WcyKL4xVzcKlWeooWS3AG0BU7-kYyyvD1vAJOzoYD3IeVOrLYeueyxGLuHNGutMP2448VOf0rj-xg`, // 실제 토큰 입력
        },
      });
      alert("저장되었습니다.");
    } catch (error) {
      console.error("Failed to save cat details", error);
      alert("저장 중 오류가 발생했습니다.");
    }
    navigate("/home");
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/cats/${selectedCatId}`, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBteWFpY3Jvc29mdC5jb20iLCJpZCI6MSwicm9sZSI6IkFETUlOIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJpYXQiOjE3MzkyNDU3NDksImV4cCI6MTc3MDc4MTc0OX0.Yr_U3xrz-WcyKL4xVzcKlWeooWS3AG0BU7-kYyyvD1vAJOzoYD3IeVOrLYeueyxGLuHNGutMP2448VOf0rj-xg`, // 실제 토큰 입력
        },
      })
      alert("삭제되었습니다.");
    } catch (error) {
      console.error("Failed to save cat details", error);
      alert("저장 중 오류가 발생했습니다.");
    }
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-y-auto">
      {/* 상단 헤더 */}
      <Header title="고양이 정보 수정" onBack={() => navigate(-1)} />

      <ExceptTopContentSection>
        <div>
          <h2 className="text-lg font-semibold mb-2">
            반려묘의 정보를 입력해주세요.
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            모든 필수 정보를 입력해주세요.
          </p>

          {/* 이미지 업로드 */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              {catDetails.image ? (
                <img
                  src={catDetails.image}
                  alt="고양이"
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <img
                  src={infoCat}
                  alt="로고 고양이 옆 사진 아이콘"
                  className="w-32 h-32 object-cover"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setCatDetails((prev) => ({
                      ...prev,
                      image: reader.result as string,
                    }));
                  };
                  reader.readAsDataURL(file);
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* 입력 폼 */}
          <form className="pt-5 space-y-4">
            <Input
              label={
                <>
                  이름<span className="text-red-500"> *</span>
                </>
              }
              type="text"
              value={catDetails.name}
              onChange={(value) =>
                setCatDetails((prev) => ({ ...prev, name: value }))
              }
              placeholder="고양이 이름을 입력하세요"
              error={errors.name}
              errorMessage="이름을 입력해주세요."
            />

            <Input
              label="묘종"
              type="text"
              value={catDetails.breed}
              onChange={(value) =>
                setCatDetails((prev) => ({ ...prev, breed: value }))
              }
              placeholder="고양이 묘종을 입력하세요 (선택)"
            />

            <Input
              label={
                <>
                  성별<span className="text-red-500"> *</span>
                </>
              }
              type="select"
              value={catDetails.gender}
              onChange={(value) =>
                setCatDetails((prev) => ({ ...prev, gender: value }))
              }
              options={["남아", "여아"]}
              error={errors.gender}
              errorMessage="성별을 선택해주세요."
            />

            <Input
              label={
                <>
                  중성화 여부<span className="text-red-500"> *</span>
                </>
              }
              type="select"
              value={catDetails.neutered}
              onChange={(value) =>
                setCatDetails((prev) => ({ ...prev, neutered: value }))
              }
              options={["중성화 전", "중성화 완료"]}
              error={errors.neutered}
              errorMessage="중성화 여부를 선택해주세요."
            />

            <Input
              label={
                <>
                  생년월일<span className="text-red-500"> *</span>
                </>
              }
              type="date"
              value={catDetails.birthdate}
              onChange={(value) =>
                setCatDetails((prev) => ({ ...prev, birthdate: value }))
              }
            />

            <Input
              label={
                <>
                  나이<span className="text-red-500"> *</span>
                </>
              }
              type="number"
              value={catDetails.age?.toString() || ""}
              onChange={(value) =>
                setCatDetails((prev) => ({
                  ...prev,
                  age: parseInt(value, 10),
                }))
              }
            />

            <Input
              label={
                <>
                  몸무게<span className="text-red-500"> *</span>
                </>
              }
              type="number"
              value={catDetails.weight?.toString() || ""}
              onChange={(value) =>
                setCatDetails((prev) => ({
                  ...prev,
                  weight: parseFloat(value),
                }))
              }
            />

            <Input
              label="특징"
              type="textarea"
              value={catDetails.characteristics}
              onChange={(value) =>
                setCatDetails((prev) => ({ ...prev, characteristics: value }))
              }
            />
          </form>

          
        </div>
      </ExceptTopContentSection>

      {/* 고양이 삭제 */}
      <div className="flex text-xs text-gray-500 justify-end mr-8 mb-2">
            <span
              onClick={() => handleDelete()}
              className="cursor-pointer hover:text-orange transition-colors duration-[200ms]"
            >
              고양이 정보 삭제
            </span>
        </div>
   

      {/* 하단 버튼 */}
      <footer className="sticky bottom-0 left-0 w-full p-4 bg-white">
        <WideButton
          text="저장"
          onClick={handleSave}
          bgColor={
            Object.values(errors).some((error) => error)
              ? "bg-lightGray cursor-not-allowed"
              : "bg-darkGray"
          }
          textColor="text-white"
        />
      </footer>
    </div>
  );
};

export default CatInfoEdit;
