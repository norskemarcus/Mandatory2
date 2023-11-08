import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.js';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to check if an email already exists
export async function emailExists(email) {
  try {
    // function from Firebase Authentication service
    const signInMethods = await admin.auth().getUserByEmail(email);

    if (signInMethods && signInMethods.length > 0) {
      // The email exists, and signInMethods contains the sign-in methods used
      return true;
    } else {
      // The email doesn't exist
      return false;
    }
  } catch (error) {
    // Handle errors as needed
    throw error;
  }
}

export default { admin };
