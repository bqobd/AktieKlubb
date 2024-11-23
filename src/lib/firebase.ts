import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
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
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);