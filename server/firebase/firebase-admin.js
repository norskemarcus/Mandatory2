// import admin from 'firebase-admin';
// import serviceAccount from './config.js'; // Replace with the actual path to your Firebase config JSON file

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// export default { admin };

// // Function to check if an email already exists
// async function emailExists(email) {
//   try {
//     const userRecord = await admin.auth().getUserByEmail(email);
//     // The email exists, and you can access the user record if needed
//     return true;
//   } catch (error) {
//     if (error.code === 'auth/user-not-found') {
//       // The email doesn't exist
//       return false;
//     } else {
//       // Handle other errors as needed
//       throw error;
//     }
//   }
// }

// // Usage
// const email = 'user@example.com';
// emailExists(email)
//   .then(exists => {
//     if (exists) {
//       console.log('Email already exists.');
//     } else {
//       console.log('Email does not exist.');
//     }
//   })
//   .catch(error => {
//     console.error('Error checking email existence:', error);
//   });
