import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  IconButton,
  Collapse,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import GridOnIcon from "@mui/icons-material/GridOn";
import GridOffIcon from "@mui/icons-material/GridOff";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  selectedTopicUpdated,
  selectSelectedTopic,
  selectSelectedSubtopics,
  subtopicToggled,
} from "../../features/topicsSlice";
import { Topic, topics, topicsMap } from "../../types/topics";
import { useGetImagesByTermQuery } from "../../services/PexelsApiService";
import {
  addPhotos,
  removePhotos,
  removeAllPhotos,
  selectPhotoStream,
} from "../../features/photosSlice";
import PhotoThumbnail from "./PhotoThumbnail";
import {
  selectGridWidth,
  updatePhotoStreamLayout,
  selectBlockSize,
  selectGridBlockWidth,
  selectOffset,
  selectPlaceholderLayout,
} from "../../features/gridSlice";
import GridPreview from "./GridPreview";
import PlaceholderThumbnail from "./PlaceholderThumbnail";

const SingleSubtopicQuery: React.FC<{ subtopic: string }> = ({ subtopic }) => {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetImagesByTermQuery(subtopic);

  React.useEffect(() => {
    if (data) {
      dispatch(addPhotos({ subtopic, photos: data.photos }));
    }
  }, [data, subtopic, dispatch]);

  return isLoading ? (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
      }}
    >
      <CircularProgress />
    </Box>
  ) : null;
};

const SubtopicQueries: React.FC<{ subtopics: string[] }> = ({ subtopics }) => {
  return (
    <>
      {subtopics.map((subtopic) => (
        <SingleSubtopicQuery key={subtopic} subtopic={subtopic} />
      ))}
    </>
  );
};

