import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"

export default function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-fill">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
