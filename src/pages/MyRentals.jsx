import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/apiService";

import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Chip, 
  Button, 
  Stack, 
  Tabs, 
  Tab,
  CircularProgress,
  Divider
} from '@mui/material';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import dayjs from 'dayjs';

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
};

const BookingCard = ({ booking, isPast }) => {
  return (
    <Card sx={{ mb: 2, borderLeft: isPast ? '4px solid #777' : '4px solid #646cff' }}>
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
          
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {booking.cameraName || "Unbekanntes Produkt"}
            </Typography>
            
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1, color: 'text.secondary' }}>
              <CalendarMonthIcon fontSize="small" />
              <Typography variant="body2">
                {formatDate(booking.startDate)} — {formatDate(dayjs(booking.endDate).subtract(1, 'day'))}
              </Typography>
            </Stack>

            <Typography variant="body2" sx={{ mt: 1 }}>
              Gesamtpreis: <strong>{booking.totalPrice}€</strong>
            </Typography>
          </Box>

          <Stack alignItems={{ sm: 'flex-end' }} spacing={1}>
           
            
            <Button 
              component={Link} 
              to={`/products/${booking.cameraId}`} 
              size="small" 
              endIcon={<ArrowForwardIcon />}
            >
              Zum Produkt
            </Button>
          </Stack>

        </Stack>
      </CardContent>
    </Card>
  );
};

export default function MyRentals() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    apiRequest("/my-bookings")
      .then(res => {
        if (!res.ok) throw new Error("Fehler beim Laden");
        return res.json();
      })
      .then(data => {
        const sorted = data.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
        console.log("Geladene Buchungen:", sorted);
        setBookings(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const now = new Date();
  
  const activeBookings = bookings.filter(b => new Date(b.endDate) >= now);
  const pastBookings = bookings.filter(b => new Date(b.endDate) < now);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" textAlign="center" gutterBottom>
        Meine Ausleihen
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="rentals tabs" centered>
          <Tab label={"Aktuell"} />
          <Tab label="Historie" />
        </Tabs>
      </Box>

      <div role="tabpanel" hidden={tabIndex !== 0}>
        {tabIndex === 0 && (
          activeBookings.length > 0 ? (
            activeBookings.map(booking => (
              <BookingCard key={booking._id} booking={booking} isPast={false} />
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
              <Typography variant="h6">Keine aktiven Ausleihen.</Typography>
              <Button component={Link} to="/products" variant="contained" sx={{ mt: 2 }}>
                Jetzt Equipment leihen
              </Button>
            </Box>
          )
        )}
      </div>

      <div role="tabpanel" hidden={tabIndex !== 1}>
        {tabIndex === 1 && (
          pastBookings.length > 0 ? (
            pastBookings.map(booking => (
              <BookingCard key={booking._id} booking={booking} isPast={true} />
            ))
          ) : (
            <Typography sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
              Noch keine vergangenen Ausleihen.
            </Typography>
          )
        )}
      </div>

    </Container>
  );
}
