// Example integration in App.js or DashboardView.js

import React from 'react';
import ProgressTracker from './components/ProgressTracker';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

const StudyProgressPage = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
        <p className="text-gray-600">Please login to track your study progress.</p>
      </div>
    );
  }

  return <ProgressTracker userId={user.uid} />;
};

export default StudyProgressPage;