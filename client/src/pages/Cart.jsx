import { useSelector } from "react-redux";

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.items);

  if (cartItems.length === 0) return <p className="text-center mt-5">Cart is empty</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.map((item) => (
        <div key={item._id} className="border p-4 rounded mb-2">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p>₹{item.price}</p>
        </div>
      ))}
    </div>
  );
}
