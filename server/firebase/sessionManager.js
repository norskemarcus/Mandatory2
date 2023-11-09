// import { setDoc, collection, doc, getDoc } from 'firebase/firestore';
// import { db } from './config.js';

// export async function saveUserSession(userId) {
//   const usersCollection = collection(db, 'users');
//   const userDoc = doc(usersCollection, userId);

//   try {
//     await setDoc(userDoc, {
//       user_id: userId,
//     });
//     console.log(`User session data saved to Firestore for user: ${userId}`);
//   } catch (error) {
//     console.error(`Error saving user session data: ${error}`);
//   }
// }

// export async function getUserSession(userId) {
//   try {
//     const userDoc = doc(collection(db, 'users'), userId);
//     // snapshot (a point-in-time view) of a specific document in a Firestore database
//     const userDocSnapshot = await getDoc(userDoc);

//     if (userDocSnapshot.exists()) {
//       return userDocSnapshot.data();
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error('Error getting user session data:', error);
//     throw error;
//   }
// }
