import { useState } from "react";
import { api } from "../../api/axios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setSelectedCatId, updateCatInfo } from "../../redux/slices/catSlice"; // Redux 액션 가져오기
import { useNavigate } from "react-router-dom";
// import { ensureAuthenticated } from "../../firebase/ensureAuthenticated";
import Input from "../../components/Input";
import Header from "../../components/Header";
import WideButton from "../../components/WideButton";
import ExceptTopContentSection from "../../components/ExceptTopContentSection";
import infoCat from "/Cat_bg.png";
import { uploadImageToFirebase } from "../../firebase/uploadImageToFirebase"; // Firebase 업로드 함수 가져오기

// CatInfoState와 동일한 타입 사용
interface CatInfoState {
  image: string | null;
  name: string;
  breed: string;
  gender: "남아" | "여아" | "";
  neutered: "중성화 전" | "중성화 완료" | "";
  birthdate: string;
  age: number | null;
  weight: number | null;
  characteristics: string;
  selectedCatId: number | null;
}

const CatInfo = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Redux 상태에서 device 배열 가져오기
  const deviceId = useAppSelector((state) => {
    const devices = state.device; // Redux의 device 배열
    return devices.length > 0 ? devices[devices.length - 1].id : null; // 마지막 디바이스의 ID 가져오기
  });

  console.log("선택된 디바이스 ID:", deviceId);

  // 로컬 상태 관리
  const [formData, setFormData] = useState<CatInfoState>({
    image: null,
    name: "",
    breed: "",
    gender: "", // "" | "남아" | "여아"
    neutered: "", // "" | "중성화 전" | "중성화 완료"
    birthdate: "",
    age: null,
    weight: null,
    characteristics: "",
    selectedCatId: null,
  });

  // 오류 상태 관리
  const [errors, setErrors] = useState({
    name: false,
    gender: false,
    neutered: false,
    birthdate: false,
    age: false,
  });

  // 입력값 변경 핸들러
  const handleInputChange = (
    field: keyof CatInfoState,
    value: string | number | null
  ) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: false });
  };

  // 이미지 변경 핸들러 (Firebase 업로드 제거)
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: reader.result as string, // Base64 또는 Data URL로 변환된 이미지 저장
      }));
    };
    reader.readAsDataURL(file);
  };

  // 다음 버튼 클릭 핸들러
  const handleNext = async () => {
    // 필수 필드 검증
    const newErrors = {
      name: !formData.name,
      gender: !formData.gender,
      neutered: !formData.neutered,
      birthdate: !formData.birthdate,
      age: formData.age === null || formData.age <= 0,
    };
    setErrors(newErrors);

    // 오류가 있는 경우 진행 중단
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    try {
      console.log("try문 시작");
      const token = localStorage.getItem("jwt_access_token"); // 토큰 가져오기

      // 중성화 여부를 true/false로 변환
      const isNeutered = formData.neutered === "중성화 완료";

      // 성별을 M/F로 변환
      const genderCode =
        formData.gender === "남아"
          ? "M"
          : formData.gender === "여아"
          ? "F"
          : null;

      // 디바이스 ID 확인
      console.log(deviceId);
      if (!deviceId) {
        throw new Error("Device ID is not available");
      }

      // API 요청에 보낼 데이터 선언
      const requestData = {
        deviceId, // Redux에서 가져온 deviceId 추가
        name: formData.name,
        breed: formData.breed || null, // 선택 항목은 null 처리
        gender: genderCode, // M 또는 F로 전달
        isNeutered, // true 또는 false로 전달
        birthDate: formData.birthdate,
        age: formData.age,
        weight: formData.weight || null, // 선택 항목은 null 처리
        characteristics: formData.characteristics || null, // 선택 항목은 null 처리
        profileImageUrl: formData.image, // 업로드된 이미지 URL 추가
      };

      // 요청 데이터를 콘솔에 출력
      console.log("API 요청 데이터:", requestData);

      // API 요청 보내기
      const response = await api.post("/api/cats", requestData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      console.log("고양이 정보 등록 성공:", response.data);

      // Redux 고양이 정보 상태 업데이트
      dispatch(updateCatInfo(formData));

      // Redux 선택된 고양이 상태 업데이트 (선택된 고양이 ID)
      if (response.data.id) {
        dispatch(setSelectedCatId(response.data.id)); // 응답 데이터에서 고양이 ID 저장
        console.log("선택된 고양이 ID:", response.data.id);
      }

      // 다음 단계로 이동
      navigate("/greeting");
    } catch (error) {
      console.error("고양이 정보 등록 실패:", error);
      alert("고양이 정보를 등록하는 데 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-y-auto">
      {/* 상단 헤더 */}
      <Header title="고양이 정보 등록" onBack={() => navigate(-1)} />

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
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="고양이"
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <img
                  src={infoCat}
                  alt="로고 고양이 옆 사진 아이콘"
                  className="w-32 h-32 md:w-24 md:h-24 rounded-full object-cover"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange} // 올바른 함수 호출
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* 입력 폼 */}
          <form className="pt-5 space-y-4">
            {/* 이름 입력 */}
            <Input
              label={
                <>
                  이름<span className="text-red-500"> *</span>
                </>
              }
              type="text"
              value={formData.name}
              onChange={(value) => handleInputChange("name", value)}
              placeholder="고양이 이름을 입력하세요"
              error={errors.name}
              errorMessage="이름을 입력해주세요."
            />

            {/* 묘종 입력 */}
            <Input
              label="묘종"
              type="text"
              value={formData.breed}
              onChange={(value) => handleInputChange("breed", value)}
              placeholder="고양이 묘종을 입력하세요 (선택)"
            />

            {/* 성별 입력 */}
            <Input
              label={
                <>
                  성별<span className="text-red-500"> *</span>
                </>
              }
              type="select"
              value={formData.gender}
              onChange={(value) =>
                handleInputChange("gender", value as "남아" | "여아")
              }
              options={["남아", "여아"]}
              error={errors.gender}
              errorMessage="성별을 선택해주세요."
            />

            {/* 중성화 여부 */}
            <Input
              label={
                <>
                  중성화 여부<span className="text-red-500"> *</span>
                </>
              }
              type="select"
              value={formData.neutered}
              onChange={(value) =>
                handleInputChange(
                  "neutered",
                  value as "중성화 전" | "중성화 완료"
                )
              }
              options={["중성화 전", "중성화 완료"]}
              error={errors.neutered}
              errorMessage="중성화 여부를 선택해주세요."
            />

            {/* 생년월일 입력 */}
            <Input
              label={
                <>
                  생년월일<span className="text-red-500"> *</span>
                </>
              }
              type="date"
              value={formData.birthdate}
              onChange={(value) => handleInputChange("birthdate", value)}
              error={errors.birthdate}
              errorMessage="생년월일을 입력해주세요."
            />

            {/* 나이 입력 */}
            <Input
              label={
                <>
                  나이<span className="text-red-500"> *</span>
                </>
              }
              type="number"
              value={formData.age?.toString() || ""}
              onChange={(value) =>
                handleInputChange("age", parseInt(value, 10))
              }
              placeholder="나이를 입력하세요"
              error={errors.age}
              errorMessage="유효한 나이를 입력해주세요."
            />

            {/* 몸무게 입력 */}
            <Input
              label={<>몸무게</>}
              type="number"
              value={formData.weight?.toString() || ""}
              onChange={(value) =>
                handleInputChange("weight", parseFloat(value))
              }
              placeholder="몸무게를 입력하세요"
            />

            {/* 특징 입력 */}
            <Input
              label={<>특징</>}
              type="textarea"
              value={formData.characteristics}
              onChange={(value) => handleInputChange("characteristics", value)}
            />
          </form>
        </div>
      </ExceptTopContentSection>

      {/* 하단 버튼 */}
      <footer className="sticky bottom-0 left-0 w-full p-4 bg-white">
        <WideButton
          text="다음"
          onClick={handleNext}
          bgColor={"bg-darkGray"}
          textColor={"text-white"}
        />
      </footer>
    </div>
  );
};

export default CatInfo;
