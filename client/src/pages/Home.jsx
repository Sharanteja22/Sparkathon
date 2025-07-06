import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getSessionId } from "../utils/session";

function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
//   useEffect(() => {
//   console.log("🧠 Current Redux User:", user);
// }, [user]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const logEvent = async (productId, eventType) => {
    try {
      if (!user || !productId || !eventType) return;

      const sessionId = getSessionId();
      const payload = {
        userId: user.id,
        productId,
        eventType,
        sessionId,
        device: "web"
      };

      

      await axios.post("/api/logs/event", payload,{
  headers: {
    "Content-Type": "application/json"
  }}
);

    } catch (err) {
      console.error("Error logging event:", err);
    }
  };

  const onViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div className="w-full">

      {products.map((product) => (
        <ProductCard
        key={product._id}
        product={product}
        logEvent={logEvent}
        onViewProduct={onViewProduct}
        />
      ))}
      </div>
    </div>
  );
}

export default Home;
