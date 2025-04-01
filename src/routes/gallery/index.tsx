import React, { useState } from 'react';
import { 
  AppBar,
  Toolbar,
  Container, 
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectedTopicUpdated, selectSelectedTopic, selectSelectedSubtopics, subtopicToggled } from '../../features/topicsSlice';
import { Topic, topics, topicsMap } from '../../types/topics';

const GalleryView: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectedTopic = useAppSelector(selectSelectedTopic);
  const selectedSubtopics = useAppSelector(selectSelectedSubtopics);
  const [filterOpen, setFilterOpen] = useState(false);

  const handleTopicChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setFilterOpen(true);
    if (value === '' || topics.includes(value as Topic)) {
      dispatch(selectedTopicUpdated(value as Topic | ''));
    }
  };

  const handleSubtopicChange = (subtopic: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(subtopicToggled(subtopic));
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={filterOpen ? 0 : 1}
        sx={{
          backgroundColor: 'primary.main',
        }}
      >
        <Toolbar
          sx={{
            py: { xs: 1, sm: 1 }, // Reduced desktop padding from 2 to 1
          }}
        >
          <Typography
            variant="h6"
            component="div"
            onClick={() => navigate('/')}
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              fontSize: {
                xs: '1.25rem',
                sm: '1.25rem'  // Reduced from 1.5rem to 1.25rem
              },
              color: 'primary.contrastText',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            Tiles
          </Typography>
          <FormControl 
            size="small"  // Changed to always be small
            sx={{ 
              minWidth: { xs: 120, sm: 200 },
              '& .MuiInputLabel-root': {
                color: 'primary.contrastText',
                opacity: 0.7,
                '&.Mui-focused': {
                  color: 'primary.contrastText',
                  opacity: 1
                }
              },
              '& .MuiOutlinedInput-root': {
                color: 'primary.contrastText',
                textTransform: 'capitalize',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.7)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.contrastText',
                }
              },
              '& .MuiSelect-icon': {
                color: 'primary.contrastText'
              }
            }}
          >
            <InputLabel id="topic-select-label">Topic</InputLabel>
            <Select
              labelId="topic-select-label"
              id="topic-select"
              value={selectedTopic}
              label="Topic"
              onChange={handleTopicChange}
              onClick={() => setFilterOpen(true)} // Add this line
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: 'primary.main',
                    '& .MuiMenuItem-root': {
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'primary.dark',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        }
                      }
                    }
                  }
                }
              }}
            >
              {topics.map((topic) => (
                <MenuItem 
                  key={topic} 
                  value={topic}
                  sx={{
                    textTransform: 'capitalize'
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
              backgroundColor: 'primary.dark',
              color: 'primary.contrastText',
              py: 1,
              px: 2,
              borderTop: '1px solid',
              borderColor: 'primary.light',
              position: 'relative', // Add position relative for absolute positioning of close button
            }}
          >
            <IconButton
              onClick={() => setFilterOpen(false)}
              size="small"
              sx={{
                color: 'primary.contrastText',
                position: 'absolute',
                top: 8,
                right: 8,
                '&:hover': {
                  backgroundColor: 'primary.light',
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            {selectedTopic ? (
              <FormGroup
                sx={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 1,
                  pr: 4, // Add right padding to prevent overlap with close button
                }}
              >
                {topicsMap[selectedTopic].map((subtopic) => (
                  <FormControlLabel
                    key={subtopic}
                    control={
                      <Checkbox
                        checked={selectedSubtopics.includes(subtopic)}
                        onChange={handleSubtopicChange(subtopic)}
                        sx={{
                          color: 'primary.contrastText',
                          '&.Mui-checked': {
                            color: 'primary.contrastText',
                          },
                        }}
                      />
                    }
                    label={capitalizeFirstLetter(subtopic)}
                    sx={{
                      color: 'primary.contrastText',
                      minWidth: 'fit-content',
                    }}
                  />
                ))}
              </FormGroup>
            ) : (
              <Typography>
                No subtopics available - please select a topic first
              </Typography>
            )}
          </Box>
        </Collapse>
      </AppBar>
      <Toolbar /> {/* Spacer */}
      {filterOpen && <Toolbar />} {/* Additional spacer when filter is open */}
      <Container 
        maxWidth="md" 
        sx={{ 
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 3, md: 4 },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <div>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              mb: 2,
              fontSize: {
                xs: '2.5rem',
                sm: '3.25rem',
                md: '3.75rem'
              },
              lineHeight: {
                xs: 1.2,
                sm: 1.3
              }
            }}
          >
            Gallery View
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            gutterBottom
            sx={{ 
              mb: { xs: 3, sm: 4 },
              fontSize: {
                xs: '1.25rem',
                sm: '1.5rem'
              },
              lineHeight: 1.4
            }}
          >
            {selectedTopic 
              ? `The selected topic is ${selectedTopic}`
              : 'No topic selected.'
            }
          </Typography>
        </div>
      </Container>
    </>
  );
};

export default GalleryView;
