import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

/**
 * ProductCard Component
 * Displays a single product with option to add to cart
 */
const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useCart();

  // Check if product is already in cart
  const isInCart = cartItems.some((item) => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <div className="product-card" data-testid={`product-card-${product.id}`}>
        <div className="product-image">{product.image}</div>
        <div className="product-info">
          <h3 className="product-name" data-testid={`product-name-${product.id}`}>
            {product.name}
          </h3>
          <p className="product-category" data-testid={`product-category-${product.id}`}>
            {product.category}
          </p>
          <p className="product-price" data-testid={`product-price-${product.id}`}>
            ${product.price.toFixed(2)}
          </p>
          <p className="product-rating" data-testid={`product-rating-${product.id}`}>
            ⭐ {product.rating}
          </p>
          <button
            className={`add-to-cart-btn ${!product.inStock ? 'disabled' : ''} ${isInCart ? 'added' : ''}`}
            onClick={handleAddToCart}
            disabled={!product.inStock || isInCart}
            data-testid={`add-to-cart-btn-${product.id}`}
          >
            {!product.inStock ? 'Out of Stock' : isInCart ? '✓ Added to Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
