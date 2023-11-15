// import Router from 'express';
// const router = Router();
// import passport from '../passport/googleAuth.js';

// // just need to import the auth, but not using it directly
// import auth from '../passport/googleAuth.js'; // passport

// // function isLoggedIn(req, res, next) {
// //   req.user ? next() : res.sendStatus(401);
// // }

// router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

// // router.get('/google/callback', (req, res) => {
// //   passport.authenticate('google', {
// //     successRedirect: '/',
// //     failureRedirect: '/auth/google/failure',
// //   });
// // });

// //chatgpt:
// router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/google/failure' }), (req, res) => {
//   res.redirect('/');
// });

// router.get('/google/failure', (req, res) => {
//   res.send('Something went wrong');
// });

// export default router;
