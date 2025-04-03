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
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Stack,
  Drawer,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import GridOnIcon from "@mui/icons-material/GridOn";
import GridOffIcon from "@mui/icons-material/GridOff";
import FilterListIcon from "@mui/icons-material/FilterList";
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
import PhotoDisplay from './PhotoDisplay';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      <PhotoDisplay />
      <AppBar
        position="fixed"
        elevation={filterOpen ? 0 : 1}
        sx={{
          backgroundColor: "primary.main",
          zIndex: (theme) => theme.zIndex.drawer + 1,
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
            Tiles 2025
          </Typography>
          <Tooltip title="Toggle grid preview">
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
          </Tooltip>
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
          <Tooltip title="Select subtopics">
            <IconButton
              onClick={() => setFilterOpen(!filterOpen)}
              sx={{
                color: "primary.contrastText",
                ml: 1,
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor={isMobile ? "bottom" : "right"}
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        BackdropProps={{
          sx: {
            backgroundColor: 'transparent'  // This removes the dark overlay
          }
        }}
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : "240px",
            maxHeight: isMobile ? "80vh" : "100%",
            backgroundColor: "primary.dark",
            borderLeft: isMobile ? "none" : "1px solid",
            borderColor: "primary.light",
          },
        }}
      >
        <Box sx={{ 
          p: 2,
          pt: 3,
          position: 'relative',
          height: '100%',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.3)',
            },
          },
        }}>
          <IconButton
            onClick={() => setFilterOpen(false)}
            size="small"
            sx={{
              color: "primary.contrastText",
              position: "absolute",
              top: 8,
              right: 8,
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
                mt: 4,
                "& .MuiFormControlLabel-root": {
                  marginRight: 0,
                  marginY: 0.25,
                },
                "& .MuiCheckbox-root": {
                  py: 0.5,
                }
              }}
            >
              {topicsMap[selectedTopic as keyof typeof topicsMap].map(
                (subtopic: string) => (
                  <FormControlLabel
                    key={subtopic}
                    control={
                      <Checkbox
                        checked={selectedSubtopics.includes(subtopic)}
                        onChange={handleSubtopicChange(subtopic)}
                        size="small"
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
                      "& .MuiTypography-root": {
                        fontSize: "0.9rem",
                      }
                    }}
                  />
                )
              )}
            </FormGroup>
          ) : (
            <Typography
              sx={{
                mt: 4,
                color: "primary.contrastText",
              }}
            >
              Select a topic to view subtopics
            </Typography>
          )}
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: 'margin-right 0.3s ease-in-out',
          marginRight: isMobile ? 0 : (filterOpen ? '240px' : 0),
          marginTop: '64px',
          py: 3,
        }}
      >
        <div
          className="thumbnail-container"
          style={{
            position: "relative",
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
              {photoStream.map((photo, index) => (
                <PhotoThumbnail 
                  key={photo.id} 
                  photo={photo} 
                  index={index}
                  onPhotoSelect={() => setFilterOpen(false)}
                />
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
                width: gridWidth,
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
      </Box>
    </>
  );
};

export default GalleryView;
