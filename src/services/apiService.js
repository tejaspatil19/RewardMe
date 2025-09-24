
const api = {
  baseurl: process.env.PUBLIC_URL || '',
  mockDataPath: '/db.json'
};

export const fetchDbJson = async () => {
  const response = await fetch(api.baseurl + api.mockDataPath);
  if (!response.ok) throw new Error('Failed to fetch db.json');
  return await response.json();
};

export const fetchTransactions = async () => {
  const db = await fetchDbJson();
  return db.transactions || [];
};


export const fetchTransactionsByCustomer = async (customerId) => {
  const db = await fetchDbJson();
  return (db.transactions || []).filter(tx => tx.customerId === customerId);
};

