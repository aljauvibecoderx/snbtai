// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "YOUR_APP_ID",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "YOUR_MEASUREMENT_ID"
};

// Gemini API Keys with rotation
export const GEMINI_KEYS = [
  {
    name: 'Key 1',
    key: process.env.REACT_APP_GEMINI_KEY_1 || 'YOUR_GEMINI_KEY_1'
  },
  {
    name: 'Key 2',
    key: process.env.REACT_APP_GEMINI_KEY_2 || 'YOUR_GEMINI_KEY_2'
  },
  {
    name: 'Key 3',
    key: process.env.REACT_APP_GEMINI_KEY_3 || 'YOUR_GEMINI_KEY_3'
  }
];

// HuggingFace API Key
export const HF_API_KEY = process.env.REACT_APP_HF_API_KEY || 'YOUR_HF_API_KEY';

// Backend URL
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://snbtaibackends.vercel.app';

// Key cache functions (for AdminDashboard compatibility)
export const resetKeyCache = () => {
  // No-op function for compatibility
};