// animations.ts
import { Variants } from "framer-motion";

// 슬라이드 인 애니메이션 (오른쪽에서 들어옴)
export const slideInVariants: Variants = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: "0%", opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
};

// 슬라이드 아웃 애니메이션 (왼쪽으로 나감)
export const slideOutVariants: Variants = {
  initial: { x: "-100%", opacity: 0 },
  animate: { x: "0%", opacity: 1 },
  exit: { x: "100%", opacity: 0 },
};

// 페이드 인/아웃 애니메이션
export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// 애니메이션 전환 설정
export const defaultTransition = {
  duration: 0.5,
  ease: "easeInOut",
};
