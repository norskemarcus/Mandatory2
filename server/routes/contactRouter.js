
import Router from "express";
const router = Router();

// Create an array to simulate a database
const database = [];

router.post('/api/submit', (req, res) => {
  const { name, email, message } = req.body;
  database.push({ name, email, message });

  // TODO: Use Nodemailer to send the email

  // Handle the response and send back a confirmation to the client
  res.send({ success: true, message: 'Email sent successfully.' });
});


// Add an additional route to retrieve the saved data
router.get('/api/data', (req, res) => {
  res.send(database);
});



export default router;
