import Router from 'express';
import { sendEmail } from '../services/mailer.js';
import dotenv from 'dotenv';
import { initializeDatabase, db } from '../database/createMails.js';
import sanitizeHtml from 'sanitize-html';

const router = Router();
dotenv.config();

// Async IIFE = Immediately Invoked Function Expression
(async () => {
  try {
    await initializeDatabase();
  } catch (error) {
    console.error(error);
  }
})();

router.post('/api/contacts', async (req, res) => {
  try {
    let { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).send({ message: 'All fields are required.' });
    }

    name = sanitizeHtml(name);
    email = sanitizeHtml(email);
    subject = sanitizeHtml(subject);
    message = sanitizeHtml(message);

    await db.run('INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)', [name, email, subject, message]);

    await sendEmail({
      from: `${name} <${email}>`,
      to: process.env.EMAIL_ADMIN,
      subject,
      html: message,
    });

    res.send({ success: true, message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ success: false, message: 'Failed to send email.' });
  }
});


export default router;
