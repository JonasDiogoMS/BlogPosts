import { configureStore } from '@reduxjs/toolkit';
import fakeUserReducer from './authSlice';

export const store = configureStore({
  reducer: {
    fakeUser: fakeUserReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
