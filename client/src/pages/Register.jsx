"use client"

import { useForm } from "react-hook-form"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiUserPlus, FiShield } from "react-icons/fi"

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const [serverMsg, setServerMsg] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Registration failed")
      setServerMsg("✅ Registered successfully! Redirecting to login...")
      setTimeout(() => navigate("/login"), 1500)
    } catch (err) {
      setServerMsg(`❌ ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card card-walmart shadow-lg">
            <div className="card-header text-center py-4">
              <h2 className="mb-0 d-flex align-items-center justify-content-center">
                <FiUserPlus className="me-2" />
                Create Account
              </h2>
              <p className="text-muted mb-0 mt-2">Join Walmart+ and start saving today</p>
            </div>
            <div className="card-body p-4">
              {serverMsg && (
                <div className={`alert ${serverMsg.includes('✅') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}>
                  {serverMsg}
                  <button type="button" className="btn-close" onClick={() => setServerMsg("")}></button>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <FiUser className="me-2" />
                    Username
                  </label>
                  <input
                    type="text"
                    {...register("username", { 
                      required: "Username is required",
                      minLength: {
                        value: 3,
                        message: "Username must be at least 3 characters"
                      }
                    })}
                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                    placeholder="Choose a username"
                  />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username.message}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <FiMail className="me-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email.message}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <FiLock className="me-2" />
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password", { 
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters"
                        }
                      })}
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password.message}</div>
                    )}
                  </div>
                  <small className="text-muted">
                    Password should be at least 6 characters long
                  </small>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <FiShield className="me-2" />
                    Account Type
                  </label>
                  <select 
                    {...register("role")} 
                    className="form-select"
                  >
                    <option value="user">Customer Account</option>
                    <option value="admin">Admin Account</option>
                  </select>
                  <small className="text-muted">
                    Choose your account type
                  </small>
                </div>

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-walmart-primary btn-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>
              </form>

              <hr className="my-4" />

              <div className="text-center">
                <p className="mb-0">
                  Already have an account?{" "}
                  <Link to="/login" className="text-decoration-none fw-semibold">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Card */}
          <div className="card card-walmart mt-4">
            <div className="card-body">
              <h6 className="card-title text-center mb-3">Why Join Walmart+?</h6>
              <div className="row text-center">
                <div className="col-4">
                  <div className="text-success mb-2">🚚</div>
                  <small>Free Shipping</small>
                </div>
                <div className="col-4">
                  <div className="text-warning mb-2">⚡</div>
                  <small>Fast Delivery</small>
                </div>
                <div className="col-4">
                  <div className="text-info mb-2">💰</div>
                  <small>Best Prices</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}