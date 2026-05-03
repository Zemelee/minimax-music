import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import generationReducer from './slices/generationSlice';
import worksReducer from './slices/worksSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    generation: generationReducer,
    works: worksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略这些 action 类型以避免序列化警告
        ignoredActions: [],
        // 忽略这些路径以避免序列化警告
        ignoredPaths: [],
      },
    }),
});
