import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import Input from "../components/Input";
import Header from "../components/Header";
import WideButton from "../components/WideButton";
import ExceptTopContentSection from "../components/ExceptTopContentSection";
import infoCat from "/Cat_bg.png";

const CatInfoEdit: React.FC = () => {
  const selectedCatId = useAppSelector((state) => state.cat.selectedCatId);
  const navigate = useNavigate();

  const [catDetails, setCatDetails] = useState<{
    name: string;
    breed: string;
    gender: string;
    neutered: string;
    birthdate: string;
    age: number | "";
    weight: number | "";
    characteristics: string;
    image: string;
  }>({
    name: "",
    breed: "",
    gender: "",
    neutered: "",
    birthdate: "",
    age: "",
    weight: "",
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

  const token = localStorage.getItem("jwt_access_token");
  if (!token) throw new Error("No access token found");

  // Firebase Storage에 이미지 업로드하는 함수
  const uploadImageToFirebase = async (file: File): Promise<string> => {
    try {
      const storage = getStorage();
      const fileExtension = file.name.split('.').pop();
      const fileName = `cat-images/${uuidv4()}.${fileExtension}`;
      const storageRef = ref(storage, fileName);

      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (error) {
      console.error("Failed to upload image to Firebase:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchCatDetails = async () => {
      try {
        const response = await api.get(`/api/cats/${selectedCatId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        setCatDetails({
          name: data.name || "",
          breed: data.breed || "",
          gender: data.gender || "",
          neutered: data.isNeutered ? "중성화 완료" : "중성화 전",
          birthdate: data.birthDate || "",
          age: data.age || null,
          weight: data.weight || null,
          characteristics: data.characteristics || "",
          image: data.profileImageUrl || "",
        });
      } catch (error) {
        console.error("Failed to fetch cat details", error);
        toast.error("고양이 정보를 불러오는데 실패했습니다.");
      }
    };

    if (selectedCatId) {
      fetchCatDetails();
    }
  }, [selectedCatId]);

  const handleSave = async () => {
    try {
      await api.put(
          `/api/cats/${selectedCatId}`,
          {
            name: catDetails.name,
            breed: catDetails.breed,
            gender: catDetails.gender,
            isNeutered: catDetails.neutered === "중성화 완료",
            birthDate: catDetails.birthdate,
            age: catDetails.age,
            weight: catDetails.weight,
            characteristics: catDetails.characteristics,
            profileImageUrl: catDetails.image,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      toast.success("성공적으로 수정되었습니다.", {
        onClose: () => navigate("/"),
      });
    } catch (error) {
      console.error("Failed to save cat details", error);
      toast.error("수정에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/cats/${selectedCatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("고양이 정보가 삭제되었습니다.", {
        onClose: () => navigate("/"),
      });
    } catch (error) {
      console.error("Failed to delete cat", error);
      toast.error("삭제 중 오류가 발생했습니다. 재시도 해주세요.");
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      toast.info("이미지 업로드 중...");
      const imageUrl = await uploadImageToFirebase(file);
      setCatDetails(prev => ({ ...prev, image: imageUrl }));
      toast.success("이미지가 업로드되었습니다.");
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast.error("이미지 업로드에 실패했습니다.");
    }
  };

  return (
      <div className="min-h-screen bg-white flex flex-col overflow-y-auto">
        <Header title="고양이 정보 수정" onBack={() => navigate(-1)} />

        <ExceptTopContentSection>
          <div>
            <h2 className="text-lg font-semibold mb-2">
              반려묘의 정보를 입력해주세요.
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              모든 필수 정보를 입력해주세요.
            </p>

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
                        className="w-32 h-32 md:w-24 md:h-24 rounded-full object-cover"
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

            <form className="pt-5 space-y-4">
              <Input
                  label={<>이름<span className="text-red-500"> *</span></>}
                  type="text"
                  value={catDetails.name}
                  onChange={(value) => setCatDetails(prev => ({ ...prev, name: value }))}
                  placeholder="고양이 이름을 입력하세요"
                  error={errors.name}
                  errorMessage="이름을 입력해주세요."
              />

              <Input
                  label="묘종"
                  type="text"
                  value={catDetails.breed}
                  onChange={(value) => setCatDetails(prev => ({ ...prev, breed: value }))}
                  placeholder="고양이 묘종을 입력하세요 (선택)"
              />

              <Input
                  label={<>성별<span className="text-red-500"> *</span></>}
                  type="select"
                  value={catDetails.gender}
                  onChange={(value) => setCatDetails(prev => ({ ...prev, gender: value }))}
                  options={["남아", "여아"]}
                  error={errors.gender}
                  errorMessage="성별을 선택해주세요."
              />

              <Input
                  label={<>중성화 여부<span className="text-red-500"> *</span></>}
                  type="select"
                  value={catDetails.neutered}
                  onChange={(value) => setCatDetails(prev => ({ ...prev, neutered: value }))}
                  options={["중성화 전", "중성화 완료"]}
                  error={errors.neutered}
                  errorMessage="중성화 여부를 선택해주세요."
              />

              <Input
                  label={<>생년월일<span className="text-red-500"> *</span></>}
                  type="date"
                  value={catDetails.birthdate}
                  onChange={(value) => setCatDetails(prev => ({ ...prev, birthdate: value }))}
              />

              <Input
                  label={<>나이<span className="text-red-500"> *</span></>}
                  type="number"
                  value={catDetails.age?.toString() || ""}
                  onChange={(value) => setCatDetails(prev => ({
                    ...prev,
                    age: parseInt(value, 10)
                  }))}
              />

              <Input
                  label={<>몸무게<span className="text-red-500"> *</span></>}
                  type="number"
                  value={catDetails.weight?.toString() || ""}
                  onChange={(value) => setCatDetails(prev => ({
                    ...prev,
                    weight: parseFloat(value)
                  }))}
              />

              <Input
                  label="특징"
                  type="textarea"
                  value={catDetails.characteristics}
                  onChange={(value) => setCatDetails(prev => ({ ...prev, characteristics: value }))}
              />
            </form>
          </div>
        </ExceptTopContentSection>

        <div className="flex text-xs text-gray-500 justify-end mr-8 mb-2">
        <span
            onClick={handleDelete}
            className="cursor-pointer hover:text-orange transition-colors duration-[200ms]"
        >
          고양이 정보 삭제
        </span>
        </div>

        <footer className="sticky bottom-0 left-0 w-full p-4 bg-white">
          <WideButton
              text="저장"
              onClick={handleSave}
              bgColor={Object.values(errors).some((error) => error)
                  ? "bg-lightGray cursor-not-allowed"
                  : "bg-darkGray"}
              textColor="text-white"
          />
        </footer>

        <ToastContainer position="bottom-center" autoClose={2000} />
      </div>
  );
};

export default CatInfoEdit;