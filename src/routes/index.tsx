import React from 'react';
import { Container, Typography, Button, Stack, Link, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
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
      <Stack 
        spacing={{ xs: 3, sm: 4 }}
        sx={{
          maxWidth: '100%',
          wordWrap: 'break-word'
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
            Tiles 2025
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            gutterBottom
          >
            An open source react/redux dynamic gallery by Peter Gorgenyi
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            gutterBottom
          >
            A simplistic example demonstrating advanced react patterns and UI finesse
          </Typography>
          <Typography 
            variant="body1"
            color="text.secondary" 
            gutterBottom
          >
            <li>select topics and subtopics to update the gallery</li>
            <li>resize the browser to see the gallery always rendered in the most optimal layout</li>
            <li>toggle the grid preview to see that images always perfectly align with the grid</li>
          </Typography>
        </div>

        <Button 
          variant="contained" 
          size={isMobile ? "medium" : "large"}
          onClick={() => navigate('/gallery')}
          sx={{ 
            width: 'fit-content',
            px: { xs: 3, sm: 4 },
            py: { xs: 1, sm: 1.5 },
            mb: { xs: 4, sm: 6 },
            fontSize: {
              xs: '0.95rem',
              sm: '1rem'
            }
          }}
        >
          View Gallery
        </Button>

        <Link 
          href="https://github.com/peter-writes-code/tiles-2025"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          <GitHubIcon />
          <Typography>
            View source code on GitHub
          </Typography>
        </Link>
      </Stack>
    </Container>
  );
};

export default LandingPage;
