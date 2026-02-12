import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

/**
 * Checkout Page
 * User details form and order submission
 */
const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, placeOrder, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [paymentData, setPaymentData] = useState({
    method: 'credit-card',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    paypalEmail: '',
    bankAccount: '',
    bankCode: ''
  });
  const [errors, setErrors] = useState({});
  const [paymentErrors, setPaymentErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    const newPaymentErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }

    // Payment validation
    if (paymentData.method === 'credit-card') {
      if (!paymentData.cardName.trim()) {
        newPaymentErrors.cardName = 'Cardholder name required';
      }
      if (!/^\d{16}$/.test(paymentData.cardNumber)) {
        newPaymentErrors.cardNumber = 'Card number must be 16 digits';
      }
      if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
        newPaymentErrors.expiryDate = 'Expiry must be MM/YY';
      }
      if (!/^\d{3}$/.test(paymentData.cvv)) {
        newPaymentErrors.cvv = 'CVV must be 3 digits';
      }
    } else if (paymentData.method === 'paypal') {
      if (!paymentData.paypalEmail.trim()) {
        newPaymentErrors.paypalEmail = 'PayPal email required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentData.paypalEmail)) {
        newPaymentErrors.paypalEmail = 'Invalid email format';
      }
    } else if (paymentData.method === 'bank') {
      if (!paymentData.bankAccount.trim()) {
        newPaymentErrors.bankAccount = 'Account number required';
      }
      if (!paymentData.bankCode.trim()) {
        newPaymentErrors.bankCode = 'Bank code required';
      }
    }

    setErrors(newErrors);
    setPaymentErrors(newPaymentErrors);
    return Object.keys(newErrors).length === 0 && Object.keys(newPaymentErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle payment change
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (paymentErrors[name]) {
      setPaymentErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Place order
    const result = placeOrder(formData);

    if (result.success) {
      setOrderPlaced(true);
      setOrderId(result.orderId);

      // Redirect to products page after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  };

  // If cart is empty, redirect to home
  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="page" data-testid="checkout-page">
        <h2>Checkout</h2>
        <div className="empty-cart" data-testid="empty-cart-notice">
          <p>Your cart is empty. Please add items before checking out.</p>
          <button
            className="continue-shopping-btn"
            onClick={() => navigate('/')}
            style={{ display: 'inline-block', width: 'auto' }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="page" data-testid="checkout-success-page">
        <div className="success-message" data-testid="order-success-message">
          <h2>✓ Order Placed Successfully!</h2>
          <p data-testid="order-id">Order ID: {orderId}</p>
          <p>Thank you for your purchase. Redirecting you to the home page...</p>
        </div>
      </div>
    );
  }

  const totalWithTax = cartTotal + 10 + cartTotal * 0.1;

  return (
    <div className="page" data-testid="checkout-page">
      <h2>Checkout</h2>

      <div className="checkout-container">
        {/* Order Summary */}
        <div className="order-summary" data-testid="order-summary">
          <h3>Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item.cartItemId} className="summary-item" data-testid={`summary-item-${item.id}`}>
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-item" style={{ fontWeight: 'bold', borderTop: '2px solid #2c3e50' }}>
            <span>Total:</span>
            <span data-testid="checkout-total">${totalWithTax.toFixed(2)}</span>
          </div>
        </div>

        {/* User Details Form */}
        <form onSubmit={handleSubmit} data-testid="checkout-form">
                    {/* Payment Method Section */}
                    <div className="form-group">
                      <label>Payment Method *</label>
                      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <label>
                          <input
                            type="radio"
                            name="method"
                            value="credit-card"
                            checked={paymentData.method === 'credit-card'}
                            onChange={handlePaymentChange}
                            data-testid="payment-credit-card"
                          /> Credit Card
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="method"
                            value="paypal"
                            checked={paymentData.method === 'paypal'}
                            onChange={handlePaymentChange}
                            data-testid="payment-paypal"
                          /> PayPal
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="method"
                            value="bank"
                            checked={paymentData.method === 'bank'}
                            onChange={handlePaymentChange}
                            data-testid="payment-bank"
                          /> Bank Transfer
                        </label>
                      </div>
                    </div>

                    {/* Payment Details Fields */}
                    {paymentData.method === 'credit-card' && (
                      <>
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="cardName">Cardholder Name *</label>
                            <input
                              id="cardName"
                              type="text"
                              name="cardName"
                              value={paymentData.cardName}
                              onChange={handlePaymentChange}
                              className={paymentErrors.cardName ? 'error' : ''}
                              data-testid="card-name-input"
                            />
                            {paymentErrors.cardName && (
                              <span className="error-message" data-testid="error-cardName">
                                {paymentErrors.cardName}
                              </span>
                            )}
                          </div>
                          <div className="form-group">
                            <label htmlFor="cardNumber">Card Number *</label>
                            <input
                              id="cardNumber"
                              type="text"
                              name="cardNumber"
                              value={paymentData.cardNumber}
                              onChange={handlePaymentChange}
                              className={paymentErrors.cardNumber ? 'error' : ''}
                              data-testid="card-number-input"
                              maxLength={16}
                            />
                            {paymentErrors.cardNumber && (
                              <span className="error-message" data-testid="error-cardNumber">
                                {paymentErrors.cardNumber}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="expiryDate">Expiry (MM/YY) *</label>
                            <input
                              id="expiryDate"
                              type="text"
                              name="expiryDate"
                              value={paymentData.expiryDate}
                              onChange={handlePaymentChange}
                              className={paymentErrors.expiryDate ? 'error' : ''}
                              data-testid="expiry-date-input"
                              maxLength={5}
                            />
                            {paymentErrors.expiryDate && (
                              <span className="error-message" data-testid="error-expiryDate">
                                {paymentErrors.expiryDate}
                              </span>
                            )}
                          </div>
                          <div className="form-group">
                            <label htmlFor="cvv">CVV *</label>
                            <input
                              id="cvv"
                              type="text"
                              name="cvv"
                              value={paymentData.cvv}
                              onChange={handlePaymentChange}
                              className={paymentErrors.cvv ? 'error' : ''}
                              data-testid="cvv-input"
                              maxLength={3}
                            />
                            {paymentErrors.cvv && (
                              <span className="error-message" data-testid="error-cvv">
                                {paymentErrors.cvv}
                              </span>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                    {paymentData.method === 'paypal' && (
                      <div className="form-group">
                        <label htmlFor="paypalEmail">PayPal Email *</label>
                        <input
                          id="paypalEmail"
                          type="email"
                          name="paypalEmail"
                          value={paymentData.paypalEmail}
                          onChange={handlePaymentChange}
                          className={paymentErrors.paypalEmail ? 'error' : ''}
                          data-testid="paypal-email-input"
                        />
                        {paymentErrors.paypalEmail && (
                          <span className="error-message" data-testid="error-paypalEmail">
                            {paymentErrors.paypalEmail}
                          </span>
                        )}
                      </div>
                    )}
                    {paymentData.method === 'bank' && (
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="bankAccount">Account Number *</label>
                          <input
                            id="bankAccount"
                            type="text"
                            name="bankAccount"
                            value={paymentData.bankAccount}
                            onChange={handlePaymentChange}
                            className={paymentErrors.bankAccount ? 'error' : ''}
                            data-testid="bank-account-input"
                          />
                          {paymentErrors.bankAccount && (
                            <span className="error-message" data-testid="error-bankAccount">
                              {paymentErrors.bankAccount}
                            </span>
                          )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="bankCode">Bank Code *</label>
                          <input
                            id="bankCode"
                            type="text"
                            name="bankCode"
                            value={paymentData.bankCode}
                            onChange={handlePaymentChange}
                            className={paymentErrors.bankCode ? 'error' : ''}
                            data-testid="bank-code-input"
                          />
                          {paymentErrors.bankCode && (
                            <span className="error-message" data-testid="error-bankCode">
                              {paymentErrors.bankCode}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
                data-testid="first-name-input"
              />
              {errors.firstName && (
                <span className="error-message" data-testid="error-firstName">
                  {errors.firstName}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
                data-testid="last-name-input"
              />
              {errors.lastName && (
                <span className="error-message" data-testid="error-lastName">
                  {errors.lastName}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              data-testid="email-input"
            />
            {errors.email && (
              <span className="error-message" data-testid="error-email">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
              data-testid="address-input"
            />
            {errors.address && (
              <span className="error-message" data-testid="error-address">
                {errors.address}
              </span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                id="city"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={errors.city ? 'error' : ''}
                data-testid="city-input"
              />
              {errors.city && (
                <span className="error-message" data-testid="error-city">
                  {errors.city}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="postalCode">Postal Code *</label>
              <input
                id="postalCode"
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className={errors.postalCode ? 'error' : ''}
                data-testid="postal-code-input"
              />
              {errors.postalCode && (
                <span className="error-message" data-testid="error-postalCode">
                  {errors.postalCode}
                </span>
              )}
            </div>
          </div>

          <button type="submit" className="submit-order-btn" data-testid="submit-order-button">
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
