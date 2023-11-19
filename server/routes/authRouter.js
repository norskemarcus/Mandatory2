// import Router from 'express';
// const router = Router();

// import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../firebase/config.js';
// import { emailExists } from '../firebase/firebase-admin.js';

// router.post('/auth/signup', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const isEmailExist = await emailExists(email);

//     if (isEmailExist) {
//       return res.status(400).send({ error: 'A user with this email already exists' });
//     }

//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const newUser = userCredential.user;

//     req.session.newUser = {
//       uid: newUser.uid,
//     };

//     res.send({ message: 'New user successfully registered', newUser });
//   } catch (error) {
//     if (error.code) {
//       const errorMessage = error.code;
//       console.error(errorMessage);

//       res.status(401).send({ error: 'User not registered', errorMessage });
//     } else {
//       res.status(500).send({ error: error.message });
//     }
//   }
// });

// router.post('/auth/login', async (req, res) => {
//   try {
//     console.log(req.body);

//     const { email, password } = req.body;

//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     req.session.user = {
//       uid: user.uid,
//     };

//     res.send({ message: 'Authentication successful', user });
//   } catch (error) {
//     console.log(error);
//     res.status(401).send({ error: 'Authentication failed' });
//   }
// });

// router.post('/auth/login-accept', async (req, res) => {
//   const { uid } = req.body;

//   req.session.user = {
//     uid: uid,
//   };

//   res.send({ message: 'Authentication successful', user });
// });

// router.get('/auth/check-login', (req, res) => {
//   if (req.session.user) {
//     res.send({ loggedIn: true, user: req.session.user });
//   } else {
//     res.send({ loggedIn: false });
//   }
// });

// router.post('/auth/logout', (req, res) => {
//   req.session.destroy(err => {
//     if (err) {
//       console.error('Error destroying session:', err);
//     } else {
//       res.cookie('sessionID', '', { expires: new Date(0) });
//       res.send({ message: 'Logout successful' });
//     }
//   });
// });

// export default router;
