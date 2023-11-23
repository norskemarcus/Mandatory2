import { Router } from 'express';
import { signUp, logIn, signUpChild } from '../database/createUsersTable.js';

const router = Router();

router.post('/auth/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const role = 'Parent';

    const user = await signUp(username, password, role);
    req.session.user = { id: user.id, role: role };
    req.session.save();

    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    if (error.message === 'User already exists') {
      res.status(409).send({ message: 'A user with this username already exists' });
    } else {
      res.status(500).send({ message: 'Error signing up user', error: error.message });
    }
  }
});

router.post('/auth/signup/child', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'Parent') {
    return res.status(403).send({ message: 'Unauthorized' });
  }

  try {
    const { username, password } = req.body;
    const parent_id = req.session.user.id;
    const user = await signUpChild(username, password, parent_id);

    res.status(201).send({ message: 'Child account created successfully', user });
  } catch (error) {
    res.status(500).send({ message: 'Error creating child account', error: error.message });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await logIn(username, password);
    req.session.user = { id: user.id, username: user.username, role: user.role };

    res.status(200).send({ message: 'Login successful', user });
  } catch (error) {
    let message = 'Login failed. The username or password provided is incorrect.';

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
