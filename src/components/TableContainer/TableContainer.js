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
import { Box, Container, Typography, Divider, TextField, Button, Grid } from '@mui/material';

const TableContainer = () => {
  const [transactions, setTransactions] = useState([]);
  const [monthlyRewards, setMonthlyRewards] = useState([]);
  const [totalRewards, setTotalRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Date filter state
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);

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
        const sorted = sortTransactionsByDate(processedTransactions);
        setTransactions(sorted);
        setFilteredTransactions(sorted); // Initially show all
        setMonthlyRewards(calculateMonthlyRewards(sorted));
        setTotalRewards(calculateTotalRewards(sorted));
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  // Filter handler
  const handleFilter = () => {
    let filtered = transactions;
    if (fromDate) {
      filtered = filtered.filter(
        (t) => new Date(t.purchaseDate) >= new Date(fromDate)
      );
    }
    if (toDate) {
      filtered = filtered.filter(
        (t) => new Date(t.purchaseDate) <= new Date(toDate)
      );
    }
    setFilteredTransactions(filtered);
    setMonthlyRewards(calculateMonthlyRewards(filtered));
    setTotalRewards(calculateTotalRewards(filtered));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <TextField
              label="From Date"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              label="To Date"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handleFilter}>
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>
      {filteredTransactions.length === 0 && !isLoading && !error && (
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
          data={filteredTransactions}
          isLoading={isLoading}
          error={error}
        />
      </Box>
    </Container>
  );
};

export default TableContainer;
