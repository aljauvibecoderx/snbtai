import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { NotificationProvider } from './NotificationSystem';
import App from './App';

function AppWrapper() {
  return (
    <Router>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </Router>
  );
}

export default AppWrapper;
