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

const Cameras = () => {
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    setCameras(mockCameras);
  }, []);

  return (
    <div>
      <h1>Cameras for Rent</h1>

      <div className="products-grid">
        {cameras.map((camera) => (
          <RentalCard key={camera.id} camera={camera} />
        ))}
      </div>
    </div>
  );
};

export default Cameras;
