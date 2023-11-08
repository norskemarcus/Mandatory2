import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import dotenv from 'dotenv';
import { sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: 'mandatory2-68b5c',
  storageBucket: 'mandatory2-68b5c.appspot.com',
  messagingSenderId: '907316579590',
  appId: process.env.APP_ID,
  measurementId: 'G-N6D7BK31PJ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };

// Export the sendResetEmail function
export const sendResetEmail = email => {
  return sendPasswordResetEmail(auth, email);
};
