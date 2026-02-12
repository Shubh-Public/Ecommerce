import { test, expect } from '@playwright/test';

test.describe('Cart Page', () => {
  test('should display empty cart message when no items', async ({ page }) => {
    // Navigate to cart page
    await page.goto('/cart');

    // Check empty cart message
    const emptyMsg = page.locator('[data-testid="empty-cart-message"]');
    await expect(emptyMsg).toBeVisible();
    await expect(emptyMsg).toContainText('Your cart is empty');

    // Check continue shopping button
    const continueBtn = page.locator('text=/Continue Shopping/');
    await expect(continueBtn).toBeVisible();
  });

  test('should add product to cart and display in cart page', async ({ page }) => {
    // Go to home and add product
    await page.goto('/');
    await page.locator('[data-testid="add-to-cart-btn-1"]').click();

    // Navigate to cart
    await page.locator('[data-testid="nav-cart"]').click();

    // Check cart page
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.locator('[data-testid="cart-page"]')).toBeVisible();

    // Check product is in cart
    const cartItem = page.locator('[data-testid="cart-item-1"]');
    await expect(cartItem).toBeVisible();

    // Check product details
    const productName = page.locator('[data-testid="cart-item-name-1"]');
    await expect(productName).toContainText('Wireless Headphones');

    const productPrice = page.locator('[data-testid="cart-item-price-1"]');
    await expect(productPrice).toContainText('$79.99');
  });

  test('should display cart summary with calculations', async ({ page }) => {
    // Add products
    await page.goto('/');
    await page.locator('[data-testid="add-to-cart-btn-1"]').click();

    // Go to cart
    await page.locator('[data-testid="nav-cart"]').click();

    // Check summary section
    const summary = page.locator('[data-testid="cart-summary"]');
    await expect(summary).toBeVisible();

    // Check subtotal
    const subtotal = page.locator('[data-testid="subtotal"]');
    await expect(subtotal).toContainText('$79.99');

    // Check shipping
    const shipping = page.locator('[data-testid="shipping"]');
    await expect(shipping).toContainText('$10.00');

    // Check tax (10% of subtotal)
    const tax = page.locator('[data-testid="tax"]');
    await expect(tax).toContainText('$8.00');

    // Check total
    const total = page.locator('[data-testid="total-price"]');
    await expect(total).toContainText('$97.99');
  });

  test('should update quantity from cart page', async ({ page }) => {
    // Add product
    await page.goto('/');
    await page.locator('[data-testid="add-to-cart-btn-1"]').click();

    // Go to cart
    await page.locator('[data-testid="nav-cart"]').click();

    // Get quantity input
    const quantityInput = page.locator('[data-testid="qty-input-1"]');
    
    // Change quantity to 3
    await quantityInput.clear();
    await quantityInput.fill('3');

    // Press enter or trigger change
    await quantityInput.blur();

    // Wait for updates
    await page.waitForLoadState('networkidle');

    // Check total updated (79.99 * 3 = 239.97 subtotal)
    const subtotal = page.locator('[data-testid="subtotal"]');
    await expect(subtotal).toContainText('$239.97');
  });

  test('should increase quantity using + button', async ({ page }) => {
    // Add product
    await page.goto('/');
    await page.locator('[data-testid="add-to-cart-btn-1"]').click();

    // Go to cart
    await page.locator('[data-testid="nav-cart"]').click();

    // Click increase button twice
    await page.locator('[data-testid="increase-qty-1"]').click();
    await page.locator('[data-testid="increase-qty-1"]').click();

    // Check quantity
    const quantityInput = page.locator('[data-testid="qty-input-1"]');
    await expect(quantityInput).toHaveValue('3');
  });

  test('should decrease quantity using - button', async ({ page }) => {
    // Add multiple items
    await page.goto('/');
    await page.locator('[data-testid="add-to-cart-btn-1"]').click();

    // Go to cart
    await page.locator('[data-testid="nav-cart"]').click();

    // Increase quantity first
    await page.locator('[data-testid="increase-qty-1"]').click();
    await page.locator('[data-testid="increase-qty-1"]').click();

    // Decrease by 1
    await page.locator('[data-testid="decrease-qty-1"]').click();

    // Check quantity is 2
    const quantityInput = page.locator('[data-testid="qty-input-1"]');
    await expect(quantityInput).toHaveValue('2');
  });

  test('should remove item from cart', async ({ page }) => {
    // Add two products
    await page.goto('/');
    await page.locator('[data-testid="add-to-cart-btn-1"]').click();
    await page.locator('[data-testid="add-to-cart-btn-2"]').click();

    // Go to cart
    await page.locator('[data-testid="nav-cart"]').click();

    // Check both items exist
    let cartItem1 = page.locator('[data-testid="cart-item-1"]');
    let cartItem2 = page.locator('[data-testid="cart-item-2"]');
    await expect(cartItem1).toBeVisible();
    await expect(cartItem2).toBeVisible();

    // Remove first item
    await page.locator('[data-testid="remove-item-1"]').click();

    // Wait for update
    await page.waitForLoadState('networkidle');

    // Check first item is gone, second remains
    await expect(cartItem1).not.toBeVisible();
    await expect(cartItem2).toBeVisible();

    // Check cart count updated
    const cartCount = page.locator('[data-testid="cart-count"]');
    await expect(cartCount).toContainText('1');
  });

  test('should navigate to checkout from cart', async ({ page }) => {
    // Add product
    await page.goto('/');
    await page.locator('[data-testid="add-to-cart-btn-1"]').click();

    // Go to cart
    await page.locator('[data-testid="nav-cart"]').click();

    // Click checkout button
    await page.locator('[data-testid="checkout-button"]').click();

    // Check we're on checkout page
    await expect(page).toHaveURL(/\/checkout$/);
    await expect(page.locator('[data-testid="checkout-page"]')).toBeVisible();
  });

  test('should navigate to home from cart', async ({ page }) => {
    // Add product
    await page.goto('/');
    await page.locator('[data-testid="add-to-cart-btn-1"]').click();

    // Go to cart
    await page.locator('[data-testid="nav-cart"]').click();

    // Click continue shopping button
    await page.locator('[data-testid="continue-shopping-button"]').click();

    // Check we're back on home page
    await expect(page).toHaveURL(/\/$|\/\?/);
    await expect(page.locator('[data-testid="product-listing-page"]')).toBeVisible();
  });

  test('should display multiple items with correct totals', async ({ page }) => {
    // Add multiple different products
    await page.goto('/');
    await page.locator('[data-testid="add-to-cart-btn-1"]').click(); // $79.99
    await page.locator('[data-testid="add-to-cart-btn-2"]').click(); // $199.99
    await page.locator('[data-testid="add-to-cart-btn-3"]').click(); // $34.99

    // Go to cart
    await page.locator('[data-testid="nav-cart"]').click();

    // Check all items displayed
    await expect(page.locator('[data-testid="cart-item-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-item-2"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-item-3"]')).toBeVisible();

    // Check subtotal calculation (79.99 + 199.99 + 34.99 = 314.97)
    const subtotal = page.locator('[data-testid="subtotal"]');
    await expect(subtotal).toContainText('$314.97');

    // Check total calculation (314.97 + 10 + 31.497 = 356.47)
    const total = page.locator('[data-testid="total-price"]');
    await expect(total).toContainText('$356.47');
  });

  test('should update totals when removing item', async ({ page }) => {
    // Add multiple products
    await page.goto('/');
    await page.locator('[data-testid="add-to-cart-btn-1"]').click(); // $79.99
    await page.locator('[data-testid="add-to-cart-btn-2"]').click(); // $199.99

    // Go to cart
    await page.locator('[data-testid="nav-cart"]').click();

    // Remove first item
    await page.locator('[data-testid="remove-item-1"]').click();
    await page.waitForLoadState('networkidle');

    // Check subtotal updated to just product 2
    const subtotal = page.locator('[data-testid="subtotal"]');
    await expect(subtotal).toContainText('$199.99');
  });

  test('should display item count in navbar when items in cart', async ({ page }) => {
    // Add product
    await page.goto('/');
    await page.locator('[data-testid="add-to-cart-btn-1"]').click();

    // Go to cart
    await page.locator('[data-testid="nav-cart"]').click();

    // Check cart count is visible
    const cartCount = page.locator('[data-testid="cart-count"]');
    await expect(cartCount).toBeVisible();
    await expect(cartCount).toContainText('1');
  });

  test('should update quantity to zero removes item', async ({ page }) => {
    // Add product
    await page.goto('/');
    await page.locator('[data-testid="add-to-cart-btn-1"]').click();

    // Go to cart
    await page.locator('[data-testid="nav-cart"]').click();

    // Set quantity to 0
    const quantityInput = page.locator('[data-testid="qty-input-1"]');
    await quantityInput.clear();
    await quantityInput.fill('0');
    await quantityInput.blur();

    // Wait for update
    await page.waitForLoadState('networkidle');

    // Item should be removed and empty cart message shown
    const emptyMsg = page.locator('[data-testid="empty-cart-message"]');
    await expect(emptyMsg).toBeVisible();
  });
});
