import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios"; // Axios 인스턴스 임포트
import Header from "../../components/Header";
import ExceptTopContentSection from "../../components/ExceptTopContentSection";
import WideButton from "../../components/WideButton";
import Input from "../../components/Input";
import { toast, ToastContainer } from "react-toastify"; // Toastify 추가
import "react-toastify/dist/ReactToastify.css"; // Toastify 스타일 추가
import { useAppDispatch, useAppSelector } from "../../redux/hooks"; // Redux 디스패치 훅
import { updateUserInfo } from "../../redux/slices/userSlice";

// 확인 모달 컴포넌트
const ConfirmModal = ({ isOpen, onConfirm, onCancel }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <p className="text-lg mb-4">정말로 회원탈퇴 하시겠습니까?</p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onConfirm}
          >
            탈퇴
          </button>
        </div>
      </div>
    </div>
  );
};

const EditPersonal = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux 상태에서 초기값 가져오기
  const {
    nickname: initialNickname,
    phoneNumber: initialPhoneNumber,
    address: initialAddress,
  } = useAppSelector((state) => state.user);

  // 로컬 상태 관리
  const [nickname, setNickname] = useState(initialNickname);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [address, setAddress] = useState(initialAddress);
  const [email, setEmail] = useState(""); // 이메일 상태 추가
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false); // 필드가 수정되었는지 여부

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 회원 정보 조회 함수
  const fetchUserInfo = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("jwt_access_token");
      if (!token) throw new Error("No access token found");

      // API 호출
      const response = await api.get("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Redux 상태 업데이트
      dispatch(updateUserInfo(response.data));

      // 이메일 및 초기값 설정
      setEmail(response.data.email);
      setNickname(response.data.nickname);
      setPhoneNumber(response.data.phoneNumber);
      setAddress(response.data.address);
    } catch (err: any) {
      console.error("회원 정보 조회 실패:", err);
      setError(
        err.response?.data?.message || "회원 정보를 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // 회원 정보 수정 함수
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("jwt_access_token");
      if (!token) throw new Error("No access token found");

      // 수정할 데이터 준비
      const requestBody = {
        nickname,
        phoneNumber,
        address,
      };

      // API 호출
      const response = await api.put("/api/users/me", requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Redux 상태 업데이트
      dispatch(updateUserInfo(response.data));

      // 성공 메시지 표시 (Toast)
      toast.success("회원정보가 성공적으로 수정되었습니다!");

      // 수정 모드 종료
      setIsEditing(false);
    } catch (err: any) {
      console.error("회원정보 수정 실패:", err);

      // 실패 메시지 표시 (Toast)
      toast.error("회원정보 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 로그아웃 함수
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("jwt_access_token");
      if (!token) throw new Error("No access token found");

      await api.post(
        "/api/auth/signout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch({ type: "resetAllState" });
      localStorage.removeItem("kakao_access_token");
      localStorage.removeItem("jwt_access_token");

      // 성공 메시지 표시 후 리다이렉트
      toast.success("로그아웃 되었습니다.", {
        onClose: () => navigate("/"), // 토스트가 닫힌 후 리다이렉트
      });
    } catch (error) {
      console.error("로그아웃 실패:", error);

      toast.error("로그아웃에 실패했습니다.");
    }
  };

  // 회원탈퇴 함수
  const handleWithdraw = async () => {
    try {
      const token = localStorage.getItem("jwt_access_token");
      if (!token) throw new Error("No access token found");

      await api.delete("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch({ type: "resetAllState" });
      localStorage.removeItem("kakao_access_token");
      localStorage.removeItem("jwt_access_token");

      toast.success("회원탈퇴가 완료되었습니다."); // 성공 메시지 표시
      // 루트 경로로 이동
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("회원탈퇴 실패:", error);

      toast.error("회원탈퇴에 실패했습니다. 다시 시도해주세요."); // 실패 메시지 표시
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const hasChanges =
    nickname !== initialNickname ||
    phoneNumber !== initialPhoneNumber ||
    address !== initialAddress;

  const hasEmptyFields =
    !nickname?.trim() || !phoneNumber?.trim() || !address?.trim();

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <Header title="회원정보 수정" onBack={() => navigate(-1)} />

      <ExceptTopContentSection>
        <div className="max-w-md mx-auto bg-white pb-6">
          {/* 닉네임 */}
          <Input
            label="닉네임"
            type="text"
            value={nickname}
            onChange={(value) => {
              setNickname(value);
              setIsEditing(true);
            }}
          />

          {/* 이메일 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              이메일
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed">
              {email}
            </div>
          </div>

          {/* 휴대폰 번호 */}
          <Input
            label="휴대폰 번호"
            type="tel"
            value={phoneNumber}
            onChange={(value) => {
              setPhoneNumber(value);
              setIsEditing(true);
            }}
          />

          {/* 주소 */}
          <Input
            label="주소"
            type="text"
            value={address}
            onChange={(value) => {
              setAddress(value);
              setIsEditing(true);
            }}
          />

          {/* 연동 계정 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              연동 계정
            </label>
            <div className="w-full px-[12px] py-[10px] border border-gray-[#ccc] text-gray-500 rounded-md bg-[#f7f7f7] cursor-not-alowed">
              카카오 로그인
            </div>
          </div>

          {/* 로그아웃 | 회원탈퇴 */}
          <div className="flex text-xs justify-end items-center space-x-2">
            <span
              onClick={handleLogout}
              className="cursor-pointer hover:text-orange transition-colors duration-[200ms]"
            >
              로그아웃
            </span>
            <span>|</span>
            <span
              onClick={() => setIsModalOpen(true)} // 모달 열기
              className="cursor-pointer hover:text-orange transition-colors duration-[200ms]"
            >
              회원탈퇴
            </span>
          </div>
        </div>

        {/* 저장 버튼 */}
        <footer className="fixed bottom-2 left-0 w-full p-4">
          {isEditing && hasChanges && !hasEmptyFields && (
            <WideButton
              text="저장하기"
              onClick={handleSave}
              bgColor={"bg-orange"}
              textColor={"text-white"}
            />
          )}
        </footer>

        {/* ToastContainer */}
        <ToastContainer position="bottom-center" autoClose={2000} />

        {/* 확인 모달 */}
        <ConfirmModal
          isOpen={isModalOpen}
          onConfirm={() => {
            handleWithdraw();
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </ExceptTopContentSection>
    </>
  );
};

export default EditPersonal;
