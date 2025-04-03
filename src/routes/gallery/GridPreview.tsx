import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { useAppSelector } from '../../hooks';
import { 
  selectGridWidth, 
  selectBlockSize, 
  selectGridBlockWidth, 
  selectOffset,
  selectGapSize,
  selectPhotoStreamLayout 
} from '../../features/gridSlice';
import { Photo } from '../../types/photos';

interface GridPreviewProps {
  photoStream: Photo[];
}

interface GridSquare {
  key: string;
  left: number;
  top: number;
}

const GridPreview: React.FC<GridPreviewProps> = ({ photoStream }) => {
  const gridWidth = useAppSelector(selectGridWidth);
  const blockSize = useAppSelector(selectBlockSize);
  const gridBlockWidth = useAppSelector(selectGridBlockWidth);
  const offset = useAppSelector(selectOffset);
  const gapSize = useAppSelector(selectGapSize);
  const layout = useAppSelector(selectPhotoStreamLayout);

  const gridSquares = useMemo(() => {
    const squares: GridSquare[] = [];
    if (!layout.length) return squares;

    // Calculate total height based on the layout
    const maxBottom = Math.max(...layout.map(item => item.top + item.height));
    const rowCount = Math.ceil(maxBottom / (blockSize + gapSize));
    
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      for (let colIndex = 0; colIndex < gridBlockWidth; colIndex++) {
        squares.push({
          key: `${rowIndex}-${colIndex}`,
          left: colIndex * (blockSize + gapSize) - offset,
          top: rowIndex * (blockSize + gapSize)
        });
      }
    }
    
    return squares;
  }, [layout, gridBlockWidth, blockSize, gapSize, offset]);

  // Calculate the total height based on layout
  const totalHeight = useMemo(() => {
    if (!layout.length) return 0;
    return Math.max(...layout.map(item => item.top + item.height));
  }, [layout]);

  return (
    <Box
      sx={{
        position: 'absolute',
        width: gridWidth,
        height: totalHeight,
        zIndex: 10,
        contain: 'strict',
      }}
    >
      {gridSquares.map(square => (
        <Box
          key={square.key}
          sx={{
            position: 'absolute',
            width: blockSize,
            height: blockSize,
            backgroundColor: 'orange',
            opacity: 0.5,
            willChange: 'transform',
            transform: `translate(${square.left}px, ${square.top}px)`,
          }}
        />
      ))}
    </Box>
  );
};

export default React.memo(GridPreview);
