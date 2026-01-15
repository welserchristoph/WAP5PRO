import { Outlet, NavLink } from "react-router-dom";

export default function App() {
  return (
    <div>
      <nav style={{ display: "flex", gap: "20px", padding: "10px", background: "#f0f0f0" }}>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/products">Kameras</NavLink>
        <NavLink to="/calendar">Kalender</NavLink>
        <NavLink to="/about">Über uns</NavLink>
      </nav>
      
      <div style={{ padding: "20px" }}>
        {/* Hier werden die Unterseiten (Home, Products, etc.) angezeigt */}
        <Outlet /> 
      </div>
    </div>
  );
}