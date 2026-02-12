import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

/**
 * Cart Page
 * Display cart items, manage quantities, and proceed to checkout
 */
const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      updateQuantity(cartItemId, newQuantity);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="page" data-testid="cart-page">
        <h2>Shopping Cart</h2>
        <div className="empty-cart" data-testid="empty-cart-message">
          <p>Your cart is empty</p>
          <Link to="/" className="continue-shopping-btn" style={{ display: 'inline-block', width: 'auto' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page" data-testid="cart-page">
      <h2>Shopping Cart</h2>

      <div className="cart-container" data-testid="cart-container">
        {/* Cart Items */}
        <div className="cart-items" data-testid="cart-items-list">
          {cartItems.map((item) => (
            <div key={item.cartItemId} className="cart-item" data-testid={`cart-item-${item.id}`}>
              <div className="cart-item-image">{item.image}</div>

              <div className="cart-item-details">
                <h4 className="cart-item-name" data-testid={`cart-item-name-${item.id}`}>
                  {item.name}
                </h4>
                <p className="cart-item-price" data-testid={`cart-item-price-${item.id}`}>
                  ${item.price.toFixed(2)} each
                </p>
              </div>

              <div className="cart-item-controls">
                <button
                  onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                  data-testid={`decrease-qty-${item.id}`}
                  className="quantity-btn"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.cartItemId, parseInt(e.target.value) || 1)
                  }
                  className="quantity-input"
                  data-testid={`qty-input-${item.id}`}
                />
                <button
                  onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
                  data-testid={`increase-qty-${item.id}`}
                  className="quantity-btn"
                >
                  +
                </button>
                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item.cartItemId)}
                  data-testid={`remove-item-${item.id}`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="cart-summary" data-testid="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal:</span>
            <span data-testid="subtotal">${cartTotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping:</span>
            <span data-testid="shipping">$10.00</span>
          </div>

          <div className="summary-row">
            <span>Tax (10%):</span>
            <span data-testid="tax">${(cartTotal * 0.1).toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Total:</span>
            <span data-testid="total-price">
              ${(cartTotal + 10 + cartTotal * 0.1).toFixed(2)}
            </span>
          </div>

          <button
            className="checkout-btn"
            onClick={() => navigate('/checkout')}
            data-testid="checkout-button"
          >
            Proceed to Checkout
          </button>

          <button
            className="continue-shopping-btn"
            onClick={() => navigate('/')}
            data-testid="continue-shopping-button"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
