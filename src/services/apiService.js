/**
 * API service for fetching data from the JSON server
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

/**
 * Create axios instance with base configuration
 */
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch all transactions from the API
 * @returns {Promise<Array>} - Promise resolving to transactions array
 */
export const fetchTransactions = async () => {
  try {
    const response = await api.get('/transactions');
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions. Please check if the server is running.');
  }
};

/**
 * Fetch all customers from the API
 * @returns {Promise<Array>} - Promise resolving to customers array
 */
export const fetchCustomers = async () => {
  try {
    const response = await api.get('/customers');
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw new Error('Failed to fetch customers. Please check if the server is running.');
  }
};

/**
 * Fetch transactions for a specific customer
 * @param {string} customerId - Customer ID
 * @returns {Promise<Array>} - Promise resolving to transactions array
 */
export const fetchTransactionsByCustomer = async (customerId) => {
  try {
    const response = await api.get(`/transactions?customerId=${customerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions by customer:', error);
    throw new Error('Failed to fetch customer transactions.');
  }
};

/**
 * Health check for the API server
 * @returns {Promise<boolean>} - Promise resolving to server status
 */
export const checkServerHealth = async () => {
  try {
    await api.get('/transactions?_limit=1');
    return true;
  } catch (error) {
    return false;
  }
};

export default api;