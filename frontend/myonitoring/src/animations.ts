import { Location } from "react-router-dom";
import { Variants } from "framer-motion";

// 애니메이션 Variants 정의
export const slideInVariants: Variants = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
};

export const slideOutVariants: Variants = {
  initial: { x: "-100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "100%", opacity: 0 },
};

// 애니메이션 Transition 설정
export const defaultTransition = {
  duration: 0.4,
  ease: "easeInOut",
};

// Location의 state 타입 정의
interface CustomLocationState {
  fromDetail?: boolean;
  fromUserInfo?: boolean;
  fromDeviceGuide?: boolean;
}

// getAnimationVariants 함수 정의
export const getAnimationVariants = (location: Location): Variants => {
  // location.state를 커스텀 타입으로 단언
  const state = location.state as CustomLocationState | undefined;

  if (state?.fromDetail || state?.fromUserInfo || state?.fromDeviceGuide) {
    return slideOutVariants; // 뒤로 가기 애니메이션
  }

  return slideInVariants; // 앞으로 가기 애니메이션
};


export const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeTransition = {
  duration: 0.3,
  ease: "easeInOut",
};
