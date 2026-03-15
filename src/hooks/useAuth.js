import { useState, useEffect, useRef } from 'react';
import { auth } from '../services/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * Custom hook for managing authentication state
 * @returns {Object} Authentication state and handlers
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, isLoading };
};
