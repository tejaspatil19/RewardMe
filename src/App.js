/**
 * Main App Component
 * Customer Rewards Program Dashboard
 */

import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import MonthlyRewardsTable from './components/MonthlyRewardsTable/MonthlyRewardsTable';
import TotalRewardsTable from './components/TotalRewardsTable/TotalRewardsTable';
import TransactionsTable from './components/TransactionsTable/TransactionsTable';
import { fetchTransactions, checkServerHealth } from './services/apiService';
import {
  calculateMonthlyRewards,
  calculateTotalRewards,
  processTransactions,
  sortTransactionsByDate
} from './utils/rewardCalculations';
import logger from './utils/logger';
import './App.css';

const App = () => {
  // Application state
  const [transactions, setTransactions] = useState([]);
  const [monthlyRewards, setMonthlyRewards] = useState([]);
  const [totalRewards, setTotalRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState(false);

  // Check server health
  const checkServer = useCallback(async () => {
    try {
      const isHealthy = await checkServerHealth();
      setServerStatus(isHealthy);
      return isHealthy;
    } catch (err) {
      setServerStatus(false);
      return false;
    }
  }, []);

  // Load data from API and process calculations
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const startTime = performance.now();

      logger.info('Starting data load process');

      // Check server health first
      const isServerHealthy = await checkServer();
      if (!isServerHealthy) {
        throw new Error('Unable to connect to the server. Please ensure the JSON server is running on port 3001.');
      }

      // Fetch transactions
      const transactionsData = await fetchTransactions();
      logger.info('Transactions fetched successfully', { count: transactionsData.length });

      // Process transactions with calculated reward points
      const processedTransactions = processTransactions(transactionsData);
      
      // Sort transactions by date (newest first)
      const sortedTransactions = sortTransactionsByDate(processedTransactions);

      // Calculate monthly and total rewards
      const monthlyData = calculateMonthlyRewards(processedTransactions);
      const totalData = calculateTotalRewards(processedTransactions);

      // Update state
      setTransactions(sortedTransactions);
      setMonthlyRewards(monthlyData);
      setTotalRewards(totalData);

      const endTime = performance.now();
      logger.performance('Data loading', endTime - startTime);
      logger.info('Data processing completed successfully');

    } catch (err) {
      logger.error('Failed to load data', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [checkServer]);

  // Initialize app
  useEffect(() => {
    logger.info('App component mounted');
    loadData();

    // Set up periodic server health checks
    const healthCheckInterval = setInterval(checkServer, 30000); // Check every 30 seconds

    return () => {
      clearInterval(healthCheckInterval);
      logger.info('App component unmounted');
    };
  }, [loadData, checkServer]);

  // Retry data loading
  const handleRetry = () => {
    logger.info('Retrying data load');
    loadData();
  };

  // Render error state if there's a critical error
  if (error) {
    return (
      <div className="App">
        <Header serverStatus={serverStatus} />
        <main className="main-content">
          <div className="container">
            <div className="error-banner">
              <div className="error-content">
                <h3>Unable to Load Data</h3>
                <p>{error}</p>
                <button 
                  onClick={handleRetry}
                  className="retry-button"
                  type="button"
                >
                  Retry Loading
                </button>
                
                <div className="server-help">
                  <p><strong>To start the JSON server:</strong></p>
                  <code>npm run start:server</code>
                  <p>The server should be running on http://localhost:3001</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="App">
      <Header serverStatus={serverStatus} />
      
      <main className="main-content">
        <div className="container">
          {/* Monthly Rewards Table */}
          <section className="dashboard-section">
            <MonthlyRewardsTable
              data={monthlyRewards}
              isLoading={isLoading}
              error={error}
            />
          </section>

          {/* Total Rewards Table */}
          <section className="dashboard-section">
            <TotalRewardsTable
              data={totalRewards}
              isLoading={isLoading}
              error={error}
            />
          </section>

          {/* Transactions Table */}
          <section className="dashboard-section">
            <TransactionsTable
              data={transactions}
              isLoading={isLoading}
              error={error}
            />
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default App;
