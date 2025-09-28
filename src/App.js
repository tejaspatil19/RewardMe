
import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { fetchTransactions } from './services/apiService';
import {
  calculateMonthlyRewards,
  calculateTotalRewards,
  processTransactions,
  sortTransactionsByDate
} from './utils/rewardCalculations';
import logger from './utils/logger';
import './App.css';

import Dashboard from './components/Dashboard/Dashboard';

const App = () => {

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Dashboard />
      </main>
      <Footer />
    </div>
  );

};

export default App;
