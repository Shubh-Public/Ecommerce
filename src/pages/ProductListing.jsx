import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { mockProducts, categories } from '../data/mockProducts';

/**
 * ProductListing Page
 * Display all products with category filtering
 */
const ProductListing = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') {
      return mockProducts;
    }
    return mockProducts.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="page" data-testid="product-listing-page">
      <h2>Products</h2>
      
      {/* Category Filters */}
      <div className="filters" data-testid="category-filters">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
            data-testid={`filter-${category.toLowerCase()}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Count */}
      <p data-testid="product-count">
        Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
      </p>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="products-grid" data-testid="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-cart" data-testid="no-products-message">
          <p>No products found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default ProductListing;
