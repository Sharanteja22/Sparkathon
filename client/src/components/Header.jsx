"use client"

import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../redux/userSlice"
import { FiLogOut, FiShoppingCart, FiUser, FiSettings } from "react-icons/fi"

export default function Header() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    dispatch(logout())
  }

  return (
    <header className="walmart-header py-3 px-4">
      <div className="container-fluid">
        <div className="row align-items-center">
          {/* Logo */}
          <div className="col-md-3">
            <h4 className="mb-0">
              <Link to="/" className="walmart-logo text-white text-decoration-none">
                Walmart+
              </Link>
            </h4>
          </div>

          {/* Navigation */}
          <div className="col-md-9">
            <nav className="d-flex justify-content-end">
              <ul className="d-flex gap-3 align-items-center list-unstyled m-0">
                {!user ? (
                  <>
                    <li>
                      <Link to="/login" className="btn btn-walmart-outline btn-sm">
                        <FiUser className="me-1" />
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link to="/register" className="btn btn-walmart-yellow btn-sm">
                        Register
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="text-white fw-bold d-flex align-items-center">
                      <FiUser className="me-2" />
                      Hi, {user.username}
                    </li>
                    <li>
                      <span className="badge badge-walmart rounded-pill">{user?.role?.toUpperCase()}</span>
                    </li>
                    {user.role === "admin" && (
                      <li>
                        <Link to="/admin" className="btn btn-walmart-yellow btn-sm">
                          <FiSettings className="me-1" />
                          Admin Dashboard
                        </Link>
                      </li>
                    )}
                    {user?.role === "user" && (
                      <>
                        <li>
                        <Link to="/cart" className="btn btn-walmart-outline btn-sm position-relative">
                          <FiShoppingCart size={18} />
                          {/* <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            0
                          </span> */}
                        </Link>
                      </li>
                      <li>
                        <Link to="/wishlist" className="btn btn-walmart-outline btn-sm position-relative">
                          Wishlist
                          {/* <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            0
                          </span> */}
                        </Link>
                      </li>
                      </>
                      
                    )}
                    <li>
                      <button
                        onClick={handleLogout}
                        className="btn btn-outline-light btn-sm d-flex align-items-center gap-1"
                      >
                        <FiLogOut size={16} />
                        Logout
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
