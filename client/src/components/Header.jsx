// src/components/Header.jsx
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { FiLogOut } from "react-icons/fi";

export default function Header() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
  };

  return (
    <header className="bg-dark text-white py-3 px-4 d-flex justify-content-between align-items-center">
      <h4>
        <Link to="/" className="text-white text-decoration-none">Walmart+</Link>
      </h4>

      <nav>
        <ul className="d-flex gap-3 align-items-center list-unstyled m-0">
          {!user ? (
            <>
              <li><Link to="/login" className="text-white">Login</Link></li>
              <li><Link to="/register" className="text-white">Register</Link></li>
            </>
          ) : (
            <>
              <li className="text-white fw-bold">Hi, {user.username}</li>

              {user.role === "admin" && (
                <li>
                  <Link to="/admin" className="btn btn-warning btn-sm">Admin Dashboard</Link>
                </li>
              )}

              <li>
                <button onClick={handleLogout} className="btn btn-sm btn-outline-light d-flex align-items-center gap-1">
                  <FiLogOut size={16} />
                  Logout
                </button>
              </li>
            </>
          )}
          <li><Link to="/cart" className="text-white">🛒</Link></li>
        </ul>
      </nav>
    </header>
  );
}
