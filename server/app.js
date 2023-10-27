import express from 'express';
import { rateLimit } from 'express-rate-limit'
import session from 'express-session';
import dotenv from 'dotenv';

// npm install express express-session cookie-parser

const app = express();

dotenv.config(); 

app.use(express.json());
app.use(express.urlencoded({extended: false})); // parsing incoming HTTP request bodies when the data is submitted as form data in the x-www-form-urlencoded format.

// npm i express-rate-limit
const allRoutesRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // reset efter 15 min
	limit: 200, 
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
})


const authRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes, reset efter 15 min
	limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
})


app.use(allRoutesRateLimiter) // asynkron funktion som er middleware
app.use("/auth", authRateLimiter);


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);


import authRouter from './routes/authRouter.js'
app.use(authRouter);


import mainRouter from './routes/mainRouter.js';
app.use(mainRouter)


// Mount the contact route at the /api path
import contactRoute from './routes/contactRouter.js'; 
app.use(contactRoute);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server is running on PORT", PORT));