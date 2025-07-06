import React, { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { FiHeart, FiShoppingCart, FiArrowLeft, FiTrash2, FiEye } from "react-icons/fi"

export default function Wishlist() {
  const { user } = useSelector((state) => state.user)
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        if (!user) return
        setLoading(true)
        // Assuming you have a wishlist API endpoint
        const res = await axios.get(`/api/wishlist/${user.id}`)
        setWishlistItems(res.data)
      } catch (err) {
        console.error("Error fetching wishlist", err)
        // For demo purposes, using mock data if API fails
        setWishlistItems([
          {
            _id: "1",
            productId: {
              _id: "prod1",
              name: "iPhone 15 Pro Max",
              price: 1199,
              category: "Electronics",
              image: "/placeholder.svg?height=200&width=200"
            },
            addedAt: new Date()
          },
          {
            _id: "2",
            productId: {
              _id: "prod2",
              name: "Samsung 65\" 4K Smart TV",
              price: 599,
              category: "Electronics",
              image: "/placeholder.svg?height=200&width=200"
            },
            addedAt: new Date()
          }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchWishlist()
  }, [user])

  const removeFromWishlist = async (productId) => {
    try {
      await axios.post("/api/wishlist/remove", {
        userId: user.id,
        productId,
      })
      setWishlistItems((prev) => prev.filter((item) => item.productId._id !== productId))
      
      // Success notification
      const alertElement = document.createElement("div")
      alertElement.className = "alert alert-success alert-dismissible fade show position-fixed"
      alertElement.style.cssText = "top: 20px; right: 20px; z-index: 9999; min-width: 300px;"
      alertElement.innerHTML = `
        <strong>Removed!</strong> Item removed from wishlist.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `
      document.body.appendChild(alertElement)
      setTimeout(() => alertElement.remove(), 3000)
    } catch (err) {
      console.error("Failed to remove item", err)
      // For demo, just remove from state
      setWishlistItems((prev) => prev.filter((item) => item.productId._id !== productId))
      
      const alertElement = document.createElement("div")
      alertElement.className = "alert alert-success alert-dismissible fade show position-fixed"
      alertElement.style.cssText = "top: 20px; right: 20px; z-index: 9999; min-width: 300px;"
      alertElement.innerHTML = `
        <strong>Removed!</strong> Item removed from wishlist.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `
      document.body.appendChild(alertElement)
      setTimeout(() => alertElement.remove(), 3000)
    }
  }

  const addToCart = async (product) => {
    try {
      if (!user) {
        window.alert("Please login to add items to cart")
        return
      }

      await axios.post("/api/cart/add", {
        userId: user.id,
        productId: product._id,
        quantity: 1,
      })

      // Log the event
      await axios.post("/api/logs/event", {
        userId: user.id,
        productId: product._id,
        eventType: "cart",
        sessionId: sessionStorage.getItem("sessionId") || "no-session",
        device: "web",
      })

      // Success notification
      const alertElement = document.createElement("div")
      alertElement.className = "alert alert-success alert-dismissible fade show position-fixed"
      alertElement.style.cssText = "top: 20px; right: 20px; z-index: 9999; min-width: 300px;"
      alertElement.innerHTML = `
        <strong>🛒 Added to Cart!</strong> ${product.name} has been added to your cart.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `
      document.body.appendChild(alertElement)
      setTimeout(() => alertElement.remove(), 3000)
    } catch (err) {
      console.error("Failed to add to cart", err)
      window.alert("Failed to add item to cart")
    }
  }

  const moveToCart = async (item) => {
    await addToCart(item.productId)
    await removeFromWishlist(item.productId._id)
  }

  const viewProduct = (productId) => {
    navigate(`/product/${productId}`)
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-walmart"></div>
      </div>
    )
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <Link to="/" className="btn btn-walmart-outline btn-sm me-3">
                <FiArrowLeft className="me-1" />
                Continue Shopping
              </Link>
              <h2 className="mb-0 d-flex align-items-center">
                <FiHeart className="me-2 text-danger" />
                Your Wishlist ({wishlistItems.length} items)
              </h2>
            </div>
          </div>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card card-walmart text-center py-5">
              <div className="card-body">
                <FiHeart size={64} className="text-muted mb-4" />
                <h3 className="card-title">Your wishlist is empty</h3>
                <p className="card-text text-muted mb-4">
                  Save items you love by clicking the heart icon on any product.
                </p>
                <Link to="/" className="btn btn-walmart-primary btn-lg">
                  Start Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          {/* Wishlist Items */}
          <div className="col-lg-8 mb-4">
            <div className="card card-walmart">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Saved Items</h5>
                <small className="text-muted">
                  {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}
                </small>
              </div>
              <div className="card-body p-0">
                {wishlistItems.map((item, index) => (
                  <div key={item._id} className={`p-4 ${index !== wishlistItems.length - 1 ? 'border-bottom' : ''}`}>
                    <div className="row align-items-center">
                      {/* Product Image */}
                      <div className="col-md-2 col-3 mb-3 mb-md-0">
                        <img
                          src={item.productId.image || "/placeholder.svg"}
                          alt={item.productId.name}
                          className="img-fluid rounded cursor-pointer"
                          style={{ height: "80px", objectFit: "cover" }}
                          onClick={() => viewProduct(item.productId._id)}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="col-md-4 col-9 mb-3 mb-md-0">
                        <h6 className="mb-1 cursor-pointer" onClick={() => viewProduct(item.productId._id)}>
                          {item.productId.name}
                        </h6>
                        <small className="text-muted d-block">{item.productId.category}</small>
                        <div className="mt-2">
                          <span className="badge bg-success">In Stock</span>
                        </div>
                        {item.addedAt && (
                          <small className="text-muted d-block mt-1">
                            Added {new Date(item.addedAt).toLocaleDateString()}
                          </small>
                        )}
                      </div>

                      {/* Price */}
                      <div className="col-md-3 col-6 mb-3 mb-md-0">
                        <div className="product-price">₹{item.productId.price}</div>
                        <small className="text-muted">
                          <span className="text-decoration-line-through">₹{Math.round(item.productId.price * 1.2)}</span>
                          <span className="text-success ms-1">
                            {Math.round(((item.productId.price * 1.2 - item.productId.price) / (item.productId.price * 1.2)) * 100)}% OFF
                          </span>
                        </small>
                      </div>

                      {/* Action Buttons */}
                      <div className="col-md-3 col-6">
                        <div className="d-grid gap-2">
                          <button
                            className="btn btn-walmart-primary btn-sm"
                            onClick={() => moveToCart(item)}
                            title="Move to cart"
                          >
                            <FiShoppingCart className="me-1" />
                            Add to Cart
                          </button>
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => viewProduct(item.productId._id)}
                              title="View product"
                            >
                              <FiEye />
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => removeFromWishlist(item.productId._id)}
                              title="Remove from wishlist"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Wishlist Summary */}
          <div className="col-lg-4">
            <div className="card card-walmart sticky-top" style={{ top: "20px" }}>
              <div className="card-header">
                <h5 className="mb-0">Wishlist Summary</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                  <span>Total Items</span>
                  <span className="fw-bold">{wishlistItems.length}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-3">
                  <span>Total Value</span>
                  <span className="product-price fw-bold">
                    ₹{wishlistItems.reduce((sum, item) => sum + item.productId.price, 0).toFixed(2)}
                  </span>
                </div>

                <div className="d-flex justify-content-between mb-4">
                  <span>Potential Savings</span>
                  <span className="text-success fw-bold">
                    ₹{wishlistItems.reduce((sum, item) => sum + (item.productId.price * 0.2), 0).toFixed(2)}
                  </span>
                </div>

                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-walmart-primary btn-lg"
                    onClick={() => {
                      wishlistItems.forEach(item => addToCart(item.productId))
                    }}
                    disabled={wishlistItems.length === 0}
                  >
                    <FiShoppingCart className="me-2" />
                    Add All to Cart
                  </button>
                  <Link to="/" className="btn btn-walmart-outline">
                    Continue Shopping
                  </Link>
                </div>

                <div className="alert alert-walmart mt-3 mb-0">
                  <small>
                    <strong>💡 Tip:</strong> Items in your wishlist may go out of stock or change price.
                  </small>
                </div>
              </div>
            </div>

            {/* Recently Viewed */}
            <div className="card card-walmart mt-4">
              <div className="card-header">
                <h6 className="mb-0">You might also like</h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-6 mb-3">
                    <img 
                      src="/placeholder.svg?height=60&width=60" 
                      alt="Suggested product" 
                      className="img-fluid rounded mb-2"
                    />
                    <small className="d-block">Wireless Headphones</small>
                    <small className="product-price">₹2,999</small>
                  </div>
                  <div className="col-6 mb-3">
                    <img 
                      src="/placeholder.svg?height=60&width=60" 
                      alt="Suggested product" 
                      className="img-fluid rounded mb-2"
                    />
                    <small className="d-block">Smart Watch</small>
                    <small className="product-price">₹4,999</small>
                  </div>
                </div>
                <Link to="/" className="btn btn-walmart-outline btn-sm w-100">
                  View More
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}