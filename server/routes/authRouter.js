import Router from 'express';
const router = Router();

import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config.js';
import { sendPasswordResetEmail } from 'firebase/auth';
import { saveUserSession } from '../firebase/sessionManager.js';
// import admin from './firebase/firebase-admin.js';
// import serviceAccount from '../firebase/config.js';

// Login a user
router.post('/auth/login', async (req, res) => {
  try {
    console.log(req.body);

    const { email, password } = req.body;

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    req.session.user = {
      uid: user.uid,
    };

    res.send({ message: 'Authentication successful', user });
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: 'Authentication failed' });
  }
});

// This can be useful for scenarios where you have a different authentication flow, such as logging in through a third-party service, and you want to set the user's UID in the session after successful authentication.
router.post('/auth/login-accept', async (req, res) => {
  const { uid } = req.body;

  req.session.user = {
    uid: uid,
  };

  res.send({ message: 'Authentication successful', user });
});

// check if the user is logged in
router.get('/auth/check-login', (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

// Create a new user
router.post('/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;

    req.session.newUser = {
      uid: newUser.uid,
    };

    res.send({ message: 'New user successfully registered', newUser });
  } catch (error) {
    if (error.code) {
      const errorMessage = error.message;

      console.error(errorMessage);
      res.status(401).send({ error: 'User not registered', errorMessage });
    } else {
      res.status(500).send({ error: error.message });
    }
  }
});

router.post('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
    } else {
      // Clear the session cookie by setting it to an empty value and expiring it
      res.cookie('sessionID', '', { expires: new Date(0) });
      res.send({ message: 'Logout successful' });
    }
  });
});

router.post('/auth/reset-password', (req, res) => {
  const { email } = req.body;

  admin
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => {
      res.status(200).send('Password reset email sent successfully');
    })
    .catch(error => {
      console.error('Error sending password reset email:', error);
      res.status(500).send('Error sending password reset email');
    });
});

export default router;
