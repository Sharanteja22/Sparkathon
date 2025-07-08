import React, { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { FiTrash2, FiShoppingBag, FiArrowLeft, FiPlus, FiMinus } from "react-icons/fi"

export default function Cart() {
  const { user } = useSelector((state) => state.user)
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!user) return
        setLoading(true)
        const res = await axios.get(`/api/cart/${user.id}`)
        setCartItems(res.data)
      } catch (err) {
        console.error("Error fetching cart", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCart()
  }, [user])


  const handleCheckout = async () => {
  if (!user) {
    alert("Login to continue")
    return
  }

  try {
    const sessionId = sessionStorage.getItem("sessionId") || "no-session"

    // Loop through all items and send a POST request for each purchase
    for (const item of cartItems) {
      await axios.post("/api/logs/event", {
        userId: user.id,
        productId: item.productId._id,
        eventType: "purchase",
        sessionId,
        device: "web",
      })
    }

    // Show success alert
    const alert = document.createElement("div")
    alert.className = "alert alert-success alert-dismissible fade show position-fixed"
    alert.style.cssText = "top: 20px; right: 20px; z-index: 9999; min-width: 300px;"
    alert.innerHTML = `
      <strong>✅ Purchase Logged!</strong> Proceeded to checkout.
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `
    document.body.appendChild(alert)
    setTimeout(() => alert.remove(), 3000)

    // You can also redirect to payment page here if needed
    // navigate("/payment");

  } catch (err) {
    console.error("Checkout Error:", err)
    alert("Failed to proceed to checkout")
  }
}



  const removeFromCart = async (productId) => {
    try {
      await axios.post("/api/cart/remove", {
        userId: user.id,
        productId,
      })
      setCartItems((prev) => prev.filter((item) => item.productId._id !== productId))
      
      // Success notification
      const alert = document.createElement("div")
      alert.className = "alert alert-success alert-dismissible fade show position-fixed"
      alert.style.cssText = "top: 20px; right: 20px; z-index: 9999; min-width: 300px;"
      alert.innerHTML = `
        <strong>Removed!</strong> Item removed from cart.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `
      document.body.appendChild(alert)
      setTimeout(() => alert.remove(), 3000)
    } catch (err) {
      console.error("Failed to remove item", err)
      alert("Failed to remove item from cart")
    }
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    if (!item?.productId || typeof item.productId.price !== 'number') return sum;
    return sum + item.productId.price * item.quantity;
  }, 0);
  const tax = subtotal * 0.08
  const shipping = subtotal > 500 ? 0 : 50
  const total = subtotal + tax + shipping

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
                <FiShoppingBag className="me-2 text-primary" />
                Your Cart ({cartItems.length} items)
              </h2>
            </div>
          </div>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card card-walmart text-center py-5">
              <div className="card-body">
                <FiShoppingBag size={64} className="text-muted mb-4" />
                <h3 className="card-title">Your cart is empty</h3>
                <p className="card-text text-muted mb-4">
                  Looks like you haven't added any items to your cart yet.
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
          {/* Cart Items */}
          <div className="col-lg-8 mb-4">
            <div className="card card-walmart">
              <div className="card-header">
                <h5 className="mb-0">Shopping Cart</h5>
              </div>
              <div className="card-body p-0">
                {cartItems.map((item, index) => (
                  <div key={item.productId._id} className={`p-4 ${index !== cartItems.length - 1 ? 'border-bottom' : ''}`}>
                    <div className="row align-items-center">
                      {/* Product Image */}
                      <div className="col-md-2 col-3 mb-3 mb-md-0">
                        <img
                          src={item.productId.image || "/placeholder.svg"}
                          alt={item.productId.name}
                          className="img-fluid rounded"
                          style={{ height: "80px", objectFit: "cover" }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="col-md-4 col-9 mb-3 mb-md-0">
                        <h6 className="mb-1">{item.productId.name}</h6>
                        <small className="text-muted">{item.productId.category}</small>
                        <div className="mt-2">
                          <span className="badge bg-success">In Stock</span>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="col-md-2 col-6 mb-3 mb-md-0">
                        <div className="d-flex align-items-center">
                          <span className="me-2">Qty:</span>
                          <div className="input-group input-group-sm" style={{ width: "100px" }}>
                            <button className="btn btn-outline-secondary" type="button">
                              <FiMinus size={12} />
                            </button>
                            <input
                              type="text"
                              className="form-control text-center"
                              value={item.quantity}
                              readOnly
                            />
                            <button className="btn btn-outline-secondary" type="button">
                              <FiPlus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-md-2 col-6 mb-3 mb-md-0 text-md-center">
                        <div className="product-price">₹{item.productId.actualPrice}</div>
                        <small className="text-muted">₹{item.productId.price} each</small>
                      </div>

                      {/* Remove Button */}
                      <div className="col-md-2 col-12 text-md-center">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeFromCart(item.productId._id)}
                          title="Remove from cart"
                        >
                          <FiTrash2 className="me-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card card-walmart sticky-top" style={{ top: "20px" }}>
              <div className="card-header">
                <h5 className="mb-0">Order Summary</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-success" : ""}>
                    {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total</strong>
                  <strong className="product-price">₹{total.toFixed(2)}</strong>
                </div>

                <div className="d-grid gap-2">
                  <button className="btn btn-walmart-primary btn-lg"  onClick={handleCheckout}>
                    Proceed to Checkout
                  </button>
                  <Link to="/" className="btn btn-walmart-outline">
                    Continue Shopping
                  </Link>
                </div>

                {shipping > 0 && (
                  <div className="alert alert-walmart mt-3 mb-0">
                    <small>
                      <strong>💡 Tip:</strong> Add ₹{(500 - subtotal).toFixed(2)} more to get FREE shipping!
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}