import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/index';

interface GridState {
  gridWidth: number;
  blockSize: number;
  gridBlockWidth: number;
  offset: number;
}

const SUGGESTED_BLOCK_SIZE = 36;
const GAP_SIZE = 3;

const calculateBlockSize = (containerWidth: number): { blockSize: number; gridBlockWidth: number; offset: number } => {
  let idealBlockSize = SUGGESTED_BLOCK_SIZE;
  let idealOffset = 0;
  const lowestSize = Math.ceil(SUGGESTED_BLOCK_SIZE * 0.8);
  const largestSize = Math.floor(SUGGESTED_BLOCK_SIZE * 1.2);
  const fitWidth = containerWidth + GAP_SIZE;
  let lowestOffset = idealBlockSize + GAP_SIZE;

  // Find the block size that creates the smallest offset
  for (let currentSize = lowestSize; currentSize <= largestSize; currentSize++) {
    const step = currentSize + GAP_SIZE;
    const rowWidth = Math.ceil(fitWidth / step) * step;
    const currentOffset = rowWidth - fitWidth;
    
    if (currentOffset < lowestOffset) {
      idealOffset = Math.floor(currentOffset / 2);
      lowestOffset = currentOffset;
      idealBlockSize = currentSize;
    }
  }

  const gridBlockWidth = Math.ceil((containerWidth + GAP_SIZE) / (idealBlockSize + GAP_SIZE));

  return {
    blockSize: idealBlockSize,
    gridBlockWidth,
    offset: idealOffset
  };
};

const initialState: GridState = {
  gridWidth: window.innerWidth,
  ...calculateBlockSize(window.innerWidth)
};

export const gridSlice = createSlice({
  name: 'grid',
  initialState,
  reducers: {
    updateGridWidth(state, action: PayloadAction<number>) {
      state.gridWidth = action.payload;
      const { blockSize, gridBlockWidth, offset } = calculateBlockSize(action.payload);
      state.blockSize = blockSize;
      state.gridBlockWidth = gridBlockWidth;
      state.offset = offset;
    },
  },
});

export const { updateGridWidth } = gridSlice.actions;

export const selectGridWidth = (state: RootState) => state.grid.gridWidth;
export const selectBlockSize = (state: RootState) => state.grid.blockSize;
export const selectGridBlockWidth = (state: RootState) => state.grid.gridBlockWidth;
export const selectOffset = (state: RootState) => state.grid.offset;

export default gridSlice.reducer;
