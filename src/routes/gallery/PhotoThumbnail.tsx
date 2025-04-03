import React, { useState } from 'react';
import { CircularProgress, Box } from '@mui/material';
import { Photo } from '../../types/photos';
import { useAppSelector } from '../../hooks';
import { selectPhotoStreamLayout } from '../../features/gridSlice';

interface PhotoThumbnailProps {
  photo: Photo;
  isPlaceholder?: boolean;
}

const PhotoThumbnail: React.FC<PhotoThumbnailProps> = ({ photo }) => {
  const [isLoading, setIsLoading] = useState(true);
  const layout = useAppSelector(selectPhotoStreamLayout)
    .find(item => item.id === photo.id);

  if (!layout) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        left: layout.left,
        top: layout.top,
        width: layout.width,
        height: layout.height,
        transition: 'transform 0.2s ease-out',
      }}
      onClick={() => console.log('Clicked', photo)}
    >
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.05)',
          }}
        >
          <CircularProgress size={40} />
        </Box>
      )}
      <img
        src={photo.src.medium}
        alt={photo.alt}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </Box>
  );
};

export default React.memo(PhotoThumbnail);
