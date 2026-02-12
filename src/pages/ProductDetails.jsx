import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { mockProducts } from '../data/mockProducts';

/**
 * ProductDetails Page
 * Display product details and allow adding to cart
 */
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Check if product is already in cart
  const isInCart = cartItems.some((item) => item.id === parseInt(id));

  // Find product by ID
  const product = mockProducts.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="page" data-testid="product-not-found">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <button className="back-btn" onClick={() => navigate('/')}>
          Back to Products
        </button>
      </div>
    );
  }

  // Handle quantity changes
  const handleQuantityChange = (e) => {
    let value = parseInt(e.target.value);
    if (value < 1) value = 1;
    if (value > product.quantity) value = product.quantity;
    setQuantity(value);
  };

  const handleIncrement = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="page" data-testid="product-details-page">
      <button className="back-btn" onClick={() => navigate('/')} data-testid="back-button">
        ← Back to Products
      </button>

      <div className="product-details" data-testid={`product-details-${product.id}`}>
        <div className="product-details-image" data-testid="product-image">
          {product.image}
        </div>

        <div className="product-details-info">
          <h1 data-testid="product-title">{product.name}</h1>
          <p className="product-category" data-testid="product-category">
            Category: {product.category}
          </p>
          <p className="product-rating" data-testid="product-rating">
            ⭐ {product.rating} / 5
          </p>
          <p className="product-details-price" data-testid="product-price">
            ${product.price.toFixed(2)}
          </p>

          <p className="product-details-description" data-testid="product-description">
            {product.description}
          </p>

          <p data-testid="stock-status">
            {product.inStock ? (
              <span style={{ color: '#27ae60', fontWeight: 'bold' }}>✓ In Stock</span>
            ) : (
              <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>✗ Out of Stock</span>
            )}
          </p>

          {/* Quantity Selector */}
          {product.inStock && (
            <>
              <div className="quantity-selector" data-testid="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <button
                  className="quantity-btn"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  data-testid="quantity-decrease"
                >
                  -
                </button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="quantity-input"
                  data-testid="quantity-input"
                />
                <button
                  className="quantity-btn"
                  onClick={handleIncrement}
                  disabled={quantity >= product.quantity}
                  data-testid="quantity-increase"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                className={`add-to-cart-large ${isInCart ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={isInCart}
                data-testid="add-to-cart-button"
              >
                {isInCart ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
            </>
          )}

          {/* Out of Stock Button */}
          {!product.inStock && (
            <button className="add-to-cart-large" disabled data-testid="out-of-stock-button">
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
