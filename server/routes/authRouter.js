import Router from "express";
const router = Router();

import { signInWithEmailAndPassword, createUserWithEmailAndPassword  } from "firebase/auth";
import { auth } from "../firebase/config.js";

// Login a user
router.post('/auth/login', async (req, res) => {
  try {
    console.log(req.body);
    
    const { email, password } = req.body;
    console.log(email);
    console.log(password);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // req.session.user = {
    //   uid: user.uid,
    //   // email: user.email,
    //  };

    res.send({ message: 'Authentication successful', user });
  } catch (error) {
    console.log(error)
    res.status(401).send({ error: 'Authentication failed' });
  }
});


 // Create a new user
router.post('/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;

    // req.session.newUser = {
    //   uid: newUser.uid,
    // };

    //console.log("req.session.user", req.session.user);

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
  req.session.user = null; 
  res.send({ message: 'Logout successful' });
});


export default router;

