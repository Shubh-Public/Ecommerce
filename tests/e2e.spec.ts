import { test, expect } from '@playwright/test';

test.describe('End-to-End E-Commerce Flows', () => {
  test('Complete purchase flow: Browse → Add to Cart → Checkout', async ({ page }) => {
    // Step 1: Browse products on home page
    await page.goto('/');
    await expect(page.locator('[data-testid="product-listing-page"]')).toBeVisible();
    const initialProductCount = await page.locator('[data-testid^="product-card-"]').count();
    expect(initialProductCount).toBeGreaterThan(0);

    // Step 2: View product details
    await page.locator('[data-testid="product-card-1"]').click();
    await expect(page).toHaveURL(/\/product\/1$/);
    await expect(page.locator('[data-testid="product-title"]')).toContainText('Wireless Headphones');

    // Step 3: Add to cart with quantity
    await page.locator('[data-testid="quantity-increase"]').click();
    await page.locator('[data-testid="add-to-cart-button"]').click();
    await expect(page.locator('[data-testid="added-to-cart-message"]')).toBeVisible();

    // Step 4: Back to home, add another product
    await page.locator('[data-testid="back-button"]').click();
    await page.locator('[data-testid="add-to-cart-btn-3"]').click();

    // Step 5: View cart
    await page.locator('[data-testid="nav-cart"]').click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.locator('[data-testid="cart-item-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-item-3"]')).toBeVisible();

    // Step 6: Verify cart summary
    const subtotal = page.locator('[data-testid="subtotal"]');
    await expect(subtotal).toContainText('$');

    // Step 7: Proceed to checkout
    await page.locator('[data-testid="checkout-button"]').click();
    await expect(page).toHaveURL(/\/checkout$/);

    // Step 8: Fill checkout form
    await page.locator('[data-testid="first-name-input"]').fill('John');
    await page.locator('[data-testid="last-name-input"]').fill('Doe');
    await page.locator('[data-testid="email-input"]').fill('john.doe@example.com');
    await page.locator('[data-testid="address-input"]').fill('123 Main Street');
    await page.locator('[data-testid="city-input"]').fill('New York');
    await page.locator('[data-testid="postal-code-input"]').fill('10001');

    // Step 9: Place order
    await page.locator('[data-testid="submit-order-button"]').click();

    // Step 10: Verify order success
    await page.waitForNavigation();
    await expect(page.locator('[data-testid="order-success-message"]')).toBeVisible();
    const orderId = page.locator('[data-testid="order-id"]');
    await expect(orderId).toContainText('ORD-');

    // Step 11: Verify redirect to home
    await page.waitForTimeout(3500);
    await expect(page).toHaveURL(/\/$|\/\?/);
    
    // Step 12: Verify cart is empty
    const cartCount = page.locator('[data-testid="cart-count"]');
    await expect(cartCount).not.toBeVisible();
  });

  test('Filter products and add to cart', async ({ page }) => {
    // Go to home
    await page.goto('/');

    // Filter by Electronics
    await page.locator('[data-testid="filter-electronics"]').click();
    await page.waitForLoadState('networkidle');

    // Count products should be less than total
    const filteredCount = await page.locator('[data-testid^="product-card-"]').count();
    expect(filteredCount).toBe(3); // Electronics category has 3 products

    // Add all electronics to cart
    for (let i = 1; i <= filteredCount; i++) {
      const productCard = page.locator(`[data-testid="product-card-${i}"]`);
      if (await productCard.isVisible()) {
        await productCard.locator('button').last().click();
      }
    }

    // Verify cart count
    const cartCount = page.locator('[data-testid="cart-count"]');
    await expect(cartCount).toContainText('3');
  });

  test('Add same product multiple times - should increase quantity', async ({ page }) => {
    // Go to product details
    await page.goto('/product/1');

    // Add to cart first time
    await page.locator('[data-testid="add-to-cart-button"]').click();
    await expect(page.locator('[data-testid="cart-count"]')).toContainText('1');

    // Go back to product
    await page.locator('[data-testid="back-button"]').click();
    await page.goto('/product/1');

    // Add to cart second time
    await page.locator('[data-testid="add-to-cart-button"]').click();

    // Cart should have quantity 2
    const cartCount = page.locator('[data-testid="cart-count"]');
    await expect(cartCount).toContainText('2');

    // Verify in cart
    await page.locator('[data-testid="nav-cart"]').click();
    const qtyInput = page.locator('[data-testid="qty-input-1"]');
    await expect(qtyInput).toHaveValue('2');
  });

  test('Modify cart quantities and recalculate total', async ({ page }) => {
    // Add products
    await page.goto('/');
    await page.locator('[data-testid="add-to-cart-btn-1"]').click(); // $79.99
    await page.locator('[data-testid="add-to-cart-btn-2"]').click(); // $199.99

    // Go to cart
    await page.locator('[data-testid="nav-cart"]').click();

    // Initial total should be $79.99 + $199.99 = $279.98 + $10 + $27.998 = $317.978 ≈ $317.98
    let total = page.locator('[data-testid="total-price"]');
    let totalText = await total.textContent();
    expect(totalText).toContain('317.98');

    // Increase quantity of first item
    await page.locator('[data-testid="increase-qty-1"]').click();
    await page.waitForLoadState('networkidle');

    // Total should increase
    totalText = await total.textContent();
    expect(totalText).not.toContain('317.98');

    // Remove second item
    await page.locator('[data-testid="remove-item-2"]').click();
    await page.waitForLoadState('networkidle');

    // Total should be recalculated
    const subtotal = page.locator('[data-testid="subtotal"]');
    const subtotalText = await subtotal.textContent();
    // Should be 79.99 * 2 = 159.98
    expect(subtotalText).toContain('159.98');
  });

  test('Continue shopping flow', async ({ page }) => {
    // Add product
    await page.goto('/');
    await page.locator('[data-testid="add-to-cart-btn-1"]').click();

    // Go to cart
    await page.locator('[data-testid="nav-cart"]').click();

    // Click continue shopping
    await page.locator('[data-testid="continue-shopping-button"]').click();

    // Should be back on home page
    await expect(page).toHaveURL(/\/$|\/\?/);
    await expect(page.locator('[data-testid="product-listing-page"]')).toBeVisible();

    // Cart count should still be visible
    const cartCount = page.locator('[data-testid="cart-count"]');
    await expect(cartCount).toContainText('1');
  });

  test('Navigation flow: Home → Category Filter → Product Details → Cart → Checkout', async ({ page }) => {
    // Start at home
    await page.goto('/');

    // Apply category filter
    await page.locator('[data-testid="filter-accessories"]').click();
    await page.waitForLoadState('networkidle');

    // Click first filtered product
    await page.locator('[data-testid="product-card-3"]').click(); // First accessory in our mock

    // Check product details loaded
    await expect(page.locator('[data-testid="product-details-page"]')).toBeVisible();

    // Add to cart
    await page.locator('[data-testid="add-to-cart-button"]').click();

    // Navigate using navbar cart
    await page.locator('[data-testid="nav-cart"]').click();

    // Verify we're on cart page
    await expect(page).toHaveURL(/\/cart$/);

    // Click checkout
    await page.locator('[data-testid="checkout-button"]').click();

    // Verify checkout page
    await expect(page).toHaveURL(/\/checkout$/);
  });

  test('Out of stock product handling', async ({ page }) => {
    await page.goto('/');

    // Try to add out of stock product
    const outOfStockBtn = page.locator('[data-testid="add-to-cart-btn-9"]');
    await expect(outOfStockBtn).toBeDisabled();

    // Cart should remain empty
    const cartCount = page.locator('[data-testid="cart-count"]');
    await expect(cartCount).not.toBeVisible();

    // View product details of out of stock item
    await page.locator('[data-testid="product-card-9"]').click();
    await expect(page).toHaveURL(/\/product\/9$/);

    // Should show out of stock
    const status = page.locator('[data-testid="stock-status"]');
    await expect(status).toContainText('Out of Stock');

    // Should not have quantity selector
    const quantitySelector = page.locator('[data-testid="quantity-selector"]');
    await expect(quantitySelector).not.toBeVisible();
  });

  test('Cart updates correctly when adding product from different pages', async ({ page }) => {
    // Add from listing page
    await page.goto('/');
    await page.locator('[data-testid="add-to-cart-btn-1"]').click();
    
    // Add from product details
    await page.goto('/product/2');
    await page.locator('[data-testid="add-to-cart-button"]').click();

    // Add from listing with filter
    await page.goto('/');
    await page.locator('[data-testid="filter-accessories"]').click();
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid="add-to-cart-btn-4"]').click();

    // Check cart has 3 items
    const cartCount = page.locator('[data-testid="cart-count"]');
    await expect(cartCount).toContainText('3');

    // Verify in cart page
    await page.locator('[data-testid="nav-cart"]').click();
    const cartItems = page.locator('[data-testid^="cart-item-"]');
    expect(await cartItems.count()).toBe(3);
  });

  test('Complete purchase with discount calculation verification', async ({ page }) => {
    // Add product
    await page.goto('/');
    await page.locator('[data-testid="add-to-cart-btn-1"]').click();

    // Go to cart
    await page.locator('[data-testid="nav-cart"]').click();

    // Verify calculations
    // Product: $79.99
    // Shipping: $10.00
    // Tax (10%): $8.00
    // Total: $97.99
    
    const subtotal = await page.locator('[data-testid="subtotal"]').textContent();
    const shipping = await page.locator('[data-testid="shipping"]').textContent();
    const tax = await page.locator('[data-testid="tax"]').textContent();
    const total = await page.locator('[data-testid="total-price"]').textContent();

    expect(subtotal).toContain('79.99');
    expect(shipping).toContain('10.00');
    expect(tax).toContain('8.00');
    expect(total).toContain('97.99');

    // Verify same totals in checkout
    await page.locator('[data-testid="checkout-button"]').click();
    
    const checkoutTotal = await page.locator('[data-testid="checkout-total"]').textContent();
    expect(checkoutTotal).toContain('97.99');
  });

  test('Remove item from cart then continue shopping', async ({ page }) => {
    // Add multiple items
    await page.goto('/');
    await page.locator('[data-testid="add-to-cart-btn-1"]').click();
    await page.locator('[data-testid="add-to-cart-btn-2"]').click();

    // Go to cart
    await page.locator('[data-testid="nav-cart"]').click();

    // Remove one item
    await page.locator('[data-testid="remove-item-1"]').click();
    await page.waitForLoadState('networkidle');

    // Continue shopping
    await page.locator('[data-testid="continue-shopping-button"]').click();

    // Add another product
    await page.locator('[data-testid="add-to-cart-btn-3"]').click();

    // Cart should have product 2 and 3
    const cartCount = page.locator('[data-testid="cart-count"]');
    await expect(cartCount).toContainText('2');

    // Verify in cart
    await page.locator('[data-testid="nav-cart"]').click();
    
    await expect(page.locator('[data-testid="cart-item-2"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-item-3"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-item-1"]')).not.toBeVisible();
  });
});
