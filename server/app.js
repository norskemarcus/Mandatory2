import express from 'express';
import { rateLimit } from 'express-rate-limit';
import session from 'express-session';
import 'dotenv/config';
import helmet from 'helmet';

const app = express();

app.use(helmet());

import cors from 'cors';
app.use(
  cors({
    credentials: true,
    origin: true,
  }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const allRoutesRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // reset efter 15 min
  limit: 200,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes, reset efter 15 min
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes). -------------------------------Change this when finished!! TODO ************************************************************************************************************* ////////////////////////////////////////////// !!!!!!!!
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

app.use(allRoutesRateLimiter);
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
// This middleware is used to attach the io instance to every incoming request in your Express app. It's useful when you want to access the io instance (your Socket.IO server) in your route handlers.
app.use((req, res, next) => {
  req.io = io;
  next();
});

const ioMiddleware = (req, res, next) => {
  req.io = io;
  next();
};

// Share session middleware with Socket.IO
// This is used to share your Express session middleware with Socket.IO. It allows Socket.IO to access the session data. This is crucial if you're using sessions to manage user authentication and need to access the session data in your socket event handlers.

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

import setupSocketHandlers from './sockets/socketHandlers.js';

io.on('connection', socket => {
  setupSocketHandlers(socket, io);
});

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
//app.use(suggestionRouter);

//  pass the io-middleware to your routes so that you can emit events from your routes.
// This is specifically for making the io instance available in your routes. It's a good approach if you need to emit events from your routes.
app.use('/api/suggestions', ioMiddleware, suggestionRouter);

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
