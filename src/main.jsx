// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom"; // WICHTIG: BrowserRouter statt RouterProvider
import App from './App.jsx';

// MUI Imports
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Der BrowserRouter umschließt einfach nur die App. 
          Er kennt die Routen noch nicht, das macht die App. */}
      <BrowserRouter>
        <App />
      </BrowserRouter>

    </ThemeProvider>
  </StrictMode>,
);