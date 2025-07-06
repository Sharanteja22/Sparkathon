import { useEffect, useState } from "react"
import axios from "axios"
import ProductCard from "../components/ProductCard"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { getSessionId } from "../utils/session"
import { FiSearch, FiFilter } from "react-icons/fi"

function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await axios.get("/api/products")
        setProducts(res.data)
      } catch (err) {
        console.error("Error fetching products:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const logEvent = async (productId, eventType) => {
    try {
      if (!user || !productId || !eventType) return
      const sessionId = getSessionId()
      const payload = {
        userId: user.id,
        productId,
        eventType,
        sessionId,
        device: "web",
      }

      await axios.post("/api/logs/event", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })
    } catch (err) {
      console.error("Error logging event:", err)
    }
  }

  const onViewProduct = (productId) => {
    navigate(`/product/${productId}`)
  }

  // Get unique categories
  const categories = ["all", ...new Set(products.map((p) => p.category))]

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-walmart"></div>
      </div>
    )
  }

  return (
    <div className="container-fluid py-4">
      {/* Hero Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card card-walmart">
            <div className="card-header text-center py-4">
              <h1 className="display-6 mb-0">Welcome to Walmart+</h1>
              <p className="mb-0 opacity-75">Save Money. Live Better.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FiSearch />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FiFilter />
            </span>
            <select
              className="form-select border-start-0"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Count */}
      <div className="row mb-3">
        <div className="col-12">
          <p className="text-muted mb-0">
            Showing {filteredProducts.length} of {products.length} products
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              user={user}
              logEvent={logEvent}
              onViewProduct={onViewProduct}
            />
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <div className="alert alert-walmart">
              <h4>No products found</h4>
              <p className="mb-0">Try adjusting your search or filter criteria.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
