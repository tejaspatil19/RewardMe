/**
 * Tests for reward calculation utilities
 */

import {
  calculateRewardPoints,
  calculateMonthlyRewards,
  calculateTotalRewards,
  processTransactions,
  sortTransactionsByDate,
  formatMonthYear,
  getMonthName,
  getYear,
  filterTransactionsByDateRange,
  getUniqueCustomers,
  getUniqueMonths
} from '../rewardCalculations';
import { mockTransactions, edgeTestCases, createTestTransaction } from '../testUtils';

describe('calculateRewardPoints', () => {
  test('should calculate 0 points for purchases under $50', () => {
    expect(calculateRewardPoints(49.99)).toBe(0);
    expect(calculateRewardPoints(25.00)).toBe(0);
    expect(calculateRewardPoints(0)).toBe(0);
  });

  test('should calculate 1 point per dollar between $50 and $100', () => {
    expect(calculateRewardPoints(50.00)).toBe(0); // Exactly $50 gets 0 points
    expect(calculateRewardPoints(75.00)).toBe(25); // $75 - $50 = $25 * 1 = 25 points
    expect(calculateRewardPoints(100.00)).toBe(50); // $100 - $50 = $50 * 1 = 50 points
  });

  test('should calculate correct points for purchases over $100', () => {
    expect(calculateRewardPoints(120.00)).toBe(90); // $50 * 1 + $20 * 2 = 90 points
    expect(calculateRewardPoints(150.00)).toBe(150); // $50 * 1 + $50 * 2 = 150 points
    expect(calculateRewardPoints(200.00)).toBe(250); // $50 * 1 + $100 * 2 = 250 points
  });

  test('should handle decimal amounts correctly', () => {
    expect(calculateRewardPoints(120.50)).toBe(91); // $50 * 1 + $20 * 2 = 90 points (floor)
    expect(calculateRewardPoints(150.75)).toBe(151); // $50 * 1 + $50 * 2 = 151 points (floor)
  });

  test('should handle edge cases', () => {
    edgeTestCases.forEach(({ price, expectedPoints, description }) => {
      expect(calculateRewardPoints(price)).toBe(expectedPoints);
    });
  });

  test('should handle invalid inputs', () => {
    expect(calculateRewardPoints(-1)).toBe(0);
    expect(calculateRewardPoints(null)).toBe(0);
    expect(calculateRewardPoints(undefined)).toBe(0);
    expect(calculateRewardPoints('invalid')).toBe(0);
  });
});

describe('formatMonthYear', () => {
  test('should format date correctly', () => {
    expect(formatMonthYear('2024-01-15')).toBe('01/2024');
    expect(formatMonthYear('2024-12-25')).toBe('12/2024');
    expect(formatMonthYear('2023-06-10')).toBe('06/2023');
  });
});

describe('getMonthName', () => {
  test('should return correct month name', () => {
    expect(getMonthName('2024-01-15')).toBe('January');
    expect(getMonthName('2024-12-25')).toBe('December');
    expect(getMonthName('2024-06-10')).toBe('June');
  });
});

describe('getYear', () => {
  test('should return correct year', () => {
    expect(getYear('2024-01-15')).toBe(2024);
    expect(getYear('2023-12-25')).toBe(2023);
    expect(getYear('2025-06-10')).toBe(2025);
  });
});

describe('processTransactions', () => {
  test('should add calculated reward points to transactions', () => {
    const transactions = [
      createTestTransaction({ price: 120.00, rewardPoints: undefined }),
      createTestTransaction({ price: 75.00, rewardPoints: undefined })
    ];

    const processed = processTransactions(transactions);

    expect(processed[0].rewardPoints).toBe(90);
    expect(processed[1].rewardPoints).toBe(25);
  });

  test('should not mutate original transactions', () => {
    const original = [createTestTransaction({ price: 120.00 })];
    const processed = processTransactions(original);

    expect(processed).not.toBe(original);
    expect(processed[0]).not.toBe(original[0]);
  });
});

describe('sortTransactionsByDate', () => {
  test('should sort transactions by date (newest first)', () => {
    const transactions = [
      createTestTransaction({ purchaseDate: '2024-01-01', id: 'OLD' }),
      createTestTransaction({ purchaseDate: '2024-03-01', id: 'NEW' }),
      createTestTransaction({ purchaseDate: '2024-02-01', id: 'MID' })
    ];

    const sorted = sortTransactionsByDate(transactions);

    expect(sorted[0].id).toBe('NEW');
    expect(sorted[1].id).toBe('MID');
    expect(sorted[2].id).toBe('OLD');
  });

  test('should not mutate original array', () => {
    const original = mockTransactions;
    const sorted = sortTransactionsByDate(original);

    expect(sorted).not.toBe(original);
  });
});

