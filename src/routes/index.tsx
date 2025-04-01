import React from 'react';
import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Tiles 2025
          </Typography>
          <Typography variant="h5" component="h2" color="text.secondary" gutterBottom>
            An Open Source Dynamic Gallery Project
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to Tiles 2025, a modern and flexible gallery solution that allows you
            to create dynamic and responsive image galleries. This project aims to provide
            a seamless experience for both developers and end-users.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/gallery')}
            sx={{ mt: 2 }}
          >
            View Gallery
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default LandingPage;