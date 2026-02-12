import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

/**
 * Navbar Component
 * Displays navigation links and cart count
 */
const Navbar = () => {
  const { itemCount } = useCart();

  return (
    <nav className="navbar" data-testid="navbar">
      <h1 data-testid="navbar-title">🛒 EcomStore</h1>
      <div className="navbar-nav">
        <Link to="/" className="navbar-link" data-testid="nav-home">
          Home
        </Link>
        <Link to="/cart" className="navbar-link" data-testid="nav-cart">
          <span className="cart-icon">
            🛒
            {itemCount > 0 && (
              <span className="cart-count" data-testid="cart-count">
                {itemCount}
              </span>
            )}
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
