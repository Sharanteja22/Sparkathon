import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Cart from "./pages/Cart"
import Wishlist from "./pages/Whishlist"
import ProductPage from "./pages/ProductPage"
import AdminDashboard from "./pages/AdminDashboard"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { loginSuccess } from "./redux/userSlice"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!sessionStorage.getItem("sessionId")) {
      sessionStorage.setItem("sessionId", crypto.randomUUID())
    }
    const user = localStorage.getItem("user")
    const token = localStorage.getItem("token")
    if (user && token) {
      dispatch(
        loginSuccess({
          user: JSON.parse(user),
          token,
        }),
      )
    }
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  )
}

export default App
