import React from "react";

function ProductCard({ product, logEvent, onViewProduct }) {
  return (
    <div className="w-full max-w-sm mx-auto border p-4 rounded-lg shadow-md hover:shadow-xl transition duration-200">
    <img
      src={product.image}
      alt={product.name}
      className="w-full h-48 object-cover object-center rounded-md mb-2 cursor-pointer"
      onClick={() => {
        logEvent(product._id, "view");
        onViewProduct(product._id);
      }}
    />
        
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-600 mb-1">Price: ₹{product.price}</p>
      <p className="text-sm text-gray-400 mb-2">{product.category}</p>

      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => logEvent(product._id, "cart")}
        >
          Add to Cart
        </button>

        <button
          className="px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600"
          onClick={() => logEvent(product._id, "wishlist")}
        >
          Wishlist
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
