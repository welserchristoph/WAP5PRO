import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

// MUI Imports
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  Container,
  Link
} from "@mui/material";

// Icons für den modernen Look
import EmailIcon from '@mui/icons-material/Email';
import HttpsIcon from '@mui/icons-material/Https';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const details = {
      'grant_type': 'password',
      'username': username,
      'password': password,
      'client_id': 'client'
    };

    const formBody = Object.keys(details)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key]))
      .join('&');

    try {
      // Backend URL prüfen (3000 oder 5000)
      const response = await fetch('http://localhost:3000/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token);
        navigate("/");
      } else {
        setError("Login fehlgeschlagen. Bitte Daten prüfen.");
      }
    } catch (err) {
      console.error(err);
      setError("Server nicht erreichbar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. Hintergrund: Dunkler Gradient für "Cinematic Look"
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        padding: 2
      }}
    >
      <Container maxWidth="xs">
        
        {/* 2. Glassmorphism Card */}
        <Paper
          elevation={24}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 4,
            // Der Glass-Effekt:
            backgroundColor: 'rgba(255, 255, 255, 0.05)', // Fast durchsichtig
            backdropFilter: 'blur(20px)',                // Verschwommener Hintergrund
            border: '1px solid rgba(255, 255, 255, 0.1)', // Subtiler Rand
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', // Weicher Schatten
          }}
        >
          {/* Header Icon mit Glow */}
          <Box
            sx={{
              mb: 2,
              p: 2,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #646cff 30%, #535bf2 90%)',
              boxShadow: '0 0 20px rgba(100, 108, 255, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <LockOpenIcon sx={{ color: 'white', fontSize: 30 }} />
          </Box>

          <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: 'white' }}>
            Willkommen zurück
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 3, color: 'rgba(255,255,255,0.7)' }}>
            Bitte melde dich an, um fortzufahren.
          </Typography>

          {error && (
            <Alert severity="error" variant="filled" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            
            {/* Custom Styled Inputs */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              placeholder="E-Mail Adresse" // Placeholder statt Label für cleaneren Look
              name="email"
              autoComplete="email"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              // Icon IM Input Feld
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  </InputAdornment>
                ),
                sx: { 
                  color: 'white',
                  borderRadius: 3,
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, // Rand entfernen
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.3)' }
                }
              }}
              variant="outlined"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              placeholder="Passwort"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HttpsIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  </InputAdornment>
                ),
                sx: { 
                  color: 'white',
                  borderRadius: 3,
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.3)' }
                }
              }}
              variant="outlined"
            />

            {/* Gradient Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 4,
                mb: 2,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                background: 'linear-gradient(45deg, #646cff 30%, #535bf2 90%)',
                boxShadow: '0 3px 5px 2px rgba(100, 108, 255, .3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(45deg, #535bf2 30%, #646cff 90%)',
                  transform: 'scale(1.02)', // Kleiner Zoom Effekt
                  boxShadow: '0 6px 12px rgba(100, 108, 255, .4)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Anmelden"}
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Noch kein Konto?{" "}
                <Link component={RouterLink} to="/register" sx={{ fontWeight: 'bold', textDecoration: 'none' }}>
                  Jetzt hier registrieren
                </Link>
              </Typography>
            </Box>

          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;