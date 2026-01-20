import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/apiService";
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  TextField, 
  Stack, 
  CircularProgress,
  Divider,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [camera, setCamera] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!id) return;

    apiRequest(`/cameras/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Kamera nicht gefunden");
        return res.json();
      })
      .then(data => {
        setCamera(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fehler:", err);
        setLoading(false);
      });
  }, [id]);

  const calculateTotal = () => {
    if (!startDate || !endDate || !camera) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 weil der erste Tag auch zählt

    if (start > end) return 0;

    const price = camera.daily_rate || camera.pricePerDay || 0;
    
    return diffDays * price;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!camera) {
    return (
      <Container sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h5">Kamera nicht gefunden.</Typography>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Zurück
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Zurück
      </Button>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={4}>
          
          <Grid item xs={12} md={6}>
            <Box 
              component="img"
              src={camera.image || "https://via.placeholder.com/600x400"}
              alt={camera.name}
              sx={{ 
                width: '100%', 
                borderRadius: 2, 
                objectFit: 'cover',
                maxHeight: '400px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              {camera.brand} {camera.name}
            </Typography>
            
            <Stack direction="row" spacing={1} mb={2}>
                <Chip label={camera.status} color={camera.status === 'Available' ? 'success' : 'warning'} />
                {camera.location && <Chip label={camera.location} variant="outlined" />}
            </Stack>

            <Typography variant="body1" paragraph color="text.secondary" sx={{ minHeight: '80px' }}>
              {camera.description || "Keine Beschreibung verfügbar."}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ bgcolor: 'background.default', p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Mietzeitraum wählen
              </Typography>
              
              <Typography variant="h4" color="primary" fontWeight="bold" sx={{ mb: 3 }}>
                {camera.daily_rate}€ <Typography component="span" variant="body1">/ Tag</Typography>
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <TextField
                  label="Von"
                  type="date"
                  fullWidth
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Bis"
                  type="date"
                  fullWidth
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body1">Gesamtpreis:</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {calculateTotal()}€
                </Typography>
              </Box>

              <Button 
                variant="contained" 
                size="large" 
                fullWidth 
                disabled={!startDate || !endDate || calculateTotal() <= 0}
                onClick={() => alert(`Gebucht für ${calculateTotal()}€!`)}
              >
                Jetzt kostenpflichtig leihen
              </Button>
            </Box>

          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}