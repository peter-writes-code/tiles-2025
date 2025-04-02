import React from 'react';
import { Box } from '@mui/material';
import { useAppSelector } from '../../hooks';
import { selectGridWidth, selectBlockSize, selectGridBlockWidth, selectOffset } from '../../features/gridSlice';

const GridPreview: React.FC = () => {
  const gridWidth = useAppSelector(selectGridWidth);
  const blockSize = useAppSelector(selectBlockSize);
  const gridBlockWidth = useAppSelector(selectGridBlockWidth);
  const offset = useAppSelector(selectOffset);

  const GAP_SIZE = 3;

  const containerHeight = document.querySelector('.thumbnail-container')?.clientHeight || window.innerHeight;
  const rowCount = Math.ceil((containerHeight + GAP_SIZE) / (blockSize + GAP_SIZE));

  return (
    <Box
      sx={{
        position: 'absolute',
        width: gridWidth,
        height: '100%',
        zIndex: 10,
      }}
    >
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        Array.from({ length: gridBlockWidth }).map((_, colIndex) => (
          <Box
            key={`${rowIndex}-${colIndex}`}
            sx={{
              position: 'absolute',
              left: `${colIndex * (blockSize + GAP_SIZE) - offset}px`,
              top: `${rowIndex * (blockSize + GAP_SIZE)}px`,
              width: blockSize,
              height: blockSize,
              backgroundColor: 'orange',
              opacity: 0.5,
            }}
          />
        ))
      ))}
    </Box>
  );
};

export default GridPreview;
