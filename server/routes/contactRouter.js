
import Router from "express";
const router = Router();

router.post('/api/submit', (req, res) => {
  // Extract form data from req.body
  const { name, email, message } = req.body;

  // Use Nodemailer to send the email

  // Handle the response and send back a confirmation to the client
  res.json({ success: true, message: 'Email sent successfully.' });
});

export default router;
