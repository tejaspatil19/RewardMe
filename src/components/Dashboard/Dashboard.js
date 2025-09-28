import { useState, useEffect } from 'react';
import MonthlyRewardsTable from '../MonthlyRewardsTable/MonthlyRewardsTable';
import TotalRewardsTable from '../TotalRewardsTable/TotalRewardsTable';
import TransactionsTable from '../TransactionsTable/TransactionsTable';
import { fetchTransactions } from '../../services/apiService';
import {
  calculateMonthlyRewards,
  calculateTotalRewards,
  processTransactions,
  sortTransactionsByDate
} from '../../utils/rewardCalculations';
import logger from '../../utils/logger';
import { Box, Container, Typography, Divider } from '@mui/material';

const Dashboard = () => {
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
    logger.info('Dashboard mounted');
    loadData();
    return () => {
      logger.info('Dashboard unmounted');
    };
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {transactions.length === 0 && !isLoading && !error && (
        <Typography color="error" sx={{ mb: 2 }}>
          No transactions found. Please check your db.json file in the public folder and ensure it contains valid data.
        </Typography>
      )}
      <Box sx={{ mb: 4 }}>
        <MonthlyRewardsTable
          data={monthlyRewards}
          isLoading={isLoading}
          error={error}
        />
      </Box>
      <Divider sx={{ my: 4 }} />
      <Box sx={{ mb: 4 }}>
        <TotalRewardsTable
          data={totalRewards}
          isLoading={isLoading}
          error={error}
        />
      </Box>
      <Divider sx={{ my: 4 }} />
      <Box>
        <TransactionsTable
          data={transactions}
          isLoading={isLoading}
          error={error}
        />
      </Box>
    </Container>
  );
};

export default Dashboard;
