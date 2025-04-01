import { configureStore } from '@reduxjs/toolkit';
import topicsReducer from './features/topicsSlice';

export const store = configureStore({
  reducer: {
    topics: topicsReducer,
    // ... other reducers ...
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
