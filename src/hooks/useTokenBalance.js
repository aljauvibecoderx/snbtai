import { useState, useEffect } from 'react';

export const useTokenBalance = () => {
  const [tokenBalance, setTokenBalance] = useState(() => 
    parseInt(localStorage.getItem('ambisTokenBalance') || '0')
  );

  useEffect(() => {
    const updateBalance = () => {
      setTokenBalance(parseInt(localStorage.getItem('ambisTokenBalance') || '0'));
    };
    
    window.addEventListener('storage', updateBalance);
    return () => window.removeEventListener('storage', updateBalance);
  }, []);

  return tokenBalance;
};
