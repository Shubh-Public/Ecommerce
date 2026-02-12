import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

/**
 * Custom hook to use the Cart context
 * @returns {Object} Cart context value with all cart methods
 */
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  
  return context;
};
