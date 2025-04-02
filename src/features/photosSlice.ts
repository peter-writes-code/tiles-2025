import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/index';
import type { Topic, Subtopic } from '../types/topics';
import type { Photo } from '../types/photos';

interface PhotosState {
  photoResults: Partial<Record<string, Photo[]>>;
  photoStream: Photo[];
}

const initialState: PhotosState = {
  photoResults: {},
  photoStream: [],
};

const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const updatePhotoStream = (photoResults: Partial<Record<string, Photo[]>>): Photo[] => {
  const allPhotos = Object.values(photoResults).flat();
  return shuffleArray(allPhotos.filter((photo): photo is Photo => photo !== undefined));
};

export const photosSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    addPhotos(
      state,
      action: PayloadAction<{ subtopic: string; photos: Photo[] }>
    ) {
      const { subtopic, photos } = action.payload;
      state.photoResults[subtopic] = photos;
      state.photoStream = updatePhotoStream(state.photoResults);
    },
    removePhotos(state, action: PayloadAction<string>) {
      const subtopic = action.payload;
      delete state.photoResults[subtopic];
      state.photoStream = updatePhotoStream(state.photoResults);
    },
    removeAllPhotos(state) {
      state.photoResults = {};
      state.photoStream = [];
    },
  },
});

export const { addPhotos, removePhotos, removeAllPhotos } = photosSlice.actions;

export const selectPhotoResults = (state: RootState) => state.photos.photoResults;
export const selectPhotoStream = (state: RootState) => state.photos.photoStream;

export default photosSlice.reducer;
