import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/index';
import { Photo } from '../types/photos';

interface PhotoLayout {
  id: number;
  left: number;
  top: number;
  width: number;
  height: number;
  spans: {
    horizontal: number;
    vertical: number;
  };
}

interface PlaceholderLayout {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface GridPosition {
  grid: boolean[][];
  row: number;
  col?: number;
}

interface GridState {
  gridWidth: number;
  blockSize: number;
  gridBlockWidth: number;
  offset: number;
  gapSize: number;
  photoStreamLayout: PhotoLayout[];
  placeholderLayout: PlaceholderLayout[]; // New state
}

const MOBILE_BREAKPOINT = 768; // Standard mobile breakpoint
const SUGGESTED_BLOCK_SIZE = {
  mobile: 36,
  desktop: 64
};
const GAP_SIZE = {
  mobile: 4,
  desktop: 8
};
const MIN_SPAN = 3;
const MAX_SPAN = {
  mobile: 5,
  desktop: 8
};

const isReverseRow = (row: number): boolean => {
  return row % 2 !== 0;
};

const findAvailablePosition = (
  grid: boolean[][],
  currentRow: number,
  gridBlockWidth: number
): GridPosition => {
  let position: GridPosition = {
    grid,
    row: currentRow,
  };

  while (position.col === undefined) {
    if (!position.grid[position.row]) {
      position.grid.push(Array(gridBlockWidth).fill(false));
    }
    
    const isReverse = isReverseRow(position.row);
    const availableCol = isReverse
      ? position.grid[position.row].lastIndexOf(false)
      : position.grid[position.row].indexOf(false);

    if (availableCol < 0) {
      position.row++;
    } else {
      position.col = availableCol;
    }
  }

  return position;
};

const findAvailableWidth = (
  gridRow: boolean[],
  startCol: number,
  row: number
): number => {
  let availableWidth = 1;
  const isReverse = isReverseRow(row);
  let col = isReverse ? startCol - 1 : startCol + 1;

  while (col >= 0 && col < gridRow.length) {
    if (!gridRow[col]) {
      availableWidth++;
      col = isReverse ? col - 1 : col + 1;
    } else {
      break;
    }
  }

  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  return Math.min(availableWidth, isMobile ? MAX_SPAN.mobile : MAX_SPAN.desktop);
};

const calculatePhotoLayout = (
  photos: Photo[],
  blockSize: number,
  gapSize: number,
  gridBlockWidth: number,
  offset: number
): PhotoLayout[] => {
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  const maxSpanForDevice = isMobile ? MAX_SPAN.mobile : MAX_SPAN.desktop;
  
  const layout: PhotoLayout[] = [];
  let grid: boolean[][] = [];
  let currentRow = 0;

  const photosToProcess = [...photos];
  
  // First pass: layout all original photos
  while (photosToProcess.length > 0) {
    const photo = photosToProcess[0];
    photosToProcess.shift();

    const position = findAvailablePosition(grid, currentRow, gridBlockWidth);
    const availableCol = position.col!;
    const availableRow = position.row;
    grid = position.grid;
    currentRow = position.row;

    const availableWidth = findAvailableWidth(
      grid[availableRow],
      availableCol,
      availableRow
    );

    const aspectRatio = photo.width / photo.height;
    const minSpan = MIN_SPAN;
    const maxSpan = Math.min(availableWidth, maxSpanForDevice);

    // Calculate ideal spans based on actual photo dimensions
    const idealWidth = Math.sqrt(photo.width * minSpan / photo.height);
    const idealHeight = Math.sqrt(photo.height * minSpan / photo.width);
    
    // Initial spans calculation
    let horizontal = Math.round(idealWidth * minSpan);
    let vertical = Math.round(idealHeight * minSpan);

    // Ensure minimum spans
    horizontal = Math.min(maxSpan, Math.max(minSpan, horizontal));
    vertical = Math.min(maxSpanForDevice, Math.max(minSpan, vertical));

    // Limit vertical span based on horizontal span to prevent tall, narrow fillers
    if (horizontal <= 2) {
      // For single or double-width blocks, limit height to maintain better proportions
      const maxVerticalSpan = horizontal * 2;
      vertical = Math.min(vertical, maxVerticalSpan);
    } else if (horizontal === 3) {
      // For triple-width blocks, allow slightly taller proportions
      const maxVerticalSpan = Math.ceil(horizontal * 1.5);
      vertical = Math.min(vertical, maxVerticalSpan);
    }

    // Scale up small photos to better fill the grid
    if (horizontal <= 4 && vertical <= 4) {
      const scaleH = Math.floor(maxSpan / horizontal);
      const scaleV = Math.floor(maxSpanForDevice / vertical);
      const scale = Math.min(scaleH, scaleV);
      
      if (scale > 1) {
        // Only scale if it maintains aspect ratio reasonably well
        const newAspectRatio = (horizontal * scale) / (vertical * scale);
        const aspectRatioChange = Math.abs(newAspectRatio - aspectRatio) / aspectRatio;
        
        if (aspectRatioChange < 0.2) { // Allow 20% deviation
          horizontal *= scale;
          vertical *= scale;
        }
      }
    }

    // Adjust spans for very wide or tall photos
    if (aspectRatio > 2) {
      horizontal = Math.min(maxSpan, horizontal + 1);
      vertical = Math.max(minSpan, vertical - 1);
    } else if (aspectRatio < 0.5) {
      horizontal = Math.max(minSpan, horizontal - 1);
      vertical = Math.min(maxSpanForDevice, vertical + 1);
    }

    // Final height check for narrow spans
    if (horizontal <= 2) {
      vertical = Math.min(vertical, horizontal * 2);
    }

    const isReverse = isReverseRow(availableRow);
    const startCol = isReverse ? availableCol - (horizontal - 1) : availableCol;
    
    // Update grid occupancy
    for (let row = availableRow; row < availableRow + vertical; row++) {
      if (!grid[row]) {
        grid.push(Array(gridBlockWidth).fill(false));
      }
      for (let col = 0; col < horizontal; col++) {
        grid[row][startCol + col] = true;
      }
    }

    const width = horizontal * blockSize + (horizontal - 1) * gapSize;
    const height = vertical * blockSize + (vertical - 1) * gapSize;
    const left = startCol * (blockSize + gapSize) - offset;
    const top = availableRow * (blockSize + gapSize);

    layout.push({
      id: photo.id,
      left,
      top,
      width,
      height,
      spans: { horizontal, vertical }
    });
  }

  return layout;
};

const calculateBlockSize = (containerWidth: number): { blockSize: number; gridBlockWidth: number; offset: number } => {
  const isMobile = containerWidth <= MOBILE_BREAKPOINT;
  let idealBlockSize = isMobile ? SUGGESTED_BLOCK_SIZE.mobile : SUGGESTED_BLOCK_SIZE.desktop;
  const gapSize = isMobile ? GAP_SIZE.mobile : GAP_SIZE.desktop;
  let idealOffset = 0;
  const lowestSize = Math.ceil(idealBlockSize * 0.8);
  const largestSize = Math.floor(idealBlockSize * 1.2);
  const fitWidth = containerWidth + gapSize;
  let lowestOffset = idealBlockSize + gapSize;

  for (let currentSize = lowestSize; currentSize <= largestSize; currentSize++) {
    const step = currentSize + gapSize;
    const rowWidth = Math.ceil(fitWidth / step) * step;
    const currentOffset = rowWidth - fitWidth;
    
    if (currentOffset < lowestOffset) {
      idealOffset = Math.floor(currentOffset / 2);
      lowestOffset = currentOffset;
      idealBlockSize = currentSize;
    }
  }

  const gridBlockWidth = Math.ceil((containerWidth + gapSize) / (idealBlockSize + gapSize));

  return {
    blockSize: idealBlockSize,
    gridBlockWidth,
    offset: idealOffset
  };
};

const calculatePlaceholderLayout = (
  layout: PhotoLayout[],
  blockSize: number,
  gapSize: number,
  gridBlockWidth: number,
  offset: number
): PlaceholderLayout[] => {
  if (!layout.length) return [];

  const lastRow = Math.max(
    ...layout.map((item) =>
      Math.round((item.top + item.height) / (blockSize + gapSize))
    )
  );

  const targetRow = lastRow - 1;

  const grid: boolean[][] = [];
  layout.forEach((item) => {
    const startRow = Math.floor(item.top / (blockSize + gapSize));
    const endRow = Math.ceil(
      (item.top + item.height) / (blockSize + gapSize)
    );
    const startCol = Math.floor((item.left + offset) / (blockSize + gapSize));
    const endCol = Math.ceil(
      (item.left + offset + item.width) / (blockSize + gapSize)
    );

    for (let row = startRow; row < endRow; row++) {
      if (!grid[row]) grid[row] = Array(gridBlockWidth).fill(false);
      for (let col = startCol; col < endCol; col++) {
        grid[row][col] = true;
      }
    }
  });

  const placeholders: PlaceholderLayout[] = [];
  for (let row = 0; row <= targetRow; row++) {
    if (!grid[row]) grid[row] = Array(gridBlockWidth).fill(false);

    let col = 0;
    while (col < gridBlockWidth) {
      if (!grid[row][col]) {
        let width = 1;
        while (col + width < gridBlockWidth && !grid[row][col + width]) {
          width++;
        }

        let height = 1;
        let canExtend = true;
        while (canExtend && row + height <= targetRow) {
          for (let c = col; c < col + width; c++) {
            if (!grid[row + height] || grid[row + height][c]) {
              canExtend = false;
              break;
            }
          }
          if (canExtend) height++;
        }

        for (let r = row; r < row + height; r++) {
          for (let c = col; c < col + width; c++) {
            grid[r][c] = true;
          }
        }

        placeholders.push({
          left: col * (blockSize + gapSize) - offset,
          top: row * (blockSize + gapSize),
          width: width * blockSize + (width - 1) * gapSize,
          height: height * blockSize + (height - 1) * gapSize,
        });

        col += width;
      } else {
        col++;
      }
    }
  }

  return placeholders;
};

const initialState: GridState = {
  gridWidth: window.innerWidth,
  gapSize: window.innerWidth <= MOBILE_BREAKPOINT ? GAP_SIZE.mobile : GAP_SIZE.desktop,
  photoStreamLayout: [],
  placeholderLayout: [], // Initialize empty placeholder layout
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
      state.photoStreamLayout = [];
      state.placeholderLayout = [];
    },
    updatePhotoStreamLayout(state, action: PayloadAction<Photo[]>) {
      state.photoStreamLayout = calculatePhotoLayout(
        action.payload,
        state.blockSize,
        state.gapSize,
        state.gridBlockWidth,
        state.offset
      );
      state.placeholderLayout = calculatePlaceholderLayout(
        state.photoStreamLayout,
        state.blockSize,
        state.gapSize,
        state.gridBlockWidth,
        state.offset
      );
    },
  },
});

export const { updateGridWidth, updatePhotoStreamLayout } = gridSlice.actions;

export const selectGridWidth = (state: RootState) => state.grid.gridWidth;
export const selectBlockSize = (state: RootState) => state.grid.blockSize;
export const selectGridBlockWidth = (state: RootState) => state.grid.gridBlockWidth;
export const selectOffset = (state: RootState) => state.grid.offset;
export const selectGapSize = (state: RootState) => state.grid.gapSize;
export const selectPhotoStreamLayout = (state: RootState) => state.grid.photoStreamLayout;
export const selectPlaceholderLayout = (state: RootState) => state.grid.placeholderLayout;

export default gridSlice.reducer;
