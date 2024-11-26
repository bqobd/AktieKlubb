import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCG9RfD_P4EAgHlM98AcKSWQRciC7x46oY",
  authDomain: "stock-analysis-e2d52.firebaseapp.com",
  projectId: "stock-analysis-e2d52",
  storageBucket: "stock-analysis-e2d52.firebasestorage.app",
  messagingSenderId: "678086413210",
  appId: "1:678086413210:web:d77f34c913ea03a3be8823",
  measurementId: "G-R1RBRQVGWX"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with settings for better offline support
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser doesn\'t support persistence.');
  }
});

export const auth = getAuth(app);
export const storage = getStorage(app);
export { db };