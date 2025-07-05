import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setProduct(data);

      // Log view event
      if (user) {
        await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: id,
            eventType: "view",
            userId: user.id
          })
        });
      }
    };

    fetchProduct();
  }, [id, user]);

  const logEvent = async (type) => {
    if (!user) return alert("Login required");
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: id,
        eventType: type,
        userId: user.id
      })
    });
    alert(`${type} logged`);
  };

  if (!product) return <div className="p-4">Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="card p-4">
        <img src={product.image} alt={product.name} className="w-25 mb-3" />
        <h3>{product.name}</h3>
        <p><strong>Brand:</strong> {product.brand}</p>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Actual Price:</strong> ₹{product.actualPrice}</p>
        {product.offerPrice && (
          <p><strong>Offer Price:</strong> ₹{product.offerPrice}</p>
        )}
        <p><strong>Available:</strong> {product.available ? "Yes" : "Out of Stock"}</p>
        <p><strong>Rating:</strong> {product.rating}</p>

        <div className="d-flex gap-3 mt-3">
          <button className="btn btn-primary" onClick={() => logEvent("cart")}>
            Add to Cart
          </button>
          <button className="btn btn-outline-danger" onClick={() => logEvent("wishlist")}>
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}
