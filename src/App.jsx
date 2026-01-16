// src/App.jsx
import { Routes, Route, NavLink } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Products from "./pages/Products";

// Layout component with sidebar
function AppLayout({ children }) {
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
