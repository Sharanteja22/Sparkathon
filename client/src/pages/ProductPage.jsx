import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";


export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch(); 
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);

        // Log product view
       
      } catch (err) {
        console.error("Failed to fetch product", err);
      }
    };

    fetchProduct();
  }, [id, user]);

  if (!product) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-72 object-cover rounded mb-4"
      />
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="text-lg text-gray-700 mb-1">₹{product.price}</p>
      <p className="text-sm text-gray-400 mb-4">{product.category}</p>
      <p className="mb-4">{product.description}</p>

      <div className="flex gap-3">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={async () => {
            if (user) {
              try {
                await axios.post("/api/cart/add", {
                  userId: user.id,        // 👈 use correct user ID field
                  productId: id,
                  quantity: 1
                });
                alert("🛒 Added to cart!");
              } catch (err) {
                console.error("Cart Add Error:", err);
                alert("Failed to add to cart");
              }
            } else {
              alert("Login to continue");
            }
          }}
        >
          Add to Cart
        </button>
        <button
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
          onClick={async () => {
            if (user) {
              await axios.post("/api/logs/event", {
                userId: user._id,
                productId: id,
                eventType: "wishlist",
                sessionId: sessionStorage.getItem("sessionId") || "no-session",
                device: "web",
              });
              alert("Added to wishlist");
            } else {
              alert("Login to continue");
            }
          }}
        >
          Wishlist
        </button>
      </div>
    </div>
  );
}
