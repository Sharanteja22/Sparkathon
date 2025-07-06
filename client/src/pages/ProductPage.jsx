
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { FiShoppingCart, FiHeart, FiArrowLeft, FiStar } from "react-icons/fi"
import { Link } from "react-router-dom"

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`/api/products/${id}`)
        setProduct(res.data)
      } catch (err) {
        console.error("Failed to fetch product", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id, user])

  const handleAddToCart = async () => {
    if (user) {
      try {
        await axios.post("/api/cart/add", {
          userId: user.id,
          productId: id,
          quantity: 1,
        })
        await axios.post("/api/logs/event", {
          userId: user.id,
          productId: id,
          eventType: "cart",
          sessionId: sessionStorage.getItem("sessionId") || "no-session",
          device: "web",
        })

        // Success notification
        const alert = document.createElement("div")
        alert.className = "alert alert-success alert-dismissible fade show position-fixed"
        alert.style.cssText = "top: 20px; right: 20px; z-index: 9999; min-width: 300px;"
        alert.innerHTML = `
          <strong>🛒 Success!</strong> Added to cart!
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `
        document.body.appendChild(alert)
        setTimeout(() => alert.remove(), 3000)
      } catch (err) {
        console.error("Cart Add Error:", err)
        alert("Failed to add to cart")
      }
    } else {
      alert("Login to continue")
    }
  }

  const handleAddToWishlist = async () => {
    if (user) {
      await axios.post("/api/logs/event", {
        userId: user._id,
        productId: id,
        eventType: "wishlist",
        sessionId: sessionStorage.getItem("sessionId") || "no-session",
        device: "web",
      })

      // Success notification
      const alert = document.createElement("div")
      alert.className = "alert alert-info alert-dismissible fade show position-fixed"
      alert.style.cssText = "top: 20px; right: 20px; z-index: 9999; min-width: 300px;"
      alert.innerHTML = `
        <strong>💝 Added!</strong> Item added to wishlist!
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `
      document.body.appendChild(alert)
      setTimeout(() => alert.remove(), 3000)
    } else {
      alert("Login to continue")
    }
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-walmart"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <h4>Product not found</h4>
          <Link to="/" className="btn btn-walmart-primary">
            <FiArrowLeft className="me-2" />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">
              Home
            </Link>
          </li>
          <li className="breadcrumb-item">
            <span className="text-muted">{product.category}</span>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="row">
        {/* Product Image */}
        <div className="col-md-6 mb-4">
          <div className="card card-walmart">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="card-img-top"
              style={{ height: "400px", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <div className="card card-walmart h-100">
            <div className="card-body p-4">
              {/* Category Badge */}
              <span className="product-category mb-3 d-inline-block">{product.category}</span>

              {/* Product Name */}
              <h1 className="card-title h2 mb-3">{product.name}</h1>

              {/* Rating (Mock) */}
              <div className="d-flex align-items-center mb-3">
                <div className="text-warning me-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className={i < 4 ? "text-warning" : "text-muted"} />
                  ))}
                </div>
                <span className="text-muted">(4.0) • 128 reviews</span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="product-price display-6">₹{product.price}</span>
                <span className="text-muted text-decoration-line-through ms-2">₹{Math.round(product.price * 1.2)}</span>
                <span className="badge bg-success ms-2">
                  {Math.round(((product.price * 1.2 - product.price) / (product.price * 1.2)) * 100)}% OFF
                </span>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h5>Description</h5>
                <p className="text-muted">
                  {product.description ||
                    "High-quality product with excellent features and great value for money. Perfect for everyday use with premium materials and craftsmanship."}
                </p>
              </div>

              {/* Features */}
              <div className="mb-4">
                <h6>Key Features:</h6>
                <ul className="list-unstyled">
                  <li className="mb-1">✓ Premium Quality</li>
                  <li className="mb-1">✓ Fast Delivery</li>
                  <li className="mb-1">✓ 30-Day Return Policy</li>
                  <li className="mb-1">✓ 1 Year Warranty</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-2 d-md-flex">
                <button className="btn btn-walmart-primary btn-lg flex-fill" onClick={handleAddToCart}>
                  <FiShoppingCart className="me-2" />
                  Add to Cart
                </button>
                <button className="btn btn-walmart-outline btn-lg" onClick={handleAddToWishlist}>
                  <FiHeart className="me-2" />
                  Wishlist
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-4 p-3 bg-light rounded">
                <div className="row text-center">
                  <div className="col-4">
                    <small className="text-muted d-block">Free Shipping</small>
                    <strong>On orders ₹500+</strong>
                  </div>
                  <div className="col-4">
                    <small className="text-muted d-block">Easy Returns</small>
                    <strong>30 Days</strong>
                  </div>
                  <div className="col-4">
                    <small className="text-muted d-block">Support</small>
                    <strong>24/7 Help</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
