import { test, expect } from '@playwright/test';

test.describe('Product Listing Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test
    await page.goto('/');
  });

  test('should load product listing page', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle('EcomStore - E-Commerce Application');
    
    // Check navbar
    await expect(page.locator('[data-testid="navbar"]')).toBeVisible();
    await expect(page.locator('[data-testid="navbar-title"]')).toContainText('EcomStore');
  });

  test('should display all products by default', async ({ page }) => {
    // Check products grid
    const productsGrid = page.locator('[data-testid="products-grid"]');
    await expect(productsGrid).toBeVisible();

    // Count products - should be 10 in mock data
    const productCards = page.locator('[data-testid^="product-card-"]');
    const count = await productCards.count();
    expect(count).toBe(10);
  });

  test('should display product information correctly', async ({ page }) => {
    // Check first product card contains required information
    const firstProductName = page.locator('[data-testid="product-name-1"]');
    const firstProductPrice = page.locator('[data-testid="product-price-1"]');
    const firstProductCategory = page.locator('[data-testid="product-category-1"]');
    const firstProductRating = page.locator('[data-testid="product-rating-1"]');
    const addToCartBtn = page.locator('[data-testid="add-to-cart-btn-1"]');

    await expect(firstProductName).toBeVisible();
    await expect(firstProductPrice).toBeVisible();
    await expect(firstProductCategory).toBeVisible();
    await expect(firstProductRating).toBeVisible();
    await expect(addToCartBtn).toBeVisible();

    // Verify content
    await expect(firstProductName).toContainText('Wireless Headphones');
    await expect(firstProductPrice).toContainText('$79.99');
    await expect(firstProductCategory).toContainText('Electronics');
  });

  test('should filter products by Electronics category', async ({ page }) => {
    // Click on Electronics filter
    await page.locator('[data-testid="filter-electronics"]').click();

    // Wait for products to update
    await page.waitForLoadState('networkidle');

    // Should show only 3 electronics products
    const productCards = page.locator('[data-testid^="product-card-"]');
    const count = await productCards.count();
    expect(count).toBe(4);

    // Verify all shown products are electronics
    const categories = await page.locator('[data-testid^="product-category-"]').allTextContents();
    categories.forEach(category => {
      expect(category).toContain('Electronics');
    });
  });

  test('should filter products by Accessories category', async ({ page }) => {
    // Click on Accessories filter
    await page.locator('[data-testid="filter-accessories"]').click();

    // Wait for products to update
    await page.waitForLoadState('networkidle');

    // Should show only 5 accessories products
    const productCards = page.locator('[data-testid^="product-card-"]');
    const count = await productCards.count();
    expect(count).toBe(5);

    // Verify product count display
    const productCountText = page.locator('[data-testid="product-count"]');
    await expect(productCountText).toContainText('5 products');
  });

  test('should reset filter to show all products', async ({ page }) => {
    // Apply a filter
    await page.locator('[data-testid="filter-electronics"]').click();
    await page.waitForLoadState('networkidle');

    // Reset to all
    await page.locator('[data-testid="filter-all"]').click();
    await page.waitForLoadState('networkidle');

    // Should show all 10 products
    const productCards = page.locator('[data-testid^="product-card-"]');
    const count = await productCards.count();
    expect(count).toBe(10);
  });

  test('should navigate to product details page on product click', async ({ page }) => {
    // Click on first product
    await page.locator('[data-testid="product-card-1"]').click();

    // Check URL changed to /product/1
    await expect(page).toHaveURL(/\/product\/1$/);

    // Check product details page loaded
    await expect(page.locator('[data-testid="product-details-page"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-title"]')).toContainText('Wireless Headphones');
  });

  test('should add product to cart from listing page', async ({ page }) => {
    // Add first product to cart
    await page.locator('[data-testid="add-to-cart-btn-1"]').click();

    // Check cart count updated
    const cartCount = page.locator('[data-testid="cart-count"]');
    await expect(cartCount).toBeVisible();
    await expect(cartCount).toContainText('1');
  });

  test('should add multiple different products to cart', async ({ page }) => {
    // Add first product
    await page.locator('[data-testid="add-to-cart-btn-1"]').click();

    // Add second product
    await page.locator('[data-testid="add-to-cart-btn-2"]').click();

    // Add third product
    await page.locator('[data-testid="add-to-cart-btn-3"]').click();

    // Check cart count is 3
    const cartCount = page.locator('[data-testid="cart-count"]');
    await expect(cartCount).toContainText('3');
  });

  test('should handle out of stock products', async ({ page }) => {
    // Filter to find out of stock product (ID 9 - Bluetooth Speaker is out of stock)
    // First scroll to see it or add test data visibility
    const outOfStockBtn = page.locator('[data-testid="add-to-cart-btn-9"]');
    
    // Button should be disabled
    await expect(outOfStockBtn).toBeDisabled();
    
    // Button text should show "Out of Stock"
    await expect(outOfStockBtn).toContainText('Out of Stock');
  });

  test('should navigate to cart from navbar', async ({ page }) => {
    // Add item to cart first
    await page.locator('[data-testid="add-to-cart-btn-1"]').click();

    // Click cart link in navbar
    await page.locator('[data-testid="nav-cart"]').click();

    // Should be on cart page
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.locator('[data-testid="cart-page"]')).toBeVisible();
  });

  test('should navigate to home from navbar', async ({ page }) => {
    // Add item to cart
    await page.locator('[data-testid="add-to-cart-btn-1"]').click();

    // Navigate to cart page
    await page.locator('[data-testid="nav-cart"]').click();

    // Click home link
    await page.locator('[data-testid="nav-home"]').click();

    // Should be back on home page
    await expect(page).toHaveURL(/\/$|\/\?/);
    await expect(page.locator('[data-testid="product-listing-page"]')).toBeVisible();
  });

  test('should show button state change when product added to cart', async ({ page }) => {
    // Get the add to cart button for first product
    const addBtn = page.locator('[data-testid="add-to-cart-btn-1"]');
    
    // Initially should be "Add to Cart"
    await expect(addBtn).toContainText('Add to Cart');
    await expect(addBtn).toBeEnabled();

    // Click add to cart
    await addBtn.click();

    // Button should change to "Added to Cart" and disable
    await expect(addBtn).toContainText('✓ Added to Cart');
    await expect(addBtn).toBeDisabled();
  });

  test('should show different button states for different products', async ({ page }) => {
    // Add first product
    await page.locator('[data-testid="add-to-cart-btn-1"]').click();
    
    // First button should be "Added to Cart" and disabled
    const btn1 = page.locator('[data-testid="add-to-cart-btn-1"]');
    await expect(btn1).toContainText('✓ Added to Cart');
    await expect(btn1).toBeDisabled();

    // Second button should still be "Add to Cart" and enabled
    const btn2 = page.locator('[data-testid="add-to-cart-btn-2"]');
    await expect(btn2).toContainText('Add to Cart');
    await expect(btn2).toBeEnabled();

    // Add second product
    await btn2.click();

    // Now both buttons should be "Added to Cart" and disabled
    await expect(btn1).toContainText('✓ Added to Cart');
    await expect(btn1).toBeDisabled();
    await expect(btn2).toContainText('✓ Added to Cart');
    await expect(btn2).toBeDisabled();
  });

  test('should maintain button state across page navigation', async ({ page }) => {
    // Add product to cart
    await page.locator('[data-testid="add-to-cart-btn-1"]').click();

    // Verify button is "Added to Cart"
    const addBtn = page.locator('[data-testid="add-to-cart-btn-1"]');
    await expect(addBtn).toContainText('✓ Added to Cart');

    // Navigate to product details and back
    await page.locator('[data-testid="product-card-1"]').click();
    await expect(page).toHaveURL(/\/product\/1$/);

    // Go back to listing
    await page.locator('[data-testid="back-button"]').click();
    await expect(page).toHaveURL(/\/$|\/\?/);

    // Button should still show "Added to Cart"
    await expect(addBtn).toContainText('✓ Added to Cart');
    await expect(addBtn).toBeDisabled();
  });
});
