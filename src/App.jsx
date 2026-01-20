import { useEffect } from "react";
import { Routes, Route, NavLink, useNavigate, Outlet } from "react-router-dom"; // Outlet importieren!

// MUI Imports
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Button, 
  Divider,
  Toolbar,
} from '@mui/material';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';

// Pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import MyRentals from "./pages/MyRentals";
import Register from "./pages/Register";

const DRAWER_WIDTH = 250;

// Konfiguration der Menü-Punkte
const menuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Kameras', icon: <CameraAltIcon />, path: '/products' },
  { text: 'Meine Produkte', icon: <ShoppingBagIcon />, path: '/myrentals' }, // Pfad kleingeschrieben (Best Practice)
  { text: 'Über uns', icon: <InfoIcon />, path: '/about' },
];

// Layout Component (Nutzt jetzt Outlet statt children für saubereres Routing)
function AppLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');

    const publicPages = ["/login", "/register"];
    
    if (!token && !refresh && !publicPages.includes(location.pathname)) {
      navigate("/login");
    }
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate("/login");
  };

  return (
    <Box sx={{ display: 'flex' }}>
      
      {/* 1. SIDEBAR (MUI Drawer) */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: DRAWER_WIDTH, 
            boxSizing: 'border-box',
            bgcolor: '#111111', // Dein dunkler Hintergrund
            color: 'grey.500',  // Standard Textfarbe Grau
            borderRight: '1px solid #333'
          },
        }}
      >
        <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%', py: 2 }}>
          
          {/* Titel / Logo */}
          <Box sx={{ px: 3, mb: 3 }}>
             <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px' }}>
               RENTAL<span style={{ color: '#646cff' }}>APP</span>
             </span>
          </Box>

          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 1 }}>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  // Das sorgt für den "Active" Style (Blau bei Auswahl)
                  sx={{
                    minHeight: 48,
                    px: 2.5,
                    mx: 1,
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255, 0.08)',
                      color: 'white',
                      '& .MuiListItemIcon-root': { color: 'white' }
                    },
                    '&.active': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '& .MuiListItemIcon-root': { color: 'white' }
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 2,
                      justifyContent: 'center',
                      color: 'inherit'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Spacer schiebt Logout nach unten */}
          <Box sx={{ flexGrow: 1 }} />
          
          <Divider sx={{ bgcolor: '#333', my: 2, mx: 2 }} />

          <Box sx={{ px: 2, pb: 2 }}>
            <Button 
              variant="contained" 
              color="error" 
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Abmelden
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* 2. MAIN CONTENT AREA */}
      <Box component="main" sx={{ flexGrow: 1, p: 4, width: `calc(100% - ${DRAWER_WIDTH}px)` }}>
        {/* Hier werden die Kinder-Routen (Home, Products etc.) angezeigt */}
        <Outlet /> 
      </Box>

    </Box>
  );
}

function App() {
  return (
    <Routes>
      {/* Login Seite (Ohne Layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Geschützte Seiten (Mit Layout) */}
      {/* Wir wickeln das Layout UM die Routen, statt in jede Route einzeln */}
      <Route element={<AppLayout />}>
        
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} /> {/* Optional, / ist sauberer */}
        
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        
        
        <Route path="/myrentals" element={<MyRentals />} /> 

        <Route path="/about" element={<h2>Über uns (Platzhalter)</h2>} />
        
        <Route path="*" element={<h2>404 - Seite nicht gefunden</h2>} />
      </Route>
    </Routes>
  );
}

export default App;