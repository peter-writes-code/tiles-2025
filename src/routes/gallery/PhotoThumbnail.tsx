import React, { useState } from 'react';
import { ImageListItem, CircularProgress, Box } from '@mui/material';
import { Photo } from '../../types/photos';

interface PhotoThumbnailProps {
  photo: Photo;
}

const PhotoThumbnail: React.FC<PhotoThumbnailProps> = ({ photo }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ImageListItem>
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
    </ImageListItem>
  );
};

export default PhotoThumbnail;
