
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
        <div className="header-right">
          <div className={`server-status ${serverStatus ? 'online' : 'offline'}`}>
            <div className="status-indicator" />
            <span className="status-text">
              Server {serverStatus ? 'Online' : 'Offline'}
            </span>
          </div>
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