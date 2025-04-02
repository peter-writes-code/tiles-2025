import { configureStore } from '@reduxjs/toolkit';
import topicsReducer from '../features/topicsSlice';
import photosReducer from '../features/photosSlice';
import gridReducer from '../features/gridSlice';
import { pexelsApi } from '../services/PexelsApiService';

export const store = configureStore({
  reducer: {
    topics: topicsReducer,
    photos: photosReducer,
    grid: gridReducer,
    [pexelsApi.reducerPath]: pexelsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pexelsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
