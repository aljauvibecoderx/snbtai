import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { NotificationProvider } from './components/common/NotificationSystem';

import { StatsProvider } from './context/StatsContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getUserData } from './services/firebase/firebase';
import App from './App';

function AppWrapper() {
  const [user, setUser] = useState(null);
  const [myQuestions, setMyQuestions] = useState([]);
  const [coinBalance, setCoinBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsDataReady(false);
      
      if (currentUser) {
        const data = await getUserData(currentUser.uid);
        const { getMyQuestions } = await import('./services/firebase/firebase');
        const questions = await getMyQuestions(currentUser.uid);
        
        setMyQuestions(questions);
        setCoinBalance(data?.coinBalance || 0);
        setIsDataReady(true);
      } else {
        setMyQuestions([]);
        setCoinBalance(0);
        setIsDataReady(true);
      }
      
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const reloadQuestions = async () => {
      const { getMyQuestions } = await import('./services/firebase/firebase');
      const questions = await getMyQuestions(user.uid);
      setMyQuestions(questions);
    };

    const interval = setInterval(reloadQuestions, 30000);
    return () => clearInterval(interval);
  }, [user]);

  if (isLoading || !isDataReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <NotificationProvider>
        <StatsProvider user={user} myQuestions={myQuestions} coinBalance={coinBalance}>
          <App />
        </StatsProvider>
      </NotificationProvider>
    </Router>
  );
}

export default AppWrapper;
