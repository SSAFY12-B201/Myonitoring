import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  date: string;
  type: 'error' | 'success' | 'warning' | 'info';
  title: string;
  description: string;
  read: boolean; // 읽음 여부
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
    notifications: [
        {
          id: "1",
          date: "2025-01-27",
          type: "error",
          title: "배급 이상 알림",
          description: "사료가 정상적으로 급여되지 않았어요. 사료통을 확인해 주세요!",
          read: false,
        },
        {
          id: "2",
          date: "2025-01-27",
          type: "success",
          title: "사료 급여 알림",
          description: "오전 9:00시에 사료 20g이 급여되었어요.",
          read: false,
        },
        {
          id: "3",
          date: "2025-01-27",
          type: "success",
          title: "사료 급여 알림",
          description: "오전 9:00시에 사료 20g이 급여되었어요.",
          read: false,
        },
        {
          id: "4",
          date: "2025-01-27",
          type: "warning",
          title: "섭취량 이상 알림",
          description:
            "가온이의 사료 섭취량이 지난주보다 50% 감소했어요. 상세 리포트를 확인해 주세요!",
          read: false,
        },
        {
          id: "5",
          date: "2025-01-26",
          type: "warning",
          title: "눈 건강 이상 알림",
          description:
            "가온이에게 권장량 이상의 증상이 발견되었어요. 상세 리포트를 확인해 주세요!",
          read: false,
        },
        {
          id: "6",
          date: "2025-01-26",
          type: "info",
          title: "내일 일정 알림",
          description:
            "2025-01-27 오전 09:00시에 정기검진 일정이 있어요. 상세 리포트를 확인해 주세요!",
          read: false,
        },
      ],
    };


const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications = action.payload;
    },
    markAsRead(state, action: PayloadAction<string>) {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
});

export const { setNotifications, markAsRead, clearNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
