
import React from 'react';
import PropTypes from 'prop-types';
import './Header.css';

const Header = ({ serverStatus }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">RewardMe</h1>
          <p className="app-subtitle">Customer Rewards Program Dashboard</p>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  serverStatus: PropTypes.bool
};

Header.defaultProps = {
  serverStatus: false
};

export default Header;