import { Router } from 'express';
import { signUp, logIn } from '../database/authDatabase.js';

const router = Router();

router.post('/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await signUp(email, password);
    req.session.user = { id: user.id };
    req.session.save();

    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    if (error.message === 'User already exists') {
      res.status(409).send({ message: 'A user with this email already exists' });
    } else {
      res.status(500).send({ message: 'Error signing up user', error: error.message });
    }
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await logIn(email, password);
    req.session.user = { id: user.id };
    res.status(200).send({ message: 'Login successful', user });
  } catch (error) {
    let message = 'Login failed. The email or password provided is incorrect.';

    if (error.message === 'User not found' || error.message === 'Password is incorrect') {
      res.status(401).send({ message });
    } else {
      res.status(500).send({ message: 'An error occurred while processing your login request.', error: error.message });
    }
  }
});

router.post('/auth/login-accept', async (req, res) => {
  const { uid } = req.body;

  req.session.user = {
    uid: uid,
  };

  res.send({ message: 'Authentication successful', user });
});

router.get('/auth/check-login', (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

router.post('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
    } else {
      res.cookie('sessionID', '', { expires: new Date(0) });
      res.send({ message: 'Logout successful' });
    }
  });
});

export default router;
