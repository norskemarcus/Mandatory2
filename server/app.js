import express from 'express';
import { rateLimit } from 'express-rate-limit';
import session from 'express-session'; // npm install express-session cookie-parser
import dotenv from 'dotenv';
dotenv.config();
import helmet from 'helmet';
import cors from 'cors';
const app = express();
//import passport from 'passport';

app.use(helmet()); // This middleware adds various security-related HTTP headers to your responses, which can help protect your application against certain attacks.

// Enable CORS for all routes
app.use(
  cors({
    credentials: true,
    origin: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false })); // parsing incoming HTTP request bodies when the data is submitted as form data in the x-www-form-urlencoded format.

// npm i express-rate-limit
const allRoutesRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // reset efter 15 min
  limit: 200,
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes, reset efter 15 min
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes). -------------------------------Change this when finished!!
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
});

app.use(allRoutesRateLimiter); // asynkron funktion som er middleware
app.use('/auth', authRateLimiter);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);

//app.use(passport.initialize());
//app.use(passport.session());

import authRouter from './routes/authRouter.js';
app.use(authRouter);

import googleAuthRouter from './routes/googleAuthRouter.js';
app.use(googleAuthRouter);

// Mount the contact route at the /api path
import contactRoute from './routes/contactRouter.js';
app.use(contactRoute);

import legoRouter from './routes/legoRouter.js';
import passport from 'passport';
app.use(legoRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server is running on PORT', PORT));
