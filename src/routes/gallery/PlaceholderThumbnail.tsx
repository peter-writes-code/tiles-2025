import React from 'react';
import { Box } from '@mui/material';

interface PlaceholderThumbnailProps {
  left: number;
  top: number;
  width: number;
  height: number;
}

const PlaceholderThumbnail: React.FC<PlaceholderThumbnailProps> = ({ 
  left, 
  top, 
  width, 
  height 
}) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        backgroundColor: 'primary.light',
        opacity: .4,
        transition: 'transform 0.2s ease-out',
      }}
    />
  );
};

export default React.memo(PlaceholderThumbnail);
