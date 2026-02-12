import React, { createContext, useState, useCallback } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);

  // Add to cart or increase quantity if already exists
  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { ...product, quantity, cartItemId: Date.now() }];
    });
  }, []);

  // Remove from cart
  const removeFromCart = useCallback((cartItemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cartItemId !== cartItemId)
    );
  }, []);

  // Update quantity
  const updateQuantity = useCallback((cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Calculate totals
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  );

  const itemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  // Place order
  const placeOrder = useCallback((userDetails) => {
    if (cartItems.length === 0) {
      return { success: false, message: 'Cart is empty' };
    }

    const order = {
      orderId: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      items: cartItems,
      total: cartTotal,
      userDetails: {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
        address: userDetails.address,
        city: userDetails.city,
        postalCode: userDetails.postalCode
      },
      status: 'pending'
    };

    setOrders((prevOrders) => [...prevOrders, order]);
    clearCart();

    return {
      success: true,
      message: 'Order placed successfully',
      orderId: order.orderId
    };
  }, [cartItems, cartTotal, clearCart]);

  // Get order history
  const getOrders = useCallback(() => {
    return orders;
  }, [orders]);

  const value = {
    cartItems,
    cartTotal,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    placeOrder,
    getOrders
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
