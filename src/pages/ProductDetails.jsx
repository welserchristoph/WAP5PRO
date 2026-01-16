import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { mockCameras } from "../data/MockCameras";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(-1)}>Back</button>
  );
}


export default function ProductDetails() {
  const { id } = useParams();

  const camera = mockCameras.find(
    (cam) => cam.id === Number(id)
  );

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!camera) {
    return <p style={{ padding: 24 }}>Camera not found</p>;
  }

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days =
      (end - start) / (1000 * 60 * 60 * 24) + 1;

    return days > 0 ? days * camera.pricePerDay : 0;
  };

  return (
    <div style={{ padding: 24, display: "flex", gap: 32 }}>
      <BackButton></BackButton>
      {/* Camera image */}
      <img
        src={camera.image}
        alt={camera.name}
        style={{ width: 350, borderRadius: 8, objectFit: "cover" }}
      />

      {/* Camera details */}
      <div>
        <h1>{camera.name}</h1>
        <p>{camera.description}</p>
        <p><strong>Location:</strong> {camera.location}</p>
        <p><strong>Price:</strong> {camera.pricePerDay}€ / day</p>

        {/* Rental calendar */}
        <div style={{ marginTop: 24 }}>
          <h3>Select rental period</h3>

          <div style={{ display: "flex", gap: 16 }}>
            <label>
              Start date
              <br />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>

            <label>
              End date
              <br />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>

          <p style={{ marginTop: 12 }}>
            <strong>Total:</strong> {calculateTotal()}€
          </p>

          <button
            disabled={!startDate || !endDate}
            style={{ marginTop: 12 }}
          >
            Rent Camera
          </button>
        </div>
      </div>
    </div>
  );
}

