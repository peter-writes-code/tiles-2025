import React, { useState } from "react";
import { CircularProgress, Box, Fade } from "@mui/material";
import { Photo } from "../../types/photos";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { selectPhotoStreamLayout } from "../../features/gridSlice";
import { setSelectedPhoto } from "../../features/photosSlice";

interface PhotoThumbnailProps {
  photo: Photo;
  index: number;
  onPhotoSelect?: () => void;
}

const FADE_DURATION = 240;
const DELAY_PER_ITEM = 64;
const MAX_DELAY = 640;

const PhotoThumbnail: React.FC<PhotoThumbnailProps> = ({ photo, index, onPhotoSelect }) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const layout = useAppSelector(selectPhotoStreamLayout).find(
    (item) => item.id === photo.id
  );

  const handleClick = () => {
    dispatch(setSelectedPhoto({ photo, index }));
    onPhotoSelect?.();
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, Math.min(index * DELAY_PER_ITEM, MAX_DELAY));

    return () => clearTimeout(timer);
  }, [index]);

  if (!layout) return null;

  return (
    <Fade in={isVisible} timeout={FADE_DURATION}>
      <Box
        onClick={handleClick}
        sx={{
          position: "absolute",
          left: layout.left,
          top: layout.top,
          width: layout.width,
          height: layout.height,
          transition: "transform 0.2s ease-out",
          bgcolor: "grey.100",
          cursor: "pointer",
          opacity: "0.4",
        }}
      >
        {isLoading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={40} />
          </Box>
        )}
        <Fade in={imageLoaded} timeout={FADE_DURATION}>
          <img
            src={photo.src.medium}
            alt={photo.alt}
            loading="lazy"
            draggable={false}
            onLoad={() => {
              setIsLoading(false);
              setImageLoaded(true);
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              userSelect: "none",
              opacity: "1",
              transition: "opacity 0.064s ease-in",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          />
        </Fade>
      </Box>
    </Fade>
  );
};

export default React.memo(PhotoThumbnail);
