import { useEffect } from "react";
import { Routes, Route, NavLink, useNavigate, Outlet } from "react-router-dom";

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

import HomeIcon from '@mui/icons-material/Home';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';

import Login from "./pages/Login";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import MyRentals from "./pages/MyRentals";
import Register from "./pages/Register";
import About from "./pages/About";

const DRAWER_WIDTH = 250;

const menuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Kameras', icon: <CameraAltIcon />, path: '/products' },
  { text: 'Meine Produkte', icon: <ShoppingBagIcon />, path: '/myrentals' },
  { text: 'Über uns', icon: <InfoIcon />, path: '/about' },
];

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
      
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: DRAWER_WIDTH, 
            boxSizing: 'border-box',
            bgcolor: '#111111',
            color: 'grey.500',
            borderRight: '1px solid #333'
          },
        }}
      >
        <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%', py: 2 }}>
          
          <Box sx={{ px: 3, mb: 3 ,textAlign:"center"}}>
             <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px' }}>
               VERLEIH APP</span>
          </Box>

          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 1 }}>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
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

      <Box component="main" sx={{ flexGrow: 1, p: 4, width: `calc(100% - ${DRAWER_WIDTH}px)` }}>
        <Outlet /> 
      </Box>

    </Box>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<AppLayout />}>
        
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        
        
        <Route path="/myrentals" element={<MyRentals />} /> 

        <Route path="/about" element={<About />} />
        
        <Route path="*" element={<h2>404 - Seite nicht gefunden</h2>} />
      </Route>
    </Routes>
  );
}

export default App;