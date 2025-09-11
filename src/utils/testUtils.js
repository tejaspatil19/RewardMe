/**
 * Test utilities for testing reward calculations and components
 */

// Mock transaction data for testing
export const mockTransactions = [
  {
    id: 'TEST001',
    customerId: 'CUST001',
    customerName: 'John Doe',
    purchaseDate: '2024-01-15',
    productPurchased: 'Test Product 1',
    price: 120.00,
    rewardPoints: 90
  },
  {
    id: 'TEST002',
    customerId: 'CUST001',
    customerName: 'John Doe',
    purchaseDate: '2024-01-20',
    productPurchased: 'Test Product 2',
    price: 75.50,
    rewardPoints: 25
  },
  {
    id: 'TEST003',
    customerId: 'CUST002',
    customerName: 'Jane Smith',
    purchaseDate: '2024-02-10',
    productPurchased: 'Test Product 3',
    price: 200.00,
    rewardPoints: 250
  },
  {
    id: 'TEST004',
    customerId: 'CUST001',
    customerName: 'John Doe',
    purchaseDate: '2024-02-15',
    productPurchased: 'Test Product 4',
    price: 45.00,
    rewardPoints: 0
  }
];

// Mock API responses
export const mockApiResponses = {
  transactions: {
    success: mockTransactions,
    error: new Error('Network error'),
    empty: []
  }
};

// Test data for edge cases
export const edgeTestCases = [
  { price: 0, expectedPoints: 0, description: 'Zero purchase' },
  { price: 49.99, expectedPoints: 0, description: 'Just under $50' },
  { price: 50.00, expectedPoints: 0, description: 'Exactly $50' },
  { price: 50.01, expectedPoints: 0, description: 'Just over $50' },
  { price: 75.00, expectedPoints: 25, description: 'Mid-range purchase' },
  { price: 99.99, expectedPoints: 49, description: 'Just under $100' },
  { price: 100.00, expectedPoints: 50, description: 'Exactly $100' },
  { price: 100.01, expectedPoints: 50, description: 'Just over $100' },
  { price: 120.00, expectedPoints: 90, description: 'Over $100 purchase' },
  { price: 150.50, expectedPoints: 151, description: 'Decimal price calculation' }
];

// Helper function to create test transactions
export const createTestTransaction = (overrides = {}) => ({
  id: 'TEST_DEFAULT',
  customerId: 'CUST_DEFAULT',
  customerName: 'Test Customer',
  purchaseDate: '2024-01-01',
  productPurchased: 'Test Product',
  price: 100.00,
  rewardPoints: 50,
  ...overrides
});

// Helper function to create multiple test transactions
export const createTestTransactions = (count = 3, baseTransaction = {}) => {
  return Array.from({ length: count }, (_, index) =>
    createTestTransaction({
      id: `TEST_${index + 1}`,
      customerId: `CUST_${index + 1}`,
      customerName: `Test Customer ${index + 1}`,
      ...baseTransaction
    })
  );
};