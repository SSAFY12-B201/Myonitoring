import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { initializeFirebase } from "./config";

export const uploadImageToFirebase = async (file: File): Promise<string> => {
  try {
    const { storage } = await initializeFirebase(); // storage 가져오기
    const storageRef = ref(storage, `images/${file.name}`); // 업로드 경로 설정
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL); // 다운로드 URL 반환
        }
      );
    });
  } catch (error) {
    console.error("이미지 업로드 실패:", error);
    throw error;
  }
};
