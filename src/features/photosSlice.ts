import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/index';
import type { Photo } from '../types/photos';

interface PhotosState {
  photoResults: Partial<Record<string, Photo[]>>;
  photoStream: Photo[];
  selectedPhoto: Photo | null;
  selectedPhotoIndex: number | null;
}

const initialState: PhotosState = {
  photoResults: {},
  photoStream: [],
  selectedPhoto: null,
  selectedPhotoIndex: null,
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
  const uniquePhotos = allPhotos.reduce<Photo[]>((acc, photo) => {
    if (photo && !acc.some(existingPhoto => existingPhoto.id === photo.id)) {
      acc.push(photo);
    }
    return acc;
  }, []);
  return shuffleArray(uniquePhotos);
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
      state.selectedPhoto = null;
      state.selectedPhotoIndex = null;
    },
    setSelectedPhoto(state, action: PayloadAction<{ photo: Photo | null; index: number | null }>) {
      state.selectedPhoto = action.payload.photo;
      state.selectedPhotoIndex = action.payload.index;
    },
  },
});

export const { 
  addPhotos, 
  removePhotos, 
  removeAllPhotos,
  setSelectedPhoto 
} = photosSlice.actions;

export const selectPhotoResults = (state: RootState) => state.photos.photoResults;
export const selectPhotoStream = (state: RootState) => state.photos.photoStream;
export const selectSelectedPhoto = (state: RootState) => state.photos.selectedPhoto;
export const selectSelectedPhotoIndex = (state: RootState) => state.photos.selectedPhotoIndex;

export default photosSlice.reducer;
