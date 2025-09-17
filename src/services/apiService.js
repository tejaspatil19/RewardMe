

import axios from 'axios';
import logger from '../utils/logger';

const BASE_URL = 'http://localhost:3001';


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
    logger.apiCall('get', '/transactions', response);
    return response.data;
  } catch (error) {
    logger.error('Error fetching transactions', error);
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
    logger.apiCall('get', '/customers', response);
    return response.data;
  } catch (error) {
  logger.error('Error fetching customers', error);
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
    logger.apiCall('get', `/transactions?customerId=${customerId}`, response);
    return response.data;
  } catch (error) {
  logger.error('Error fetching transactions by customer', error);
  throw new Error('Failed to fetch customer transactions.');
  }
};

/**
 * Health check for the API server
 * @returns {Promise<boolean>} - Promise resolving to server status
 */
export const checkServerHealth = async () => {
  try {
    const response = await api.get('/transactions?_limit=1');
    logger.apiCall('get', '/transactions?_limit=1', response);
    return true;
  } catch (error) {
  logger.error('Server health check failed', error);
  return false;
  }
};

export default api;