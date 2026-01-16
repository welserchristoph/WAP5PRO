import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/apiService"; 

const RentalCard = ({ camera }) => {
  return (
    <div className="card">
      <img src={camera.image} alt={camera.name} className="product-image"/>
      <h3>{camera.brand} {camera.name}</h3>
      <p>{camera.description}</p>
      <p><strong>{camera.daily_rate}€ / day</strong></p>
      <p>Status: {camera.status}</p>
      <Link to={`/products/${camera._id}`}>
        <button>View Details</button>
      </Link>
    </div>
  );
};

const Cameras = () => {
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    apiRequest("/cameras")
      .then(res => res.json())
      .then(data => setCameras(data))
      .catch(err => console.error("Fehler beim Laden:", err));
  }, []);

  return (
    <div>
      <h1>All Cameras for Rent</h1>

      <div className="products-grid">
        {cameras.map((camera) => (
          <RentalCard key={camera._id} camera={camera} />
        ))}
      </div>
    </div>
  );
};

export default Cameras;