import Router from 'express';
const router = Router();
import passport from '../passport/googleAuth.js';

// just need to import the auth, but not using it directly
import auth from '../passport/googleAuth.js'; // passport

// function isLoggedIn(req, res, next) {
//   req.user ? next() : res.sendStatus(401);
// }

router.get('/google/', (req, res) => {
  passport.authenticate('google', { scope: ['email', 'profile'] });
});

router.get('/google/callback', (req, res) => {
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/auth/failure',
  });
});

router.get('/google/failure', (req, res) => {
  res.send('Something went wrong');
});

export default router;
