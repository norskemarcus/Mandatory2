import express from 'express';
import { rateLimit } from 'express-rate-limit'

const app = express();

app.use(express.json());

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



import mainRouter from './routes/mainRouter.js';
app.use(mainRouter)


// Mount the contact route at the /api path
import contactRoute from './routes/contactRouter.js'; 
app.use(contactRoute);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server is running on PORT", PORT));