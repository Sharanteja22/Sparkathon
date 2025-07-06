import { Link } from "react-router-dom"
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from "react-icons/fi"

export default function Footer() {
  return (
    <footer className="walmart-footer py-5">
      <div className="container">
        <div className="row">
          {/* Company Info */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="text-white mb-3">Walmart+</h5>
            <p className="text-light mb-3">
              Save Money. Live Better. Your trusted partner for all your shopping needs with quality products at
              unbeatable prices.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-light">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-light">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-light">
                <FiInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-white mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products" className="text-light text-decoration-none">
                  Products
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/cart" className="text-light text-decoration-none">
                  Cart
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/wishlist" className="text-light text-decoration-none">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="text-white mb-3">Customer Service</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">
                  Help Center
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">
                  Track Order
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">
                  Returns
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="text-white mb-3">Contact Info</h6>
            <div className="text-light">
              <div className="d-flex align-items-center mb-2">
                <FiPhone className="me-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <FiMail className="me-2" />
                <span>support@walmart.com</span>
              </div>
              <div className="d-flex align-items-start">
                <FiMapPin className="me-2 mt-1" />
                <span>
                  702 SW 8th Street
                  <br />
                  Bentonville, AR 72716
                </span>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4 border-secondary" />

        {/* Bottom Footer */}
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-light mb-0">&copy; 2024 Walmart+. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="d-flex justify-content-md-end gap-3">
              <a href="#" className="text-light text-decoration-none small">
                Privacy Policy
              </a>
              <a href="#" className="text-light text-decoration-none small">
                Terms of Service
              </a>
              <a href="#" className="text-light text-decoration-none small">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
