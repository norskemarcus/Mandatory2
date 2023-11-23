import express from 'express';
import { rateLimit } from 'express-rate-limit';
import session from 'express-session';
import 'dotenv/config';
import helmet from 'helmet';

const app = express();

app.use(helmet()); // This middleware adds various security-related HTTP headers to your responses, which can help protect your application against certain attacks.

// SLIPPER CORS PROBLEMER!!! OBS må bygge projekt først med build
// import path from 'path';
// app.use(express.static(path.resolve('../client/dist')));

import cors from 'cors';
app.use(
  cors({
    credentials: true,
    origin: true,
  }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: false })); // parsing incoming HTTP request bodies when the data is submitted as form data in the x-www-form-urlencoded format.

// // npm i express-rate-limit
// const allRoutesRateLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // reset efter 15 min
//   limit: 200,
//   standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
//   // store: ... , // Use an external store for consistency across multiple server instances.
// });

// const authRateLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes, reset efter 15 min
//   limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes). -------------------------------Change this when finished!!
//   standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
//   // store: ... , // Use an external store for consistency across multiple server instances.
// });

// app.use(allRoutesRateLimiter); // asynkron funktion som er middleware
// app.use('/auth', authRateLimiter);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
    },
  }),
);

import http from 'http';
const server = http.createServer(app);

import { Server } from 'socket.io';

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['*'],
  },
});

// an event handler for io.on('connection', ...), which is executed whenever a client (browser) establishes a WebSocket connection with your server.
io.on('connection', socket => {
  console.log('A socket connected');

  // event handlers for specific events related to wishes
  socket.on('child-add-wish', data => {
    // Broadcast the new wish to all connected clients (including the parent dashboard)
    io.emit('parent-wish-added', data);
  });
});

import contactRoute from './routes/contactRouter.js';
app.use(contactRoute);

import { initializeDatabase } from './database/databaseInit.js';
import authBryptRouter from './routes/authBcryptRouter.js';
import wishRouter from './routes/wishRouter.js';

import savedWishesRouter from './routes/savedWishesRouter.js';
app.use(savedWishesRouter);

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve('../client/dist/index.html'));
// });

let initializationAttempts = 0;

function startServer() {
  app.use(authBryptRouter);
  app.use(wishRouter);

  const PORT = process.env.PORT || 8080;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

function handleInitializationError(err) {
  console.error('Error during database initialization:', err);
  initializationAttempts++;
  if (initializationAttempts < 3) {
    console.log(`Attempt ${initializationAttempts}: Retrying database initialization...`);
    setTimeout(initializeDatabase, 5000);
  } else {
    console.error('Database initialization failed after 3 attempts, exiting...');
    process.exit(1); // 1 indicate error
  }
}

initializeDatabase().then(startServer).catch(handleInitializationError);
