import React, { useState } from 'react';
import { Container, Typography, Button, Stack, Snackbar, Link, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    const email = 'peterwritescode@gmail.com';
    navigator.clipboard.writeText(email);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

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
            <li>select topics and subtopics to update gallery</li>
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

        <div>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            gutterBottom
          >
            I am currently looking for a new opportunity as a Principal Front End Engineer.
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{
              fontStyle: 'italic',
              fontSize: {
                xs: '0.95rem',
                sm: '1rem'
              }
            }}
          >
            To request a resume email <Link 
              href="#" 
              onClick={handleCopyEmail}
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline'
                },
                wordBreak: 'break-all'
              }}
            >
              peterwritescode@gmail.com
            </Link>
          </Typography>
        </div>
      </Stack>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Email address copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          bottom: { xs: 16, sm: 24 }
        }}
      />
    </Container>
  );
};

export default LandingPage;
