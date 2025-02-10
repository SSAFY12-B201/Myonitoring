import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks"; // 커스텀 훅 가져오기
import { updateCatInfo } from "../redux/slices/catSlice"; // 고양이 정보 슬라이스
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Header from "../components/Header";
import WideButton from "../components/WideButton";
import ContentSection from "../components/ContentSection";
import infoCat from "../assets/images/info_cat.png";

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
    const newErrors = {
      name: !catInfo.name,
      breed: false, // 선택 항목
      gender: !catInfo.gender,
      neutered: !catInfo.neutered,
      birthdate: !catInfo.birthdate,
      age: catInfo.age === null || catInfo.age <= 0, // 나이는 필수이고 0 이상이어야 함
      weight: false, // 선택 항목
      characteristics: false, // 선택 항목
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    navigate("/next-step");
  };

  const isFormValid =
    !!catInfo.name &&
    !!catInfo.gender &&
    !!catInfo.neutered &&
    !!catInfo.birthdate &&
    catInfo.age !== null &&
    catInfo.age > 0;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch(updateCatInfo({ image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-y-auto">
      {/* 상단 헤더 */}
      <Header title="고양이 정보 등록" onBack={() => navigate(-1)} />

      <ContentSection>
        <div>
          <h2 className="text-lg font-semibold mb-2">처음 가입하시네요!</h2>
          <p className="text-xs text-gray-400 mb-6">
            반려묘의 정보를 입력해주세요.
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
                  src= {infoCat}
                  alt="로고 고양이 옆 사진 아이콘"
                  className="w-32 h-33 object-cover"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* 입력 폼 */}
          <form className="pt-5 space-y-4">
            {/* 이름 입력 */}
            <Input
              label="이름"
              type="text"
              value={catInfo.name || ""}
              onChange={(value) => {
                dispatch(updateCatInfo({ name: value }));
                setErrors({ ...errors, name: false });
              }}
              placeholder="고양이 이름을 입력하세요"
              className={errors.name ? "border-red-500" : ""}
              error={errors.name}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">이름을 입력해주세요.</p>
            )}

            {/* 묘종 입력 */}
            <Input
              label="묘종 (선택)"
              type="text"
              value={catInfo.breed || ""}
              onChange={(value) => {
                dispatch(updateCatInfo({ breed: value }));
                setErrors({ ...errors, breed: false });
              }}
              placeholder="고양이 묘종을 입력하세요 (선택)"
            />

            {/* 성별 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                성별
              </label>
              <div className="flex space-x-4 mb-7">
                {["남아", "여아"].map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      checked={catInfo.gender === option}
                      onChange={() => {
                        dispatch(
                          updateCatInfo({ gender: option as "남아" | "여아" })
                        );
                        setErrors({ ...errors, gender: false });
                      }}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">
                  성별을 선택해주세요.
                </p>
              )}
            </div>

            {/* 중성화 여부 */}
            <Input
              label="중성화 여부"
              type="select"
              value={catInfo.neutered || ""}
              onChange={(value) => {
                dispatch(
                  updateCatInfo({
                    neutered: value as "중성화 전" | "중성화 완료",
                  })
                );
                setErrors({ ...errors, neutered: false });
              }}
              options={["중성화 전", "중성화 완료"]}
            />

            {/* 생년월일 입력 */}
            <Input
              label="생년월일"
              type="date"
              value={catInfo.birthdate || ""}
              onChange={(value) => {
                dispatch(updateCatInfo({ birthdate: value }));
                setErrors({ ...errors, birthdate: false }); // 수정 시 오류 해제
              }}
              placeholder=""
              className={errors.birthdate ? "border-red-500" : ""}
              error={errors.birthdate} // 에러 상태 전달
            />
            {errors.birthdate && (
              <p className="text-red-500 text-xs mt-1">
                생년월일을 입력해주세요.
              </p>
            )}

            {/* 나이 입력 */}
            <Input
              label="나이"
              type="number"
              value={catInfo.age?.toString() || ""}
              onChange={(value) => {
                const parsedValue = parseInt(value, 10);
                dispatch(
                  updateCatInfo({
                    age: isNaN(parsedValue) ? null : parsedValue,
                  })
                );
                setErrors({ ...errors, age: false }); // 수정 시 오류 해제
              }}
              placeholder="나이를 입력하세요"
              className={errors.age ? "border-red-500" : ""}
              error={errors.age} // 에러 상태 전달
            />
            {errors.age && (
              <p className="text-red-500 text-xs mt-1">
                유효한 나이를 입력해주세요.
              </p>
            )}

            {/* 몸무게 입력 */}
            <Input
              label="몸무게"
              type="number"
              value={catInfo.weight?.toString() || ""}
              onChange={(value) => {
                const parsedValue = parseFloat(value);
                dispatch(
                  updateCatInfo({
                    weight: isNaN(parsedValue) ? null : parsedValue,
                  })
                );
                setErrors({ ...errors, weight: false }); // 수정 시 오류 해제
              }}
              placeholder="몸무게를 입력하세요"
            />

            {/* 특징 입력 */}
            <Input
              label="특징 (선택)"
              type="textarea"
              value={catInfo.characteristics || ""}
              onChange={(value) => {
                dispatch(updateCatInfo({ characteristics: value }));
                setErrors({ ...errors, characteristics: false }); // 수정 시 오류 해제
              }}
              placeholder="특징을 간단히 작성해주세요 (선택)"
            />
          </form>
        </div>
      </ContentSection>

      {/* 하단 버튼 */}
      <footer className="sticky bottom-0 left-0 w-full p-4 bg-white">
        <WideButton
          text="다음"
          onClick={() => isFormValid && handleNext()} // 유효할 때만 이동
          disabled={!isFormValid} // 비활성화 조건 적용
          bgColor={
            isFormValid ? "bg-blue-500" : "bg-gray-300 cursor-not-allowed" // 활성화/비활성화 스타일 적용
          }
          textColor="text-white"
        />
      </footer>
    </div>
  );
};

export default CatInfo;
