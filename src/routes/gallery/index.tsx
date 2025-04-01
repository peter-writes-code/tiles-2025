import React from 'react';
import { 
  AppBar,
  Toolbar,
  Container, 
  Typography, 
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectedTopicUpdated, selectSelectedTopic } from '../../features/topicsSlice';

const topics = ['animals', 'cars', 'cities', 'fruits', 'foods', 'sports'];

const GalleryView: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectedTopic = useAppSelector(selectSelectedTopic);

  const handleTopicChange = (event: SelectChangeEvent<string>) => {
    dispatch(selectedTopicUpdated(event.target.value));
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={1}
        sx={{
          backgroundColor: 'primary.main',
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            onClick={() => navigate('/')}
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              fontSize: {
                xs: '1.25rem',
                sm: '1.5rem'
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
            size={"small"}
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
      </AppBar>
      <Toolbar /> {/* Spacer */}
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