const GalleryView: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectedTopic = useAppSelector(selectSelectedTopic);
  const selectedSubtopics = useAppSelector(selectSelectedSubtopics);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showGridPreview, setShowGridPreview] = useState(false);
  const gridWidth = useAppSelector(selectGridWidth);
  const photoStream = useAppSelector(selectPhotoStream);
  const blockSize = useAppSelector(selectBlockSize);
  const gridBlockWidth = useAppSelector(selectGridBlockWidth);
  const offset = useAppSelector(selectOffset);

  useEffect(() => {
    if (photoStream.length > 0) {
      dispatch(updatePhotoStreamLayout(photoStream));
    }
  }, [dispatch, photoStream, gridWidth, blockSize, gridBlockWidth, offset]);

  const handleTopicChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setFilterOpen(true);
    if (value === "" || topics.includes(value as Topic)) {
      dispatch(removeAllPhotos());
      dispatch(selectedTopicUpdated(value as Topic | ""));
    }
  };

  const handleSubtopicChange =
    (subtopic: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(subtopicToggled(subtopic));
      if (!event.target.checked) {
        dispatch(removePhotos(subtopic));
      }
    };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    dispatch(updatePhotoStreamLayout(photoStream));
  }, [dispatch, photoStream]);


  const placeholders = useAppSelector(selectPlaceholderLayout);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={filterOpen ? 0 : 1}
        sx={{
          backgroundColor: "primary.main",
        }}
      >
        <Toolbar
          sx={{
            py: { xs: 1, sm: 1 },
          }}
        >
          <Typography
            variant="h6"
            component="div"
            onClick={() => navigate("/")}
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              fontSize: {
                xs: "1.25rem",
                sm: "1.25rem",
              },
              color: "primary.contrastText",
              cursor: "pointer",
              "&:hover": {
                opacity: 0.8,
              },
            }}
          >
            Tiles
          </Typography>
          <IconButton
            onClick={() => setShowGridPreview(!showGridPreview)}
            sx={{
              color: "primary.contrastText",
              mr: 1,
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            {showGridPreview ? <GridOnIcon /> : <GridOffIcon />}
          </IconButton>
          <IconButton
            onClick={() => setFilterOpen(!filterOpen)}
            sx={{
              color: "primary.contrastText",
              mr: 2,
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            {filterOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: 120, sm: 200 },
              "& .MuiInputLabel-root": {
                color: "primary.contrastText",
                opacity: 0.7,
                "&.Mui-focused": {
                  color: "primary.contrastText",
                  opacity: 1,
                },
              },
              "& .MuiOutlinedInput-root": {
                color: "primary.contrastText",
                textTransform: "capitalize",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.7)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.contrastText",
                },
              },
              "& .MuiSelect-icon": {
                color: "primary.contrastText",
              },
            }}
          >
            <InputLabel id="topic-select-label">Topic</InputLabel>
            <Select
              labelId="topic-select-label"
              id="topic-select"
              value={selectedTopic}
              label="Topic"
              onChange={handleTopicChange}
              onClick={() => setFilterOpen(true)}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "primary.main",
                    "& .MuiMenuItem-root": {
                      color: "primary.contrastText",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "primary.dark",
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                      },
                    },
                  },
                },
              }}
            >
              {topics.map((topic) => (
                <MenuItem
                  key={topic}
                  value={topic}
                  sx={{
                    textTransform: "capitalize",
                  }}
                >
                  {topic}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Toolbar>
        <Collapse in={filterOpen}>
          <Box
            sx={{
              backgroundColor: "primary.dark",
              color: "primary.contrastText",
              py: { xs: 0.5, sm: 1 }, // Reduced vertical padding on mobile
              px: { xs: 2, sm: 2 }, // Added consistent horizontal padding
              borderTop: "1px solid",
              borderColor: "primary.light",
              position: "relative",
            }}
          >
            <IconButton
              onClick={() => setFilterOpen(false)}
              size="small"
              sx={{
                color: "primary.contrastText",
                position: "absolute",
                top: { xs: 4, sm: 8 },
                right: { xs: 8, sm: 8 }, // Adjusted to match new padding
                "&:hover": {
                  backgroundColor: "primary.light",
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            {selectedTopic ? (
              <FormGroup
                sx={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: { xs: "8px", sm: 1 },
                  pr: { xs: 3, sm: 4 },
                  "& .MuiFormControlLabel-root": {
                    mr: 0,
                    minWidth: "fit-content",
                    "& .MuiCheckbox-root": {
                      p: { xs: 0.5, sm: 1 },
                    },
                    "& .MuiTypography-root": {
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      pl: 0.5,
                      pr: { xs: 0.5, sm: 2 },
                    },
                  },
                }}
              >
                {selectedTopic &&
                  topicsMap[selectedTopic as keyof typeof topicsMap].map(
                    (subtopic: string) => (
                      <FormControlLabel
                        key={subtopic}
                        control={
                          <Checkbox
                            checked={selectedSubtopics.includes(subtopic)}
                            onChange={handleSubtopicChange(subtopic)}
                            sx={{
                              color: "primary.contrastText",
                              "&.Mui-checked": {
                                color: "primary.contrastText",
                              },
                            }}
                          />
                        }
                        label={capitalizeFirstLetter(subtopic)}
                        sx={{
                          color: "primary.contrastText",
                          minWidth: "fit-content",
                          px: { xs: 0.5, sm: 0 }, // Add horizontal padding on mobile
                        }}
                      />
                    )
                  )}
              </FormGroup>
            ) : (
              <Typography
                sx={{
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  py: { xs: 1, sm: 2 },
                }}
              >
                No subtopics available - please select a topic first
              </Typography>
            )}
          </Box>
        </Collapse>
      </AppBar>
      <Toolbar />
      {filterOpen && <Toolbar />}
      <div
        style={{
          paddingTop: 32,
          paddingBottom: 32,
          display: "flex",
          flexDirection: "column",
          // Remove justifyContent: "center" to allow natural document flow
        }}
      >
        <div
          className="thumbnail-container"
          style={{
            margin: 0,
            padding: 0,
            position: "relative",
            flex: 1,
          }}
        >
          {showGridPreview && <GridPreview photoStream={photoStream} />}
          <SubtopicQueries subtopics={selectedSubtopics} />
          {photoStream.length > 0 ? (
            <Box
              sx={{
                position: "relative",
                width: gridWidth,
                height: "auto",
              }}
            >
              {photoStream.map((photo) => (
                <PhotoThumbnail key={photo.id} photo={photo} />
              ))}
              {placeholders.map((placeholder, index) => (
                <PlaceholderThumbnail
                  key={`placeholder-${index}`}
                  {...placeholder}
                />
              ))}
            </Box>
          ) : (
            <Stack
              alignItems="center"
              spacing={2}
              sx={{
                py: 8,
                color: "text.secondary",
                width: gridWidth, // Match the width of ImageList
              }}
            >
              <ImageNotSupportedIcon sx={{ fontSize: 48 }} />
              <Typography variant="h6">
                {selectedTopic
                  ? "No photos found - try selecting different subtopics"
                  : "Select a topic to view photos"}
              </Typography>
            </Stack>
          )}
        </div>
      </div>
    </>
  );
};

export default GalleryView;
