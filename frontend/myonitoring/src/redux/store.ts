import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';
import catReducer from './slices/catSlice';
import reservationReducer from './slices/reservationsSlice';
import medicalRecordsReducer from './slices/medicalRecordsSlice';



const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    cat: catReducer,
    reservation: reservationReducer,
    medicalRecords: medicalRecordsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;