import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const COLLECTION_NAME = 'api_keys';

export const getAllKeys = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return [];
  }
};

export const addApiKey = async (data) => {
  try {
    const newKeyRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      status: 'active',
      usageCount: 0,
      createdAt: serverTimestamp(),
      lastUsed: null
    });
    return newKeyRef.id;
  } catch (error) {
    console.error('Error adding API key:', error);
    throw error;
  }
};

export const deleteApiKey = async (keyId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, keyId));
  } catch (error) {
    console.error('Error deleting API key:', error);
    throw error;
  }
};

export const updateKeyStatus = async (keyId, newStatus) => {
  try {
    const keyRef = doc(db, COLLECTION_NAME, keyId);
    await updateDoc(keyRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating API key status:', error);
    throw error;
  }
};

export const testApiKey = async (key, type) => {
  try {
    if (type === 'gemini') {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      return response.ok;
    }
    
    if (type === 'openai') {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`
        }
      });
      return response.ok;
    }

    return true;
  } catch (error) {
    console.error('Test API Key error:', error);
    return false;
  }
};
