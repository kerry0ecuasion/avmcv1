import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Replace with your Firebase project credentials
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBe7J_hf7ydhet-j9nHtqR3PB_ZCLoe5k8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "visayasmed-82274.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "visayasmed-82274",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "visayasmed-82274.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "728337782027",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:728337782027:web:02aed14260460c00513e0e",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
