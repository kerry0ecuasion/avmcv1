import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Replace with your Firebase project credentials
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDcVFahBk9EqerK4ac2f0lz3RG64nsdq_c",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "visayasmed-53bbc.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "visayasmed-53bbc",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "visayasmed-53bbc.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1044502906200",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1044502906200:web:d71d7f0ebc5700bf50d12d",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
