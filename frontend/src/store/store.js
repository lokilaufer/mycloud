import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import usersReducer from './usersSlice';
import filesReducer from './filesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    files: filesReducer,
  },
});
