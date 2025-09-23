

import { useState, useEffect } from 'react';
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

  const [transactions, setTransactions] = useState([]);
  const [monthlyRewards, setMonthlyRewards] = useState([]);
  const [totalRewards, setTotalRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState(false);


  const checkServer = async () => {
    try {
      const isHealthy = await checkServerHealth();
      setServerStatus(isHealthy);
      return isHealthy;
    } catch (err) {
      setServerStatus(false);
      return false;
    }
  };


  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const startTime = performance.now();

      logger.info('Starting data load process');

      const isServerHealthy = await checkServer();
      if (!isServerHealthy) {
        throw new Error('Unable to connect to the server. Please ensure the JSON server is running on port 3001.');
      }

      const transactionsData = await fetchTransactions();
      logger.info('Transactions fetched successfully', { count: transactionsData.length });

      const processedTransactions = processTransactions(transactionsData);
      const sortedTransactions = sortTransactionsByDate(processedTransactions);
      const monthlyData = calculateMonthlyRewards(processedTransactions);
      const totalData = calculateTotalRewards(processedTransactions);

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
  };


  useEffect(() => {
    logger.info('App component mounted');
    loadData();

    const healthCheckInterval = setInterval(checkServer, 30000);

    return () => {
      clearInterval(healthCheckInterval);
      logger.info('App component unmounted');
    };
  }, []);


  const handleRetry = () => {
    logger.info('Retrying data load');
    loadData();
  };

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
