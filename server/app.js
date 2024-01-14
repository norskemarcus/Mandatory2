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
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
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

import { Server } from 'socket.io';

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
app.use(suggestionRouter);

import savedWishesRouter from './routes/savedWishesRouter.js';
app.use(savedWishesRouter);

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
