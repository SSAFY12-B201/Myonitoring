import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks"; // 커스텀 훅 가져오기
import { updateCatInfo } from "../../redux/slices/catSlice"; // 고양이 정보 슬라이스
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Header from "../../components/Header";
import WideButton from "../../components/WideButton";
import ExceptTopContentSection from "../../components/ExceptTopContentSection";
import infoCat from "../../assets/images/info_cat.png"

const CatInfo = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Redux 상태 가져오기
  const catInfo = useAppSelector((state) => state.cat);

  // 상태 관리: 각 필드의 오류 여부
  const [errors, setErrors] = useState({
    name: false,
    breed: false,
    gender: false,
    neutered: false,
    birthdate: false,
    age: false,
    weight: false,
    characteristics: false,
  });
  const handleNext = () => {
    // 각 필드의 오류 상태 업데이트
    const newErrors = {
      name: !catInfo.name,
      breed: false, // 선택 항목
      gender: !catInfo.gender,
      neutered: !catInfo.neutered,
      birthdate: !catInfo.birthdate,
      age: catInfo.age === null || catInfo.age <= 0, // 나이는 필수이고 0 이상이어야 함
      weight: catInfo.weight === null || catInfo.weight <= 0, // 몸무게 필수이고 0 이상이어야 함
      characteristics: false, // 선택 항목
    };
    setErrors(newErrors);

    // 하나라도 비어 있으면 진행 중단
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    // 모든 필드가 채워졌다면 다음 단계로 이동
    navigate("/greeting");
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
              {catInfo.image ? (
                <img
                  src={catInfo.image}
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
                    dispatch(updateCatInfo({ image: reader.result as string }));
                  };
                  reader.readAsDataURL(file);
                }}
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
              value={catInfo.name || ""}
              onChange={(value) => {
                dispatch(updateCatInfo({ name: value }));
                setErrors({ ...errors, name: false });
              }}
              placeholder="고양이 이름을 입력하세요"
              error={errors.name}
              errorMessage="이름을 입력해주세요."
            />

            {/* 묘종 입력 */}
            <Input
              label="묘종"
              type="text"
              value={catInfo.breed || ""}
              onChange={(value) => {
                dispatch(updateCatInfo({ breed: value }));
                setErrors({ ...errors, breed: false });
              }}
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
              value={catInfo.gender || ""}
              onChange={(value) => {
                dispatch(updateCatInfo({ gender: undefined })); // 타입 수정 필요요
                setErrors({ ...errors, gender: false });
              }}
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
              value={catInfo.neutered || ""}
              onChange={(value) => {
                dispatch(updateCatInfo({ neutered: undefined })); // 타입 수정 필요
                setErrors({ ...errors, neutered: false });
              }}
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
              value={catInfo.birthdate || ""}
              onChange={(value) => {
                dispatch(updateCatInfo({ birthdate: value }));
                setErrors({ ...errors, birthdate: false });
              }}
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
              value={catInfo.age?.toString() || ""}
              onChange={(value) => {
                const parsedValue = parseInt(value, 10);
                dispatch(
                  updateCatInfo({
                    age: isNaN(parsedValue) ? null : parsedValue,
                  })
                );
                setErrors({ ...errors, age: false });
              }}
              placeholder="나이를 입력하세요"
              error={errors.age}
              errorMessage="유효한 나이를 입력해주세요."
            />

            {/* 몸무게 입력 */}
            <Input
              label={
                <>
                  몸무게<span className="text-red-500"> *</span>
                </>
              }
              type="number"
              value={catInfo.weight?.toString() || ""}
              onChange={(value) => {
                const parsedValue = parseFloat(value);
                dispatch(
                  updateCatInfo({
                    weight: isNaN(parsedValue) ? null : parsedValue,
                  })
                );
                setErrors({ ...errors, weight: false });
              }}
              placeholder="몸무게를 입력하세요"
              error={errors.weight}
              errorMessage="유효한 몸무게를 입력해주세요."
            />

            {/* 특징 입력 */}
            <Input
              label="특징"
              type="textarea"
              value={catInfo.characteristics || ""}
              onChange={(value) => {
                dispatch(updateCatInfo({ characteristics: value }));
                setErrors({ ...errors, characteristics: false });
              }}
              placeholder="특징을 간단히 작성해주세요 (선택)"
            />
          </form>
        </div>
      </ExceptTopContentSection>

      {/* 하단 버튼 */}
      <footer className="sticky bottom-0 left-0 w-full p-4 bg-white">
        <WideButton
          text="다음"
          onClick={handleNext}
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

export default CatInfo;
