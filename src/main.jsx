import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import MyRentals from './pages/MyRentals.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';
import Login from './pages/Login.jsx';

// 1. Deine MUI Imports
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // Dein Theme File

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App ist hier dein Layout-Wrapper (Navbar etc.)
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "products/:id",
        element: <ProductDetails />,
      },
      {
        path: "myrentals",
        element: <MyRentals />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Hier wird der ThemeProvider um den Router gewickelt */}
    <ThemeProvider theme={theme}>
      {/* 3. CssBaseline sorgt für den globalen CSS Reset und Hintergrund */}
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);