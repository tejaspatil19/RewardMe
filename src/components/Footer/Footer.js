

import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Reward Program Rules</h4>
          <ul>
            <li>2 points per dollar spent over $100</li>
            <li>1 point per dollar spent between $50-$100</li>
            <li>No points for purchases under $50</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Features</h4>
          <ul>
            <li>Real-time reward calculations</li>
            <li>Monthly and total reward tracking</li>
            <li>Advanced filtering and sorting</li>
            <li>Responsive design</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>About</h4>
          <p>
            RewardMe is a customer rewards program dashboard that helps track
            and manage customer loyalty points based on purchase transactions.
          </p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} RewardMe. All rights reserved.</p>
        <p>Built with React.js and modern web technologies.</p>
      </div>
    </footer>
  );
};

export default Footer;