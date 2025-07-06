import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Cart() {
  const { user } = useSelector((state) => state.user);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!user) return;
        const res = await axios.get(`/api/cart/${user.id}`);
        setCartItems(res.data);
      } catch (err) {
        console.error("Error fetching cart", err);
      }
    };

    fetchCart();
  }, [user]);

  const removeFromCart = async (productId) => {
    try {
      await axios.post("/api/cart/remove", {
        userId: user.id,
        productId
      });
      setCartItems(prev => prev.filter(item => item.productId._id !== productId));
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">🛒 Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item.productId._id} className="border p-3 rounded mb-3 flex items-center justify-between">
            <div>
              <p className="font-semibold">{item.productId.name}</p>
              <p>₹{item.productId.price}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded"
              onClick={() => removeFromCart(item.productId._id)}
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}
