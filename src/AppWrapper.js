import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { NotificationProvider } from './components/common/NotificationSystem';
import { CoinProvider } from './context/CoinContext';
import App from './App';

function AppWrapper() {
  return (
    <Router>
      <NotificationProvider>
        <CoinProvider>
          <App />
        </CoinProvider>
      </NotificationProvider>
    </Router>
  );
}

export default AppWrapper;
