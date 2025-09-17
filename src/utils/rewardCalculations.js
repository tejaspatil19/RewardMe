

/**
 * Calculate reward points for a given purchase amount
 * Rules: 2 points per dollar over $100, 1 point per dollar between $50-$100
 * @param {number} amount - Purchase amount in dollars
 * @returns {number} - Calculated reward points
 */
export const calculateRewardPoints = (amount) => {
  if (typeof amount !== 'number' || amount < 0) {
    return 0;
  }

  let points = 0;
  
  // 2 points for every dollar over $100
  if (amount > 100) {
    points += Math.floor((amount - 100) * 2);
  }
  
  // 1 point for every dollar between $50 and $100
  const amountForSinglePoints = Math.min(amount, 100) - Math.max(Math.min(amount, 50), 0);
  if (amountForSinglePoints > 0) {
    points += Math.floor(amountForSinglePoints);
  }
  
  return points;
};

/**
 * Format date string to MM/YYYY format for grouping
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} - Formatted date as MM/YYYY
 */
export const formatMonthYear = (dateString) => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${year}`;
};

/**
 * Get month name from date string
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} - Month name
 */
export const getMonthName = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('default', { month: 'long' });
};

/**
 * Get year from date string
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {number} - Year
 */
export const getYear = (dateString) => {
  const date = new Date(dateString);
  return date.getFullYear();
};

/**
 * Sort transactions by date (newest first)
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} - Sorted transactions array
 */
export const sortTransactionsByDate = (transactions) => {
  return [...transactions].sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
};

/**
 * Group transactions by customer and calculate monthly rewards
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} - Array of monthly reward objects
 */
export const calculateMonthlyRewards = (transactions) => {
  const monthlyRewards = transactions.reduce((acc, transaction) => {
    const customerId = transaction.customerId;
    const customerName = transaction.customerName;
    const monthYear = formatMonthYear(transaction.purchaseDate);
    const month = getMonthName(transaction.purchaseDate);
    const year = getYear(transaction.purchaseDate);
    const points = calculateRewardPoints(transaction.price);
    
    const key = `${customerId}-${monthYear}`;
    
    if (!acc[key]) {
      acc[key] = {
        customerId,
        customerName,
        month,
        year,
        monthYear,
        rewardPoints: 0
      };
    }
    
    acc[key].rewardPoints += points;
    
    return acc;
  }, {});
  
  return Object.values(monthlyRewards)
    .sort((a, b) => {
     
      if (a.year !== b.year) return b.year - a.year;
      if (a.month !== b.month) {
        const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        return monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month);
      }
      return a.customerName.localeCompare(b.customerName);
    });
};

/**
 * Calculate total rewards for each customer
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} - Array of total reward objects
 */
export const calculateTotalRewards = (transactions) => {
  const totalRewards = transactions.reduce((acc, transaction) => {
    const customerId = transaction.customerId;
    const customerName = transaction.customerName;
    const points = calculateRewardPoints(transaction.price);
    
    if (!acc[customerId]) {
      acc[customerId] = {
        customerId,
        customerName,
        rewardPoints: 0
      };
    }
    
    acc[customerId].rewardPoints += points;
    
    return acc;
  }, {});
  
  return Object.values(totalRewards)
    .sort((a, b) => b.rewardPoints - a.rewardPoints);
};

/**
 * Process transactions to add calculated reward points
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} - Processed transactions with calculated points
 */
export const processTransactions = (transactions) => {
  return transactions.map(transaction => ({
    ...transaction,
    rewardPoints: calculateRewardPoints(transaction.price)
  }));
};

/**
 * Filter transactions by date range
 * @param {Array} transactions - Array of transaction objects
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Array} - Filtered transactions
 */
export const filterTransactionsByDateRange = (transactions, startDate, endDate) => {
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.purchaseDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return transactionDate >= start && transactionDate <= end;
  });
};

/**
 * Get unique customer names from transactions
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} - Array of unique customer names
 */
export const getUniqueCustomers = (transactions) => {
  const customers = new Set(transactions.map(t => t.customerName));
  return Array.from(customers).sort();
};

/**
 * Get unique months from transactions
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} - Array of unique month/year combinations
 */
export const getUniqueMonths = (transactions) => {
  const months = new Set(transactions.map(t => formatMonthYear(t.purchaseDate)));
  return Array.from(months).sort().reverse();
};