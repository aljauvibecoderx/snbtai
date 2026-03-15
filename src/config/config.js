// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBF_DthO5AGtmkDdkrN16xmh1Aezx96b6I",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "snbt-ai.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "snbt-ai",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "snbt-ai.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "964244124159",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:964244124159:web:9bad74dfd5b415f8f677ca",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-VXVR2CS78P"
};

// Gemini API Keys with rotation
export const GEMINI_KEYS = [
  {
    name: 'Key 1',
    key: process.env.REACT_APP_GEMINI_KEY_1 || 'AIzaSyDR6H2DPq6sLWMFMBP7cjuXPOE9ObbuBKY'
  },
  {
    name: 'Key 2',
    key: process.env.REACT_APP_GEMINI_KEY_2 || 'AIzaSyA9h5xLyh8BAPps__JDQwgi2A29vEh_lzo'
  },
  {
    name: 'Key 3',
    key: process.env.REACT_APP_GEMINI_KEY_3 || 'AIzaSyBJe81wydexe8Gf4DYuSHaRpY2OfO7OiSY'
  }
];

// HuggingFace API Key
export const HF_API_KEY = process.env.REACT_APP_HF_API_KEY || 'demo_hf_key';

// Backend URL
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://snbtaibackends.vercel.app';

// Key cache functions (for AdminDashboard compatibility)
export const resetKeyCache = () => {
  // No-op function for compatibility
};