describe('calculateMonthlyRewards', () => {
  test('should calculate monthly rewards correctly', () => {
    const transactions = [
      createTestTransaction({
        customerId: 'CUST001',
        customerName: 'John Doe',
        purchaseDate: '2024-01-15',
        price: 120.00
      }),
      createTestTransaction({
        customerId: 'CUST001',
        customerName: 'John Doe',
        purchaseDate: '2024-01-20',
        price: 80.00
      }),
      createTestTransaction({
        customerId: 'CUST002',
        customerName: 'Jane Smith',
        purchaseDate: '2024-01-25',
        price: 150.00
      })
    ];

    const monthlyRewards = calculateMonthlyRewards(transactions);

    expect(monthlyRewards).toHaveLength(2);
    
    const johnRewards = monthlyRewards.find(r => r.customerId === 'CUST001');
    expect(johnRewards.rewardPoints).toBe(120); // 90 + 30 points
    expect(johnRewards.month).toBe('January');
    expect(johnRewards.year).toBe(2024);

    const janeRewards = monthlyRewards.find(r => r.customerId === 'CUST002');
    expect(janeRewards.rewardPoints).toBe(150); // 150 points
  });

  test('should handle multiple months for same customer', () => {
    const transactions = [
      createTestTransaction({
        customerId: 'CUST001',
        customerName: 'John Doe',
        purchaseDate: '2024-01-15',
        price: 120.00
      }),
      createTestTransaction({
        customerId: 'CUST001',
        customerName: 'John Doe',
        purchaseDate: '2024-02-15',
        price: 120.00
      })
    ];

    const monthlyRewards = calculateMonthlyRewards(transactions);

    expect(monthlyRewards).toHaveLength(2);
    expect(monthlyRewards.every(r => r.rewardPoints === 90)).toBe(true);
  });
});

describe('calculateTotalRewards', () => {
  test('should calculate total rewards for each customer', () => {
    const transactions = [
      createTestTransaction({
        customerId: 'CUST001',
        customerName: 'John Doe',
        price: 120.00
      }),
      createTestTransaction({
        customerId: 'CUST001',
        customerName: 'John Doe',
        price: 80.00
      }),
      createTestTransaction({
        customerId: 'CUST002',
        customerName: 'Jane Smith',
        price: 150.00
      })
    ];

    const totalRewards = calculateTotalRewards(transactions);

    expect(totalRewards).toHaveLength(2);
    
    const johnTotal = totalRewards.find(r => r.customerId === 'CUST001');
    expect(johnTotal.rewardPoints).toBe(120); // 90 + 30 points

    const janeTotal = totalRewards.find(r => r.customerId === 'CUST002');
    expect(janeTotal.rewardPoints).toBe(150); // 150 points
  });

  test('should sort by total rewards (highest first)', () => {
    const transactions = [
      createTestTransaction({
        customerId: 'CUST001',
        customerName: 'Low Spender',
        price: 60.00
      }),
      createTestTransaction({
        customerId: 'CUST002',
        customerName: 'High Spender',
        price: 200.00
      })
    ];

    const totalRewards = calculateTotalRewards(transactions);

    expect(totalRewards[0].customerName).toBe('High Spender');
    expect(totalRewards[1].customerName).toBe('Low Spender');
  });
});

describe('filterTransactionsByDateRange', () => {
  test('should filter transactions within date range', () => {
    const transactions = [
      createTestTransaction({ purchaseDate: '2024-01-01', id: 'BEFORE' }),
      createTestTransaction({ purchaseDate: '2024-02-15', id: 'WITHIN' }),
      createTestTransaction({ purchaseDate: '2024-04-01', id: 'AFTER' })
    ];

    const filtered = filterTransactionsByDateRange(
      transactions,
      '2024-02-01',
      '2024-03-31'
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('WITHIN');
  });
});

describe('getUniqueCustomers', () => {
  test('should return unique customer names sorted', () => {
    const transactions = [
      createTestTransaction({ customerName: 'John Doe' }),
      createTestTransaction({ customerName: 'Jane Smith' }),
      createTestTransaction({ customerName: 'John Doe' })
    ];

    const customers = getUniqueCustomers(transactions);

    expect(customers).toEqual(['Jane Smith', 'John Doe']);
  });
});

describe('getUniqueMonths', () => {
  test('should return unique months sorted in reverse order', () => {
    const transactions = [
      createTestTransaction({ purchaseDate: '2024-01-15' }),
      createTestTransaction({ purchaseDate: '2024-03-15' }),
      createTestTransaction({ purchaseDate: '2024-01-20' })
    ];

    const months = getUniqueMonths(transactions);

    expect(months).toEqual(['03/2024', '01/2024']);
  });
});