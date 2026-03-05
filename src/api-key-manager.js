import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, updateDoc, serverTimestamp } from 'firebase/firestore';

// Get all active API keys
export const getActiveKeys = async (type = 'gemini') => {
  try {
    const q = query(
      collection(db, 'api_keys'),
      where('type', '==', type),
      where('status', '==', 'active')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting active keys:', error);
    return [];
  }
};

// Add new API key (admin only)
export const addApiKey = async (keyData) => {
  try {
    const docRef = await addDoc(collection(db, 'api_keys'), {
      ...keyData,
      status: 'active',
      usageCount: 0,
      createdAt: serverTimestamp(),
      lastUsed: null
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding API key:', error);
    throw error;
  }
};

// Delete API key (admin only)
export const deleteApiKey = async (keyId) => {
  try {
    await deleteDoc(doc(db, 'api_keys', keyId));
  } catch (error) {
    console.error('Error deleting API key:', error);
    throw error;
  }
};

// Update key status
export const updateKeyStatus = async (keyId, status) => {
  try {
    await updateDoc(doc(db, 'api_keys', keyId), { status });
  } catch (error) {
    console.error('Error updating key status:', error);
    throw error;
  }
};

// Test API key validity
export const testApiKey = async (key, type = 'gemini') => {
  try {
    if (type === 'gemini') {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      return response.ok;
    }
    return false;
  } catch (error) {
    console.error('Error testing API key:', error);
    return false;
  }
};

// Increment usage count
export const incrementKeyUsage = async (keyId) => {
  try {
    const keyRef = doc(db, 'api_keys', keyId);
    await updateDoc(keyRef, {
      usageCount: (await getDocs(query(collection(db, 'api_keys'), where('__name__', '==', keyId)))).docs[0]?.data()?.usageCount + 1 || 1,
      lastUsed: serverTimestamp()
    });
  } catch (error) {
    console.error('Error incrementing usage:', error);
  }
};

// Get all keys (admin only)
export const getAllKeys = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'api_keys'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
};
