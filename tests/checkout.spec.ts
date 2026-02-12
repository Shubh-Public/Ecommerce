import { test, expect } from '@playwright/test';

test.describe('Checkout Page', () => {
  test.beforeEach(async ({ page }) => {
    // Add product to cart before each test
    await page.goto('/');
    await page.locator('[data-testid="add-to-cart-btn-1"]').click();

    // Navigate to checkout
    await page.locator('[data-testid="nav-cart"]').click();
    await page.locator('[data-testid="checkout-button"]').click();
  });

  test('should load checkout page', async ({ page }) => {
    // Check checkout page is visible
    await expect(page).toHaveURL(/\/checkout$/);
    await expect(page.locator('[data-testid="checkout-page"]')).toBeVisible();
  });

  test('should display order summary on checkout page', async ({ page }) => {
    // Check order summary exists
    const orderSummary = page.locator('[data-testid="order-summary"]');
    await expect(orderSummary).toBeVisible();

    // Check product is in summary
    const summaryItem = page.locator('[data-testid="summary-item-1"]');
    await expect(summaryItem).toBeVisible();
    await expect(summaryItem).toContainText('Wireless Headphones');

    // Check total
    const total = page.locator('[data-testid="checkout-total"]');
    await expect(total).toContainText('$97.99');
  });

  test('should display checkout form with all required fields', async ({ page }) => {
    // Check form exists
    const form = page.locator('[data-testid="checkout-form"]');
    await expect(form).toBeVisible();

    // Check all input fields exist
    await expect(page.locator('[data-testid="first-name-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="last-name-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="address-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="city-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="postal-code-input"]')).toBeVisible();

    // Check submit button
    await expect(page.locator('[data-testid="submit-order-button"]')).toBeVisible();
  });

  test('should show validation error for empty first name', async ({ page }) => {
    // Fill all except first name
    await page.locator('[data-testid="last-name-input"]').fill('Doe');
    await page.locator('[data-testid="email-input"]').fill('john@example.com');
    await page.locator('[data-testid="address-input"]').fill('123 Main St');
    await page.locator('[data-testid="city-input"]').fill('New York');
    await page.locator('[data-testid="postal-code-input"]').fill('10001');

    // Submit form
    await page.locator('[data-testid="submit-order-button"]').click();

    // Check error message
    const errorMsg = page.locator('[data-testid="error-firstName"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('First name is required');
  });

  test('should show validation error for empty last name', async ({ page }) => {
    // Fill all except last name
    await page.locator('[data-testid="first-name-input"]').fill('John');
    await page.locator('[data-testid="email-input"]').fill('john@example.com');
    await page.locator('[data-testid="address-input"]').fill('123 Main St');
    await page.locator('[data-testid="city-input"]').fill('New York');
    await page.locator('[data-testid="postal-code-input"]').fill('10001');

    // Submit form
    await page.locator('[data-testid="submit-order-button"]').click();

    // Check error message
    const errorMsg = page.locator('[data-testid="error-lastName"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Last name is required');
  });

  test('should show validation error for invalid email', async ({ page }) => {
    // Fill form with invalid email
    await page.locator('[data-testid="first-name-input"]').fill('John');
    await page.locator('[data-testid="last-name-input"]').fill('Doe');
    await page.locator('[data-testid="email-input"]').fill('invalid-email');
    await page.locator('[data-testid="address-input"]').fill('123 Main St');
    await page.locator('[data-testid="city-input"]').fill('New York');
    await page.locator('[data-testid="postal-code-input"]').fill('10001');

    // Submit form
    await page.locator('[data-testid="submit-order-button"]').click();

    // Check error message
    const errorMsg = page.locator('[data-testid="error-email"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Invalid email format');
  });

  test('should show validation error for empty address', async ({ page }) => {
    // Fill all except address
    await page.locator('[data-testid="first-name-input"]').fill('John');
    await page.locator('[data-testid="last-name-input"]').fill('Doe');
    await page.locator('[data-testid="email-input"]').fill('john@example.com');
    await page.locator('[data-testid="city-input"]').fill('New York');
    await page.locator('[data-testid="postal-code-input"]').fill('10001');

    // Submit form
    await page.locator('[data-testid="submit-order-button"]').click();

    // Check error message
    const errorMsg = page.locator('[data-testid="error-address"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Address is required');
  });

  test('should show validation error for empty city', async ({ page }) => {
    // Fill all except city
    await page.locator('[data-testid="first-name-input"]').fill('John');
    await page.locator('[data-testid="last-name-input"]').fill('Doe');
    await page.locator('[data-testid="email-input"]').fill('john@example.com');
    await page.locator('[data-testid="address-input"]').fill('123 Main St');
    await page.locator('[data-testid="postal-code-input"]').fill('10001');

    // Submit form
    await page.locator('[data-testid="submit-order-button"]').click();

    // Check error message
    const errorMsg = page.locator('[data-testid="error-city"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('City is required');
  });

  test('should show validation error for empty postal code', async ({ page }) => {
    // Fill all except postal code
    await page.locator('[data-testid="first-name-input"]').fill('John');
    await page.locator('[data-testid="last-name-input"]').fill('Doe');
    await page.locator('[data-testid="email-input"]').fill('john@example.com');
    await page.locator('[data-testid="address-input"]').fill('123 Main St');
    await page.locator('[data-testid="city-input"]').fill('New York');

    // Submit form
    await page.locator('[data-testid="submit-order-button"]').click();

    // Check error message
    const errorMsg = page.locator('[data-testid="error-postalCode"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Postal code is required');
  });

  test('should show multiple validation errors at once', async ({ page }) => {
    // Submit form without filling anything
    await page.locator('[data-testid="submit-order-button"]').click();

    // Check multiple errors are shown
    await expect(page.locator('[data-testid="error-firstName"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-lastName"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-email"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-address"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-city"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-postalCode"]')).toBeVisible();
  });

  test('should clear error when field is filled', async ({ page }) => {
    // Submit form empty to trigger errors
    await page.locator('[data-testid="submit-order-button"]').click();

    // Check error is visible
    const errorMsg = page.locator('[data-testid="error-firstName"]');
    await expect(errorMsg).toBeVisible();

    // Fill the field
    await page.locator('[data-testid="first-name-input"]').fill('John');

    // Error should be cleared
    await expect(errorMsg).not.toBeVisible();
  });

  test('should submit valid form and show success message', async ({ page }) => {
    // Fill form with valid data
    await page.locator('[data-testid="first-name-input"]').fill('John');
    await page.locator('[data-testid="last-name-input"]').fill('Doe');
    await page.locator('[data-testid="email-input"]').fill('john@example.com');
    await page.locator('[data-testid="address-input"]').fill('123 Main St');
    await page.locator('[data-testid="city-input"]').fill('New York');
    await page.locator('[data-testid="postal-code-input"]').fill('10001');

    // Submit form
    await page.locator('[data-testid="submit-order-button"]').click();

    // Wait for success page to load
    await page.waitForNavigation();

    // Check success message
    const successMsg = page.locator('[data-testid="order-success-message"]');
    await expect(successMsg).toBeVisible();
    await expect(successMsg).toContainText('Order Placed Successfully!');

    // Check order ID is displayed
    const orderId = page.locator('[data-testid="order-id"]');
    await expect(orderId).toBeVisible();
    await expect(orderId).toContainText('ORD-');
  });

  test('should redirect to home after order placed', async ({ page }) => {
    // Fill form
    await page.locator('[data-testid="first-name-input"]').fill('John');
    await page.locator('[data-testid="last-name-input"]').fill('Doe');
    await page.locator('[data-testid="email-input"]').fill('john@example.com');
    await page.locator('[data-testid="address-input"]').fill('123 Main St');
    await page.locator('[data-testid="city-input"]').fill('New York');
    await page.locator('[data-testid="postal-code-input"]').fill('10001');

    // Submit form
    await page.locator('[data-testid="submit-order-button"]').click();

    // Wait for redirect (3 seconds in the code)
    await page.waitForTimeout(3500);

    // Check we're on home page
    await expect(page).toHaveURL(/\/$|\/\?/);
    await expect(page.locator('[data-testid="product-listing-page"]')).toBeVisible();

    // Check cart is empty after order
    const cartCount = page.locator('[data-testid="cart-count"]');
    await expect(cartCount).not.toBeVisible();
  });

  test('should handle checkout with multiple items', async ({ page }) => {
    // First, add another item to cart (go back to home, add item, then checkout)
    await page.goto('/');
    await page.locator('[data-testid="add-to-cart-btn-2"]').click();

    // Go to cart and checkout
    await page.locator('[data-testid="nav-cart"]').click();
    await page.locator('[data-testid="checkout-button"]').click();

    // Check order summary shows both items
    const summaryItems = page.locator('[data-testid^="summary-item-"]');
    const count = await summaryItems.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // Fill form
    await page.locator('[data-testid="first-name-input"]').fill('John');
    await page.locator('[data-testid="last-name-input"]').fill('Doe');
    await page.locator('[data-testid="email-input"]').fill('john@example.com');
    await page.locator('[data-testid="address-input"]').fill('123 Main St');
    await page.locator('[data-testid="city-input"]').fill('New York');
    await page.locator('[data-testid="postal-code-input"]').fill('10001');

    // Submit
    await page.locator('[data-testid="submit-order-button"]').click();

    // Check success
    await page.waitForNavigation();
    const successMsg = page.locator('[data-testid="order-success-message"]');
    await expect(successMsg).toBeVisible();
  });

  test('should display empty cart notice when navigating to checkout without items', async ({ page }) => {
    // Navigate directly to checkout without items
    await page.goto('/checkout');

    // Check empty cart notice
    const emptyNotice = page.locator('[data-testid="empty-cart-notice"]');
    await expect(emptyNotice).toBeVisible();
    await expect(emptyNotice).toContainText('Your cart is empty');

    // Check continue shopping button
    const continueBtn = page.locator('text=/Continue Shopping/');
    await expect(continueBtn).toBeVisible();
  });

  test('should validate email format correctly', async ({ page }) => {
    const testEmails = [
      { email: 'notanemail', valid: false },
      { email: '@example.com', valid: false },
      { email: 'user@', valid: false },
      { email: 'user@example', valid: false },
      { email: 'user@example.com', valid: true }
    ];

    for (const test of testEmails) {
      // Fill form with test email
      await page.locator('[data-testid="first-name-input"]').fill('John');
      await page.locator('[data-testid="last-name-input"]').fill('Doe');
      await page.locator('[data-testid="email-input"]').fill(test.email);
      await page.locator('[data-testid="address-input"]').fill('123 Main St');
      await page.locator('[data-testid="city-input"]').fill('New York');
      await page.locator('[data-testid="postal-code-input"]').fill('10001');

      // Submit
      await page.locator('[data-testid="submit-order-button"]').click();

      // Check result
      const errorMsg = page.locator('[data-testid="error-email"]');
      
      if (test.valid) {
        // Should NOT show error - page should navigate or stay on form after successful validation
        // For invalid emails, there should be an error
        await page.waitForTimeout(100); // Brief wait
        // Continue to next test
      } else {
        await expect(errorMsg).toBeVisible();
      }

      // Reset for next test (if not successful, navigate back)
      if (!test.valid) {
        await page.goto('/checkout');
      }
    }
  });

  // Payment Method Tests
  test.describe('Payment Methods', () => {
    test('should display payment method options', async ({ page }) => {
      // Check all payment method radio buttons
      const creditCardRadio = page.locator('[data-testid="payment-credit-card"]');
      const paypalRadio = page.locator('[data-testid="payment-paypal"]');
      const bankRadio = page.locator('[data-testid="payment-bank"]');

      await expect(creditCardRadio).toBeVisible();
      await expect(paypalRadio).toBeVisible();
      await expect(bankRadio).toBeVisible();

      // Credit card should be selected by default
      await expect(creditCardRadio).toBeChecked();
    });

    test('should show credit card fields when credit card is selected', async ({ page }) => {
      // Credit card should be selected by default
      await expect(page.locator('[data-testid="payment-credit-card"]')).toBeChecked();

      // Check credit card fields are visible
      await expect(page.locator('[data-testid="card-name-input"]')).toBeVisible();
      await expect(page.locator('[data-testid="card-number-input"]')).toBeVisible();
      await expect(page.locator('[data-testid="expiry-date-input"]')).toBeVisible();
      await expect(page.locator('[data-testid="cvv-input"]')).toBeVisible();
    });

    test('should switch to PayPal fields when PayPal is selected', async ({ page }) => {
      // Click PayPal radio
      await page.locator('[data-testid="payment-paypal"]').click();

      // PayPal email field should be visible
      const paypalEmailInput = page.locator('[data-testid="paypal-email-input"]');
      await expect(paypalEmailInput).toBeVisible();

      // Credit card fields should not be visible
      const cardNameInput = page.locator('[data-testid="card-name-input"]');
      await expect(cardNameInput).not.toBeVisible();
    });

    test('should switch to bank transfer fields when bank is selected', async ({ page }) => {
      // Click Bank Transfer radio
      await page.locator('[data-testid="payment-bank"]').click();

      // Bank fields should be visible
      const bankAccountInput = page.locator('[data-testid="bank-account-input"]');
      const bankCodeInput = page.locator('[data-testid="bank-code-input"]');
      await expect(bankAccountInput).toBeVisible();
      await expect(bankCodeInput).toBeVisible();

      // Credit card fields should not be visible
      const cardNameInput = page.locator('[data-testid="card-name-input"]');
      await expect(cardNameInput).not.toBeVisible();
    });

    test('should validate credit card - missing cardholder name', async ({ page }) => {
      // Fill user details
      await page.locator('[data-testid="first-name-input"]').fill('John');
      await page.locator('[data-testid="last-name-input"]').fill('Doe');
      await page.locator('[data-testid="email-input"]').fill('john@example.com');
      await page.locator('[data-testid="address-input"]').fill('123 Main St');
      await page.locator('[data-testid="city-input"]').fill('New York');
      await page.locator('[data-testid="postal-code-input"]').fill('10001');

      // Fill credit card but skip cardholder name
      await page.locator('[data-testid="card-number-input"]').fill('1234567890123456');
      await page.locator('[data-testid="expiry-date-input"]').fill('12/25');
      await page.locator('[data-testid="cvv-input"]').fill('123');

      // Submit
      await page.locator('[data-testid="submit-order-button"]').click();

      // Check error
      const errorMsg = page.locator('[data-testid="error-cardName"]');
      await expect(errorMsg).toBeVisible();
      await expect(errorMsg).toContainText('Cardholder name required');
    });

    test('should validate credit card - invalid card number', async ({ page }) => {
      // Fill user details
      await page.locator('[data-testid="first-name-input"]').fill('John');
      await page.locator('[data-testid="last-name-input"]').fill('Doe');
      await page.locator('[data-testid="email-input"]').fill('john@example.com');
      await page.locator('[data-testid="address-input"]').fill('123 Main St');
      await page.locator('[data-testid="city-input"]').fill('New York');
      await page.locator('[data-testid="postal-code-input"]').fill('10001');

      // Fill credit card with invalid card number (less than 16 digits)
      await page.locator('[data-testid="card-name-input"]').fill('John Doe');
      await page.locator('[data-testid="card-number-input"]').fill('123456789012345'); // 15 digits
      await page.locator('[data-testid="expiry-date-input"]').fill('12/25');
      await page.locator('[data-testid="cvv-input"]').fill('123');

      // Submit
      await page.locator('[data-testid="submit-order-button"]').click();

      // Check error
      const errorMsg = page.locator('[data-testid="error-cardNumber"]');
      await expect(errorMsg).toBeVisible();
      await expect(errorMsg).toContainText('Card number must be 16 digits');
    });

    test('should validate credit card - invalid expiry format', async ({ page }) => {
      // Fill user details
      await page.locator('[data-testid="first-name-input"]').fill('John');
      await page.locator('[data-testid="last-name-input"]').fill('Doe');
      await page.locator('[data-testid="email-input"]').fill('john@example.com');
      await page.locator('[data-testid="address-input"]').fill('123 Main St');
      await page.locator('[data-testid="city-input"]').fill('New York');
      await page.locator('[data-testid="postal-code-input"]').fill('10001');

      // Fill credit card with invalid expiry
      await page.locator('[data-testid="card-name-input"]').fill('John Doe');
      await page.locator('[data-testid="card-number-input"]').fill('1234567890123456');
      await page.locator('[data-testid="expiry-date-input"]').fill('1225'); // Invalid format
      await page.locator('[data-testid="cvv-input"]').fill('123');

      // Submit
      await page.locator('[data-testid="submit-order-button"]').click();

      // Check error
      const errorMsg = page.locator('[data-testid="error-expiryDate"]');
      await expect(errorMsg).toBeVisible();
      await expect(errorMsg).toContainText('Expiry must be MM/YY');
    });

    test('should validate credit card - invalid CVV', async ({ page }) => {
      // Fill user details
      await page.locator('[data-testid="first-name-input"]').fill('John');
      await page.locator('[data-testid="last-name-input"]').fill('Doe');
      await page.locator('[data-testid="email-input"]').fill('john@example.com');
      await page.locator('[data-testid="address-input"]').fill('123 Main St');
      await page.locator('[data-testid="city-input"]').fill('New York');
      await page.locator('[data-testid="postal-code-input"]').fill('10001');

      // Fill credit card with invalid CVV
      await page.locator('[data-testid="card-name-input"]').fill('John Doe');
      await page.locator('[data-testid="card-number-input"]').fill('1234567890123456');
      await page.locator('[data-testid="expiry-date-input"]').fill('12/25');
      await page.locator('[data-testid="cvv-input"]').fill('12'); // Only 2 digits

      // Submit
      await page.locator('[data-testid="submit-order-button"]').click();

      // Check error
      const errorMsg = page.locator('[data-testid="error-cvv"]');
      await expect(errorMsg).toBeVisible();
      await expect(errorMsg).toContainText('CVV must be 3 digits');
    });

    test('should validate PayPal - missing email', async ({ page }) => {
      // Select PayPal
      await page.locator('[data-testid="payment-paypal"]').click();

      // Fill user details
      await page.locator('[data-testid="first-name-input"]').fill('John');
      await page.locator('[data-testid="last-name-input"]').fill('Doe');
      await page.locator('[data-testid="email-input"]').fill('john@example.com');
      await page.locator('[data-testid="address-input"]').fill('123 Main St');
      await page.locator('[data-testid="city-input"]').fill('New York');
      await page.locator('[data-testid="postal-code-input"]').fill('10001');

      // Don't fill PayPal email - submit
      await page.locator('[data-testid="submit-order-button"]').click();

      // Check error
      const errorMsg = page.locator('[data-testid="error-paypalEmail"]');
      await expect(errorMsg).toBeVisible();
      await expect(errorMsg).toContainText('PayPal email required');
    });

    test('should validate PayPal - invalid email format', async ({ page }) => {
      // Select PayPal
      await page.locator('[data-testid="payment-paypal"]').click();

      // Fill user details
      await page.locator('[data-testid="first-name-input"]').fill('John');
      await page.locator('[data-testid="last-name-input"]').fill('Doe');
      await page.locator('[data-testid="email-input"]').fill('john@example.com');
      await page.locator('[data-testid="address-input"]').fill('123 Main St');
      await page.locator('[data-testid="city-input"]').fill('New York');
      await page.locator('[data-testid="postal-code-input"]').fill('10001');

      // Fill PayPal email with invalid format
      await page.locator('[data-testid="paypal-email-input"]').fill('invalid-email');

      // Submit
      await page.locator('[data-testid="submit-order-button"]').click();

      // Check error
      const errorMsg = page.locator('[data-testid="error-paypalEmail"]');
      await expect(errorMsg).toBeVisible();
      await expect(errorMsg).toContainText('Invalid email format');
    });

    test('should validate bank transfer - missing account number', async ({ page }) => {
      // Select bank transfer
      await page.locator('[data-testid="payment-bank"]').click();

      // Fill user details
      await page.locator('[data-testid="first-name-input"]').fill('John');
      await page.locator('[data-testid="last-name-input"]').fill('Doe');
      await page.locator('[data-testid="email-input"]').fill('john@example.com');
      await page.locator('[data-testid="address-input"]').fill('123 Main St');
      await page.locator('[data-testid="city-input"]').fill('New York');
      await page.locator('[data-testid="postal-code-input"]').fill('10001');

      // Only fill bank code, skip account number
      await page.locator('[data-testid="bank-code-input"]').fill('SWIFT123');

      // Submit
      await page.locator('[data-testid="submit-order-button"]').click();

      // Check error
      const errorMsg = page.locator('[data-testid="error-bankAccount"]');
      await expect(errorMsg).toBeVisible();
      await expect(errorMsg).toContainText('Account number required');
    });

    test('should validate bank transfer - missing bank code', async ({ page }) => {
      // Select bank transfer
      await page.locator('[data-testid="payment-bank"]').click();

      // Fill user details
      await page.locator('[data-testid="first-name-input"]').fill('John');
      await page.locator('[data-testid="last-name-input"]').fill('Doe');
      await page.locator('[data-testid="email-input"]').fill('john@example.com');
      await page.locator('[data-testid="address-input"]').fill('123 Main St');
      await page.locator('[data-testid="city-input"]').fill('New York');
      await page.locator('[data-testid="postal-code-input"]').fill('10001');

      // Only fill account number, skip bank code
      await page.locator('[data-testid="bank-account-input"]').fill('123456789');

      // Submit
      await page.locator('[data-testid="submit-order-button"]').click();

      // Check error
      const errorMsg = page.locator('[data-testid="error-bankCode"]');
      await expect(errorMsg).toBeVisible();
      await expect(errorMsg).toContainText('Bank code required');
    });

    test('should successfully place order with credit card', async ({ page }) => {
      // Fill user details
      await page.locator('[data-testid="first-name-input"]').fill('John');
      await page.locator('[data-testid="last-name-input"]').fill('Doe');
      await page.locator('[data-testid="email-input"]').fill('john@example.com');
      await page.locator('[data-testid="address-input"]').fill('123 Main St');
      await page.locator('[data-testid="city-input"]').fill('New York');
      await page.locator('[data-testid="postal-code-input"]').fill('10001');

      // Fill credit card
      await page.locator('[data-testid="card-name-input"]').fill('John Doe');
      await page.locator('[data-testid="card-number-input"]').fill('1234567890123456');
      await page.locator('[data-testid="expiry-date-input"]').fill('12/25');
      await page.locator('[data-testid="cvv-input"]').fill('123');

      // Submit
      await page.locator('[data-testid="submit-order-button"]').click();

      // Check success
      await page.waitForNavigation();
      const successMsg = page.locator('[data-testid="order-success-message"]');
      await expect(successMsg).toBeVisible();
    });

    test('should successfully place order with PayPal', async ({ page }) => {
      // Select PayPal
      await page.locator('[data-testid="payment-paypal"]').click();

      // Fill user details
      await page.locator('[data-testid="first-name-input"]').fill('Jane');
      await page.locator('[data-testid="last-name-input"]').fill('Smith');
      await page.locator('[data-testid="email-input"]').fill('jane@example.com');
      await page.locator('[data-testid="address-input"]').fill('456 Oak Ave');
      await page.locator('[data-testid="city-input"]').fill('Los Angeles');
      await page.locator('[data-testid="postal-code-input"]').fill('90001');

      // Fill PayPal email
      await page.locator('[data-testid="paypal-email-input"]').fill('jane.paypal@example.com');

      // Submit
      await page.locator('[data-testid="submit-order-button"]').click();

      // Check success
      await page.waitForNavigation();
      const successMsg = page.locator('[data-testid="order-success-message"]');
      await expect(successMsg).toBeVisible();
    });

    test('should successfully place order with bank transfer', async ({ page }) => {
      // Select bank transfer
      await page.locator('[data-testid="payment-bank"]').click();

      // Fill user details
      await page.locator('[data-testid="first-name-input"]').fill('Bob');
      await page.locator('[data-testid="last-name-input"]').fill('Johnson');
      await page.locator('[data-testid="email-input"]').fill('bob@example.com');
      await page.locator('[data-testid="address-input"]').fill('789 Pine Rd');
      await page.locator('[data-testid="city-input"]').fill('Chicago');
      await page.locator('[data-testid="postal-code-input"]').fill('60601');

      // Fill bank details
      await page.locator('[data-testid="bank-account-input"]').fill('987654321');
      await page.locator('[data-testid="bank-code-input"]').fill('SWIFT789');

      // Submit
      await page.locator('[data-testid="submit-order-button"]').click();

      // Check success
      await page.waitForNavigation();
      const successMsg = page.locator('[data-testid="order-success-message"]');
      await expect(successMsg).toBeVisible();
    });
  });
});
