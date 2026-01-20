import { useState, useEffect } from "react";
import { apiRequest } from "../services/apiService"; 

import CameraCard from "../components/CameraCard";

import { 
  Box, 
  Container, 
  Typography, 
  CircularProgress 
} from '@mui/material';

const Products = () => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/cameras")
      .then(res => res.json())
      .then(data => {
        setCameras(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fehler beim Laden:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        All Cameras for Rent
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: 3 
      }}>
        
        {loading ? (
           <Box sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
           </Box>
        ) : cameras.length > 0 ? (
           cameras.map((camera) => (
             <CameraCard key={camera._id} camera={camera} />
           ))
        ) : (
           <Typography sx={{ gridColumn: '1 / -1' }}>
             Keine Kameras gefunden.
           </Typography>
        )}

      </Box>
    </Container>
  );
};

export default Products;