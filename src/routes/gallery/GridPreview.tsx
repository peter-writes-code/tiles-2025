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

const GridPreview: React.FC<GridPreviewProps> = ({ photoStream }) => {
  const gridWidth = useAppSelector(selectGridWidth);
  const blockSize = useAppSelector(selectBlockSize);
  const gridBlockWidth = useAppSelector(selectGridBlockWidth);
  const offset = useAppSelector(selectOffset);
  const gapSize = useAppSelector(selectGapSize);
  const layout = useAppSelector(selectPhotoStreamLayout);

  // Calculate the total height based on layout
  const totalHeight = useMemo(() => {
    if (!layout.length) return 0;
    return Math.max(...layout.map(item => item.top + item.height));
  }, [layout]);

  // Create a single canvas element instead of multiple DOM elements
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !layout.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = gridWidth;
    canvas.height = totalHeight;

    // Clear previous content
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set block style
    ctx.fillStyle = 'rgba(255, 165, 0, 0.5)'; // orange with 0.5 opacity

    // Calculate total height based on the layout
    const maxBottom = Math.max(...layout.map(item => item.top + item.height));
    const rowCount = Math.ceil(maxBottom / (blockSize + gapSize));
    
    // Draw all blocks in a single pass
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      for (let colIndex = 0; colIndex < gridBlockWidth; colIndex++) {
        const left = colIndex * (blockSize + gapSize) - offset;
        const top = rowIndex * (blockSize + gapSize);
        
        ctx.fillRect(left, top, blockSize, blockSize);
      }
    }
  }, [layout, gridWidth, totalHeight, blockSize, gridBlockWidth, gapSize, offset]);

  return (
    <Box
      sx={{
        position: 'absolute',
        width: gridWidth,
        height: totalHeight,
        zIndex: 10,
        contain: 'strict',
        pointerEvents: 'none', // Ensure it doesn't interfere with interactions
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(GridPreview);
