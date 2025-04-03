import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from './hooks';
import { selectGridWidth, updateGridWidth } from './features/gridSlice';

import LandingPage from './routes';
import GalleryView from './routes/gallery';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentGridWidth = useAppSelector(selectGridWidth);

  useEffect(() => {
    // Initial grid setup
    if (currentGridWidth !== window.innerWidth) {
      dispatch(updateGridWidth(window.innerWidth));
    }

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (currentGridWidth !== window.innerWidth) {
          dispatch(updateGridWidth(window.innerWidth));
        }
      }, 360);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [dispatch, currentGridWidth]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/gallery" element={<GalleryView />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
