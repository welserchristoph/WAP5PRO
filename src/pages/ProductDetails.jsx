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
  Stack, 
  CircularProgress,
  Divider,
  Chip,
  Snackbar,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';

dayjs.extend(isBetween);

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [camera, setCamera] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [bookedRanges, setBookedRanges] = useState([]);

  const [dateRange, setDateRange] = useState([null, null]);
  
  const [bookingLoading, setBookingLoading] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    Promise.all([
      apiRequest(`/cameras/${id}`).then(res => res.json()),
      apiRequest(`/bookings/camera/${id}`).then(res => res.ok ? res.json() : [])
    ])
    .then(([cameraData, bookingsData]) => {
      setCamera(cameraData);
      
      const ranges = bookingsData.map(booking => ({
        start: dayjs(booking.startDate),
        end: dayjs(booking.endDate).subtract(1, 'day')
      }));
      setBookedRanges(ranges);
      
      setLoading(false);
    })
    .catch(err => {
      console.error("Fehler beim Laden:", err);
      setLoading(false);
    });
  }, [id]);

  const shouldDisableDate = (day) => {
    if (day.isBefore(dayjs(), 'day')) return true;
    return bookedRanges.some(range => 
      day.isBetween(range.start, range.end, 'day', '[]')
    );
  };

  const calculateTotal = () => {
    const [start, end] = dateRange;
    if (!start || !end || !camera) return 0;
    
    const diffDays = end.diff(start, 'day') + 1;
    return diffDays > 0 ? diffDays * (camera.daily_rate || 0) : 0;
  };

  const handleBooking = async () => {
    const [start, end] = dateRange;
    if (!start || !end) return;

    setBookingLoading(true);
    const totalPrice = calculateTotal();

    try {
      const payload = {
        cameraId: camera._id,
        startDate: start.toISOString(),
        endDate: end.add(1, 'day').startOf('day').toISOString(),
        totalPrice: totalPrice,
        cameraName: `${camera.brand} ${camera.name}`
      };

      const response = await apiRequest('/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setFeedback({ open: true, message: 'Buchung erfolgreich!', severity: 'success' });
        setTimeout(() => navigate('/myrentals'), 1500);
      } else {
        const errorData = await response.json();
        setFeedback({ open: true, message: errorData.error || 'Fehler bei der Buchung', severity: 'error' });
      }
    } catch (error) {
      console.error(error);
      setFeedback({ open: true, message: 'Serverfehler', severity: 'error' });
    } finally {
      setBookingLoading(false);
    }
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
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Zurück</Button>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Zurück
        </Button>

        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
          <Grid container spacing={4}>
            
            <Grid item xs={12} md={5}>
              <Box 
                component="img"
                src={camera.image || "https://via.placeholder.com/600x400"}
                alt={camera.name}
                sx={{ 
                  width: '100%', 
                  borderRadius: 2, 
                  objectFit: 'cover',
                  boxShadow: 2,
                  mb: 2
                }}
              />
              <Typography variant="h4" fontWeight="bold">
                {camera.brand} {camera.name}
              </Typography>
              
              <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 2 }}>
                  <Chip label={camera.status} color={camera.status === 'Available' ? 'success' : 'warning'} />
                  {camera.location && <Chip label={camera.location} variant="outlined" />}
              </Stack>

              <Typography color="text.secondary" paragraph>
                {camera.description || "Keine Beschreibung verfügbar."}
              </Typography>
            </Grid>

            <Grid item xs={12} md={7}>
              <Box sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                  Verfügbarkeit prüfen
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <DateRangeCalendar 
                    value={dateRange}
                    onChange={(newValue) => setDateRange(newValue)}
                    shouldDisableDate={shouldDisableDate}
                    disablePast
                    calendars={1}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Preis pro Tag</Typography>
                    <Typography variant="h6">{camera.daily_rate}€</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary">Gesamtpreis</Typography>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      {calculateTotal()}€
                    </Typography>
                  </Box>
                </Stack>

                <Button 
                  variant="contained" 
                  size="large" 
                  fullWidth 
                  disabled={!dateRange[0] || !dateRange[1] || bookingLoading}
                  onClick={handleBooking}
                  sx={{ py: 1.5, fontSize: '1.1rem' }}
                >
                  {bookingLoading ? <CircularProgress size={26} color="inherit" /> : "Jetzt kostenpflichtig leihen"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Snackbar 
            open={feedback.open} 
            autoHideDuration={4000} 
            onClose={() => setFeedback({...feedback, open: false})}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={feedback.severity} variant="filled">
            {feedback.message}
          </Alert>
        </Snackbar>

      </Container>
    </LocalizationProvider>
  );
}