import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import './styles/App.css';

/**
 * Main App Component
 * Sets up routing and context providers
 */
function App() {
  return (
    <Router>
      <CartProvider>
        <div className="App" data-testid="app">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<ProductListing />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </CartProvider>
    </Router>
  );
}

/**
 * Not Found Page
 */
function NotFound() {
  return (
    <div className="page" data-testid="not-found-page">
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}

export default App;
