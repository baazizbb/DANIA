import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faUser } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import logoPng from "../assets/logo.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCartMenu = () => {
    setIsCartOpen((prev) => !prev);
    setIsAvatarOpen(false);
  };

  const toggleAvatarMenu = () => {
    setIsAvatarOpen((prev) => !prev);
    setIsCartOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionsRef.current &&
        !actionsRef.current.contains(event.target as Node)
      ) {
        setIsCartOpen(false);
        setIsAvatarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path: string) =>
    location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src={logoPng} alt="MyApp Logo" className="logo-icon" />
        </div>

        <button
          className={`hamburger ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className={isActive("/")}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className={isActive("/about")}>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className={isActive("/products")}>
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className={isActive("/contact")}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header-actions" ref={actionsRef}>
          <div className="action-menu-wrap">
            <button
              type="button"
              className={`icon-button ${isCartOpen ? "open" : ""}`}
              onClick={toggleCartMenu}
              aria-label="Toggle cart menu"
              aria-expanded={isCartOpen}
              aria-controls="cart-menu"
            >
              <FontAwesomeIcon icon={faCartShopping} className="icon-svg" />
              <span className="icon-badge">2</span>
            </button>
            {isCartOpen && (
              <div id="cart-menu" className="dropdown-menu">
                <h4 className="menu-title">Cart</h4>
                <p className="menu-text">2 items in your cart</p>
                <button type="button" className="menu-button">
                  View Cart
                </button>
                <button type="button" className="menu-button primary">
                  Checkout
                </button>
              </div>
            )}
          </div>

          <div className="action-menu-wrap">
            <button
              type="button"
              className={`icon-button ${isAvatarOpen ? "open" : ""}`}
              onClick={toggleAvatarMenu}
              aria-label="Toggle account menu"
              aria-expanded={isAvatarOpen}
              aria-controls="avatar-menu"
            >
              <FontAwesomeIcon icon={faUser} className="icon-svg" />
            </button>
            {isAvatarOpen && (
              <div id="avatar-menu" className="dropdown-menu">
                <h4 className="menu-title">My Account</h4>
                <button type="button" className="menu-button">
                  Profile
                </button>
                <button type="button" className="menu-button">
                  Orders
                </button>
                <button type="button" className="menu-button">
                  Settings
                </button>
                <button type="button" className="menu-button">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
