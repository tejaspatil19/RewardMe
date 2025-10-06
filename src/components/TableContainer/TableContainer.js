import { useState, useEffect } from 'react';
import MonthlyRewardsTable from '../MonthlyRewardsTable/MonthlyRewardsTable';
import TotalRewardsTable from '../TotalRewardsTable/TotalRewardsTable';
import TransactionsTable from '../TransactionsTable/TransactionsTable';
import {
  calculateMonthlyRewards,
  calculateTotalRewards,
  processTransactions,
  sortTransactionsByDate
} from '../../utils/rewardCalculations';
import { Box, Container, Typography, Divider } from '@mui/material';

const TableContainer = () => {
  const [transactions, setTransactions] = useState([]);
  const [monthlyRewards, setMonthlyRewards] = useState([]);
  const [totalRewards, setTotalRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch('./db.json')
      .then((resp) => {
        if (!resp.ok) throw new Error('Failed to fetch db.json');
        return resp.json();
      })
      .then((data) => {
        const transactionsData = data.transactions || [];
        const processedTransactions = processTransactions(transactionsData);
        setTransactions(sortTransactionsByDate(processedTransactions));
        setMonthlyRewards(calculateMonthlyRewards(processedTransactions));
        setTotalRewards(calculateTotalRewards(processedTransactions));
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
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

export default TableContainer;
