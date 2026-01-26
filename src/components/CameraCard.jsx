// src/components/CameraCard.jsx
import React from 'react';
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Chip, 
  Box, 
  Stack 
} from '@mui/material';

const CameraCard = ({ camera }) => {
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      // Styles kommen aus theme.js
    }}>
      <CardMedia
        component="img"
        height="200"
        image={camera.image} 
        alt={camera.name}
        sx={{ objectFit: 'cover' }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="start" spacing={1} mb={1}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
            {camera.name}
          </Typography>
          <Typography variant="h6" color="primary.main" sx={{ whiteSpace: 'nowrap' }}>
            {camera.daily_rate}€
          </Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {camera.description}
        </Typography>
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Button 
          component={Link} 
          to={`/products/${camera._id}`} 
          variant="contained" 
          fullWidth
        >
          Details ansehen
        </Button>
      </Box>
    </Card>
  );
};

export default CameraCard;