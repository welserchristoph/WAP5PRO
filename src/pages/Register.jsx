import React, { useState } from 'react';
import { 
  Box, TextField, Button, Typography, Paper, Container, Stepper, Step, StepLabel 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  
  const [formData, setFormData] = useState({
    email: '',
    token: '',
    first_name: '',
    last_name: '',
    password: ''
  });

  const steps = ['E-Mail verifizieren', 'Account aktivieren'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const [errorMsg, setErrorMsg] = useState("");

  const handleRegisterEmail = async () => {
    setErrorMsg(""); 
    try {
      const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      if (res.ok) {
        setActiveStep(1); 
      } else {
        const errorData = await res.json().catch(() => null);
        const message = errorData?.error || "Fehler beim Senden des Codes.";
        setErrorMsg(message);
      }
    } catch (err) {
      setErrorMsg("Server nicht erreichbar.");
    }
  };

  const handleActivate = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/register/${formData.token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          password: formData.password
        })
      });
      if (res.ok) {
        alert("Erfolg! Du wirst zum Login weitergeleitet.");
        navigate('/login');
      } else {
        alert("Aktivierung fehlgeschlagen.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center">Registrierung</Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        {activeStep === 0 ? (
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
              label="E-Mail Adresse" 
              name="email"
              value={formData.email}
              onChange={(e) => { setErrorMsg(""); handleChange(e); }} 
              fullWidth
              error={!!errorMsg}        
              helperText={errorMsg}     
            />
            <Button variant="contained" onClick={handleRegisterEmail}>Code anfordern</Button>
          </Box>
        ) : (
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
              label="Aktivierungs-Code (aus Terminal)" 
              name="token"
              value={formData.token}
              onChange={handleChange}
              fullWidth
            />
            <TextField label="Vorname" name="first_name" onChange={handleChange} fullWidth />
            <TextField label="Nachname" name="last_name" onChange={handleChange} fullWidth />
            <TextField label="Passwort" type="password" name="password" onChange={handleChange} fullWidth />
            <Button variant="contained" color="success" onClick={handleActivate}>Account aktivieren</Button>
            <Button variant="text" onClick={() => setActiveStep(0)}>Zurück</Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Register;