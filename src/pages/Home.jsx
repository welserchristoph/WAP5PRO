import { useState, useEffect } from "react";
import { mockCameras } from "../data/MockCameras";
import { Link } from "react-router-dom";

const RentalCard = ({ camera }) => {
  return (
    <div className="card">
      <img src={camera.image} alt={camera.name} className="product-image"/>
      <h3>{camera.name}</h3>
      <p>{camera.description}</p>
      <p><strong>{camera.pricePerDay}€ / day</strong></p>
      <p>{camera.location}</p>
      
      <Link to={`/products/${camera.id}`}>
        <button>View Details</button>
      </Link>
    </div>
  );
};

const HomeCamerasPreview = () => {
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    // Simulate API call
    setCameras(mockCameras);
  }, []);

  // Show only first 3 cameras as preview
  const previewCameras = cameras.slice(0, 3);

  return (
    <div>
      <h1>Cameras for Rent</h1>

      <div className="products-grid">
        {previewCameras.map((camera) => (
          <RentalCard key={camera.id} camera={camera} />
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link to="/products">
          <button className="alle-anzeigen-btn">Alle Anzeigen</button>
        </Link>
      </div>
    </div>
  );
};

export default HomeCamerasPreview;

