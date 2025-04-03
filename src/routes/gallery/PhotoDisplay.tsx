import React, { useState } from "react";
import {
  Box,
  IconButton,
  Fade,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  selectSelectedPhoto,
  setSelectedPhoto,
  selectPhotoStream,
} from "../../features/photosSlice";

const FADE_DURATION = 240;

const PhotoDisplay: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedPhoto = useAppSelector(selectSelectedPhoto);
  const photoStream = useAppSelector(selectPhotoStream);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showAltText, setShowAltText] = useState(false);
  const boxRef = React.useRef<HTMLDivElement>(null);

  const currentIndex = selectedPhoto ? photoStream.findIndex(photo => photo.id === selectedPhoto.id) : -1;

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (currentIndex === -1) return;
    
    let newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    
    // Handle wrapping around
    if (newIndex < 0) newIndex = photoStream.length - 1;
    if (newIndex >= photoStream.length) newIndex = 0;
    
    const newPhoto = photoStream[newIndex];
    setImageLoaded(false);  // Reset loading state for new image
    dispatch(setSelectedPhoto({ photo: newPhoto, index: newIndex }));
  };

  const handleClose = () => {
    dispatch(setSelectedPhoto({ photo: null, index: null }));
    setImageLoaded(false);
    setShowAltText(false);
  };

  // Focus the box when the photo is displayed
  React.useEffect(() => {
    if (selectedPhoto && boxRef.current) {
      boxRef.current.focus();
    }
  }, [selectedPhoto]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setShowAltText(true);
  };

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setShowAltText(false);
  };

  const handleImageClick = () => {
    setShowAltText(true);
  };

  if (!selectedPhoto) return null;

  return (
    <>
      <Fade in={Boolean(selectedPhoto)}>
        <Box
          ref={boxRef}
          onClick={handleClose}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              handleClose();
            } else if (e.key === 'ArrowLeft') {
              handleNavigate('prev');
            } else if (e.key === 'ArrowRight') {
              handleNavigate('next');
            }
          }}
          tabIndex={0}
          role="presentation"
          autoFocus
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0, 0, 0, 0.9)",
            zIndex: 1300, // Increased from 1200 to be above AppBar (which is typically 1100)
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            outline: "none",
          }}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "white",
              bgcolor: "rgba(0, 0, 0, 0.5)",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.7)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Left Navigation Button */}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate('prev');
            }}
            sx={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: "white",
              bgcolor: "rgba(0, 0, 0, 0.5)",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.7)",
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          {/* Right Navigation Button */}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate('next');
            }}
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: "white",
              bgcolor: "rgba(0, 0, 0, 0.5)",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.7)",
              },
            }}
          >
            <ChevronRightIcon />
          </IconButton>

          {!imageLoaded && (
            <Box
              sx={{
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={40} sx={{ color: "white" }} />
            </Box>
          )}

          <Fade in={imageLoaded} timeout={FADE_DURATION}>
            <Box
              component="img"
              src={selectedPhoto.src.large2x}
              alt={selectedPhoto.alt}
              onLoad={handleImageLoad}
              onClick={(e) => {
                e.stopPropagation();
                handleImageClick();
              }}
              draggable={false}
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                userSelect: 'none',
              }}
            />
          </Fade>
        </Box>
      </Fade>

      {selectedPhoto.alt && (
        <Snackbar
          open={showAltText}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          message={selectedPhoto.alt}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          sx={{
            bottom: { xs: 16, sm: 24 },
          }}
        />
      )}
    </>
  );
};

export default PhotoDisplay;
