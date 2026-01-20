import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#646cff', 
      light: '#747bff',
      dark: '#535bf2',
      contrastText: '#ffffff',
    },
    background: {
      default: '#242424', 
      paper: '#2f2f2f',   
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.87)',
    },
  },
  typography: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    button: {
      textTransform: 'none', 
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
    },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          border: '1px solid transparent',
          color: 'inherit',
          padding: '0.6em 1.2em',
          transition: 'border-color 0.25s',
          '&:hover': {
            backgroundColor: '#1a1a1a', 
            borderColor: '#646cff',    
          },
        },
        containedPrimary: {
          backgroundColor: '#646cff',
          '&:hover': {
            backgroundColor: '#535bf2',
            borderColor: 'transparent',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #444',
          borderRadius: '10px',
          padding: '15px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s ease-in-out',
          backgroundImage: 'none',
          backgroundColor: '#1a1a1a',
          '&:hover': {
            transform: 'scale(1.03)',
            borderColor: '#646cff',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#646cff',
          textDecoration: 'inherit',
          fontWeight: 500,
          '&:hover': {
            color: '#535bf2',
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#6b6b6b #2b2b2b",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#2b2b2b",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#6b6b6b",
            minHeight: 24,
            border: "3px solid #2b2b2b",
          },
        },
      },
    },
  },
});


export default theme;