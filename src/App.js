
import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import MonthlyRewardsTable from './components/MonthlyRewardsTable/MonthlyRewardsTable';
import TotalRewardsTable from './components/TotalRewardsTable/TotalRewardsTable';
import TransactionsTable from './components/TransactionsTable/TransactionsTable';
import { fetchTransactions } from './services/apiService';
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


  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const transactionsData = await fetchTransactions();
      const processedTransactions = processTransactions(transactionsData);
      setTransactions(sortTransactionsByDate(processedTransactions));
      setMonthlyRewards(calculateMonthlyRewards(processedTransactions));
      setTotalRewards(calculateTotalRewards(processedTransactions));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    logger.info('App component mounted');
    loadData();

    return () => {
      logger.info('App component unmounted');
    };
  }, []);


  const handleRetry = () => {
    logger.info('Retrying data load');
    loadData();
  };

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <div className="container">
          {/* Debug message if no transactions loaded */}
          {transactions.length === 0 && !isLoading && !error && (
            <div style={{color: 'red', marginBottom: '16px'}}>
              No transactions found. Please check your db.json file in the public folder and ensure it contains valid data.
            </div>
          )}
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
