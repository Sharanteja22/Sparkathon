import { useForm } from "react-hook-form"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { loginStart, loginSuccess, loginFailure } from "../redux/userSlice"
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi"

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [serverMsg, setServerMsg] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      dispatch(loginStart())
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Login failed")
      
      localStorage.setItem("user", JSON.stringify(result.user))
      localStorage.setItem("token", result.token)
      
      dispatch(
        loginSuccess({
          user: result.user,
          token: result.token,
        }),
      )
      setServerMsg("✅ Login successful! Redirecting...")
      setTimeout(() => navigate("/"), 1500)
    } catch (err) {
      dispatch(loginFailure(err.message))
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
                <FiUser className="me-2" />
                Welcome Back
              </h2>
              <p className="text-muted mb-0 mt-2">Sign in to your Walmart+ account</p>
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

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <FiLock className="me-2" />
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password", { 
                        required: "Password is required",
                        // minLength: {
                        //   value: 6,
                        //   message: "Password must be at least 6 characters"
                        // }
                      })}
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Enter your password"
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
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </div>
              </form>

              <hr className="my-4" />

              <div className="text-center">
                <p className="mb-0">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-decoration-none fw-semibold">
                    Create Account
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="card card-walmart mt-4">
            <div className="card-body text-center py-3">
              <small className="text-muted">
                🔒 Your information is secure and encrypted
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}