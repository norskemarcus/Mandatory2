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

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
  },
});

app.use(sessionMiddleware);

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       secure: false,
//       httpOnly: true,
//     },
//   }),
// );

import http from 'http';
const server = http.createServer(app);

import { Server } from 'socket.io'; // WebSocket server

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['*'],
  },
});

// Middleware to attach io to the request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Share session middleware with Socket.IO
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

// In your app.js or a similar file where you initialize your sockets
let socketUserMap = {};

import setupSocketHandlers from './sockets/socketHandlers.js';

io.on('connection', socket => {
  const session = socket.request.session;
  if (session && session.user) {
    console.log('Connected user:', session.user.id);
    // Now you can associate the socket ID with the user ID
    socketUserMap[socket.id] = session.user.id;

    // Initialize your socket event handlers
    setupSocketHandlers(socket);

    // Handle disconnect
    socket.on('disconnect', () => {
      delete socketUserMap[socket.id];
    });
  }
});

// io.on('connection', socket => {
//   console.log('A socket connected:');
//   setupSocketHandlers(socket);
// });

import contactRoute from './routes/contactRouter.js';
app.use(contactRoute);

import { initializeDatabase } from './database/databaseInit.js';
import authBryptRouter from './routes/authBcryptRouter.js';
import crudUserRouter from './routes/crudUserRouter.js';
app.use(crudUserRouter);

import wishRouter from './routes/wishRouter.js';

import notificationRouter from './routes/notificationRouter.js';
app.use(notificationRouter);

import suggestionRouter from './routes/suggestionsRouter.js';
app.use(suggestionRouter);

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
