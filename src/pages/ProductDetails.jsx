import { useParams } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();

  return (
    <div style={{ padding: 24 }}>
      <h1>Product Details</h1>
      <p>Product ID: {id}</p>
    </div>
  );
}
