import axios from "axios"
import { FiShoppingCart, FiHeart, FiEye } from "react-icons/fi"

function ProductCard({ product, user, logEvent, onViewProduct }) {
  return (
    <div className="product-card fade-in">
      <div className="position-relative overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="card-img-top"
          style={{ height: "200px", objectFit: "cover", cursor: "pointer" }}
          onClick={() => {
            logEvent(product._id, "view")
            onViewProduct(product._id)
          }}
        />
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
                      // Create a toast-like alert
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
                // Create a toast-like alert
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
