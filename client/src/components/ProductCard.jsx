"use client"
import axios from "axios"
import { FiShoppingCart, FiHeart, FiEye } from "react-icons/fi"
import { useState } from "react"

function ProductCard({ product, user, logEvent, onViewProduct }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  // Fallback image handler
  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  // Generate a placeholder based on product category and name
  const getPlaceholderImage = () => {
    const category = product.category?.toLowerCase() || "product"
    const colors = {
      electronics: "bg-blue-100",
      clothing: "bg-purple-100",
      footwear: "bg-green-100",
      bags: "bg-yellow-100",
      accessories: "bg-pink-100",
      "home decor": "bg-orange-100",
    }

    const bgColor = colors[category] || "bg-gray-100"

    return (
      <div
        className={`${bgColor} d-flex align-items-center justify-content-center`}
        style={{ height: "200px", width: "100%" }}
      >
        <div className="text-center p-3">
          <div className="fs-1 mb-2">
            {category === "electronics" && "📱"}
            {category === "clothing" && "👕"}
            {category === "footwear" && "👟"}
            {category === "bags" && "🎒"}
            {category === "accessories" && "💧"}
            {category === "home decor" && "💡"}
            {!["electronics", "clothing", "footwear", "bags", "accessories", "home decor"].includes(category) && "🛍️"}
          </div>
          <small className="text-muted fw-bold">{product.name}</small>
        </div>
      </div>
    )
  }

  return (
    <div className="product-card fade-in">
      <div className="position-relative overflow-hidden">
        {imageError ? (
          getPlaceholderImage()
        ) : (
          <>
            {imageLoading && (
              <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: "200px" }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className={`card-img-top ${imageLoading ? "d-none" : ""}`}
              style={{ height: "200px", objectFit: "cover", cursor: "pointer" }}
              onError={handleImageError}
              onLoad={handleImageLoad}
              onClick={() => {
                logEvent(product._id, "view")
                onViewProduct(product._id)
              }}
            />
          </>
        )}

        <div className="position-absolute top-0 end-0 p-2">
          <button
            className="btn btn-light btn-sm rounded-circle shadow-sm"
            onClick={() => {
              logEvent(product._id, "view")
              onViewProduct(product._id)
            }}
            title="Quick View"
          >
            <FiEye size={14} />
          </button>
        </div>
      </div>

      <div className="card-body p-3">
        <h5 className="card-title text-truncate mb-2" title={product.name}>
          {product.name}
        </h5>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="product-price">₹{product.price}</span>
          <span className="product-category">{product.category}</span>
        </div>

        <div className="d-grid gap-2">
          <div className="btn-group" role="group">
            <button
              className="btn btn-add-cart btn-sm flex-fill"
              onClick={() => {
                if (user) {
                  logEvent(product._id, "cart")
                  axios
                    .post("/api/cart/add", {
                      userId: user.id,
                      productId: product._id,
                      quantity: 1,
                    })
                    .then(() => {
                      const alert = document.createElement("div")
                      alert.className = "alert alert-success alert-dismissible fade show position-fixed"
                      alert.style.cssText = "top: 20px; right: 20px; z-index: 9999; min-width: 300px;"
                      alert.innerHTML = `
                      <strong>Success!</strong> Added to cart!
                      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    `
                      document.body.appendChild(alert)
                      setTimeout(() => alert.remove(), 3000)
                    })
                    .catch((err) => {
                      console.error("Add to cart failed:", err)
                      alert("Failed to add to cart")
                    })
                } else {
                  alert("Please login first")
                }
              }}
              title="Add to Cart"
            >
              <FiShoppingCart className="me-1" size={14} />
              Cart
            </button>

            <button
              className="btn btn-wishlist btn-sm"
              onClick={() => {
                if (logEvent) logEvent(product._id, "wishlist")
                const alert = document.createElement("div")
                alert.className = "alert alert-info alert-dismissible fade show position-fixed"
                alert.style.cssText = "top: 20px; right: 20px; z-index: 9999; min-width: 300px;"
                alert.innerHTML = `
                  <strong>Added!</strong> Item added to wishlist!
                  <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                `
                document.body.appendChild(alert)
                setTimeout(() => alert.remove(), 3000)
              }}
              title="Add to Wishlist"
            >
              <FiHeart size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
