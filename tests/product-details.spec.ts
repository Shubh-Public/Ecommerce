import { test, expect } from '@playwright/test';

test.describe('Product Details Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to product details page
    await page.goto('/product/1');
  });

  test('should load product details page', async ({ page }) => {
    // Check page loads
    await expect(page.locator('[data-testid="product-details-page"]')).toBeVisible();
    
    // Check back button exists
    await expect(page.locator('[data-testid="back-button"]')).toBeVisible();
  });

  test('should display product details correctly', async ({ page }) => {
    // Check product title
    const title = page.locator('[data-testid="product-title"]');
    await expect(title).toContainText('Wireless Headphones');

    // Check price
    const price = page.locator('[data-testid="product-price"]');
    await expect(price).toContainText('$79.99');

    // Check category
    const category = page.locator('[data-testid="product-category"]');
    await expect(category).toContainText('Electronics');

    // Check rating
    const rating = page.locator('[data-testid="product-rating"]');
    await expect(rating).toContainText('4.5');

    // Check description
    const description = page.locator('[data-testid="product-description"]');
    await expect(description).toBeVisible();

    // Check stock status
    const stockStatus = page.locator('[data-testid="stock-status"]');
    await expect(stockStatus).toContainText('In Stock');
  });

  test('should display quantity selector', async ({ page }) => {
    // Check quantity selector exists
    const quantitySelector = page.locator('[data-testid="quantity-selector"]');
    await expect(quantitySelector).toBeVisible();

    // Check quantity input
    const quantityInput = page.locator('[data-testid="quantity-input"]');
    await expect(quantityInput).toHaveValue('1');

    // Check decrease button
    const decreaseBtn = page.locator('[data-testid="quantity-decrease"]');
    await expect(decreaseBtn).toBeVisible();
    await expect(decreaseBtn).toBeDisabled(); // Should be disabled at quantity 1

    // Check increase button
    const increaseBtn = page.locator('[data-testid="quantity-increase"]');
    await expect(increaseBtn).toBeVisible();
    await expect(increaseBtn).toBeEnabled();
  });

  test('should increase quantity', async ({ page }) => {
    // Click increase button
    await page.locator('[data-testid="quantity-increase"]').click();

    // Check quantity increased
    const quantityInput = page.locator('[data-testid="quantity-input"]');
    await expect(quantityInput).toHaveValue('2');

    // Decrease button should now be enabled
    const decreaseBtn = page.locator('[data-testid="quantity-decrease"]');
    await expect(decreaseBtn).toBeEnabled();
  });

  test('should decrease quantity', async ({ page }) => {
    // Increase quantity first
    await page.locator('[data-testid="quantity-increase"]').click();
    await page.locator('[data-testid="quantity-increase"]').click();

    // Click decrease button
    await page.locator('[data-testid="quantity-decrease"]').click();

    // Check quantity decreased
    const quantityInput = page.locator('[data-testid="quantity-input"]');
    await expect(quantityInput).toHaveValue('2');
  });

  test('should change quantity via input field', async ({ page }) => {
    // Get quantity input
    const quantityInput = page.locator('[data-testid="quantity-input"]');

    // Clear and enter new quantity
    await quantityInput.clear();
    await quantityInput.fill('5');

    // Check value changed
    await expect(quantityInput).toHaveValue('5');
  });

  test('should not exceed max stock quantity', async ({ page }) => {
    // Product has 15 in stock
    // Try to increase beyond max - should be prevented
    const quantityInput = page.locator('[data-testid="quantity-input"]');
    const increaseBtn = page.locator('[data-testid="quantity-increase"]');

    // Click increase 15 times to reach max
    for (let i = 0; i < 20; i++) {
      await increaseBtn.click();
    }

    // Check max quantity is 15
    const value = await quantityInput.inputValue();
    expect(parseInt(value)).toBeLessThanOrEqual(15);
  });

  test('should add product to cart with quantity', async ({ page }) => {
    // Set quantity to 3
    await page.locator('[data-testid="quantity-increase"]').click();
    await page.locator('[data-testid="quantity-increase"]').click();

    // Add to cart
    await page.locator('[data-testid="add-to-cart-button"]').click();

    // Check button changes to "Added to Cart" and disables
    const addBtn = page.locator('[data-testid="add-to-cart-button"]');
    await expect(addBtn).toContainText('✓ Added to Cart');
    await expect(addBtn).toBeDisabled();

    // Check cart count updated
    const cartCount = page.locator('[data-testid="cart-count"]');
    await expect(cartCount).toContainText('3');
  });

  test('should show button state change after adding to cart', async ({ page }) => {
    // Add to cart
    const addBtn = page.locator('[data-testid="add-to-cart-button"]');
    
    // Initially should be "Add to Cart"
    await expect(addBtn).toContainText('Add to Cart');
    await expect(addBtn).toBeEnabled();

    // Click add to cart
    await addBtn.click();

    // Button should change to "Added to Cart" and disable
    await expect(addBtn).toContainText('✓ Added to Cart');
    await expect(addBtn).toBeDisabled();
  });

  test('should navigate back to product listing', async ({ page }) => {
    // Click back button
    await page.locator('[data-testid="back-button"]').click();

    // Check we're back on listing page
    await expect(page).toHaveURL(/\/$|\/\?/);
    await expect(page.locator('[data-testid="product-listing-page"]')).toBeVisible();
  });

  test('should display different product details for different IDs', async ({ page }) => {
    // Navigate to product 2
    await page.goto('/product/2');

    // Check product title changed
    const title = page.locator('[data-testid="product-title"]');
    await expect(title).toContainText('Smart Watch');

    // Check price changed
    const price = page.locator('[data-testid="product-price"]');
    await expect(price).toContainText('$199.99');
  });

  test('should handle out of stock products', async ({ page }) => {
    // Navigate to product 9 (Bluetooth Speaker - out of stock)
    await page.goto('/product/9');

    // Check stock status
    const stockStatus = page.locator('[data-testid="stock-status"]');
    await expect(stockStatus).toContainText('Out of Stock');

    // Check out of stock button is shown
    const outOfStockBtn = page.locator('[data-testid="out-of-stock-button"]');
    await expect(outOfStockBtn).toBeVisible();
    await expect(outOfStockBtn).toBeDisabled();
    await expect(outOfStockBtn).toContainText('Out of Stock');

    // Quantity selector should not be visible for out of stock
    const quantitySelector = page.locator('[data-testid="quantity-selector"]');
    await expect(quantitySelector).not.toBeVisible();
  });

  test('should show product not found for invalid product ID', async ({ page }) => {
    // Navigate to invalid product ID
    await page.goto('/product/999');

    // Check not found message
    const notFoundMsg = page.locator('[data-testid="product-not-found"]');
    await expect(notFoundMsg).toBeVisible();
    await expect(notFoundMsg).toContainText('Product Not Found');

    // Back button should be visible
    const backBtn = page.locator('[data-testid="back-button"]');
    await expect(backBtn).toBeVisible();
  });

  test('should display product image emoji', async ({ page }) => {
    // Check product image (emoji)
    const image = page.locator('[data-testid="product-image"]');
    await expect(image).toContainText('🎧');
  });

  test('Cart count should update correctly when adding same product twice', async ({ page }) => {
    // Add one item
    await page.locator('[data-testid="add-to-cart-button"]').click();
    await page.waitForTimeout(500);

    // Go back
    await page.locator('[data-testid="back-button"]').click();

    // Go to same product again
    await page.goto('/product/1');

    // Add again
    await page.locator('[data-testid="add-to-cart-button"]').click();

    // Cart count should be 2
    const cartCount = page.locator('[data-testid="cart-count"]');
    await expect(cartCount).toContainText('2');
  });
});
