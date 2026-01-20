import { useEffect } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";

// Layout component with sidebar
function AppLayout({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem('accessToken');
  const refresh = localStorage.getItem('refreshToken');
  
  // NUR wenn beide weg sind, schicken wir den User zum Login
  if (!token && !refresh) {
    navigate("/login");
  }
}, [navigate]);

  const handleLogout = () => {
    // 1. Tokens entfernen
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // 2. Zur Login-Seite umleiten
    navigate("/login");
  };
  return (
    <div style={{ display: "flex" }}>
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          padding: "20px",
          background: "#f0f0f0",
          minHeight: "100vh",
          width: "200px",
        }}
      >
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/products">Kameras</NavLink>
        <NavLink to="/MyRentals">Meine Produkte</NavLink>
        <NavLink to="/about">Über uns</NavLink>

        <hr style={{ width: "100%", border: "0.5px solid #ccc", marginTop: "20px" }} />
        <button 
          onClick={handleLogout}
          style={{
            padding: "10px",
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Abmelden
        </button>
      </nav>

      <div style={{ flex: 1, padding: "20px" }}>
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Login page has no sidebar */}
      <Route path="/login" element={<Login />} />

      {/* Main pages with sidebar */}
      <Route
        path="/"
        element={
          <AppLayout>
            <Home />
          </AppLayout>
        }
      />
      <Route
        path="/products"
        element={
          <AppLayout>
            <Products />
          </AppLayout>
        }
      />

      <Route
        path="/products/:id"
        element={
          <AppLayout>
            <ProductDetails />
          </AppLayout>
        }
      />
      <Route
        path="*"
        element={
          <AppLayout>
            <h2>Sorry das war wohl die falsche Adresse!</h2>
          </AppLayout>
        }
      />
    </Routes>
  );
}

export default App;
