// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/apiService";
import CameraCard from "../components/CameraCard";

import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Stack 
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Home = () => {
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
   apiRequest("/cameras")
      .then(res => res.json())
      .then(data => setCameras(data))
      .catch(err => console.error(err));
  }, []);

  const previewCameras = cameras.slice(0, 3);

  return (
    <Box>
      <Box sx={{ 
        textAlign: 'center', 
        py: 8, 
        backgroundColor: 'background.paper',
        mb: 6 
      }}>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Professionelles Equipment leihen.
          </Typography>
          <Typography variant="h5" color="text.secondary" >
            Finde die perfekte Kamera für dein nächstes Projekt.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            component={Link} 
            to="/products"
            sx={{ mt: 2 }}
          >
            Kamera leihen
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
          Neueste Zugänge
        </Typography>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: 3 
        }}>
          {previewCameras.map((camera) => (
            <CameraCard key={camera._id} camera={camera} />
          ))}
        </Box>

        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Button 
            component={Link} 
            to="/products" 
            variant="outlined" 
            size="large"
            endIcon={<ArrowForwardIcon />} 
          >
            Alle Kameras anzeigen
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;