import Router from 'express';
import { sendEmail } from '../services/mailer.js';
import dotenv from 'dotenv';
const router = Router();
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

dotenv.config();

let db;

open({
  filename: 'sq3lite.db',
  driver: sqlite3.Database,
}).then(async database => {
  db = database;

  await db.run(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT
  )
`);
});

router.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).send({ message: 'All fields are required.' });
    }

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

router.get('/api/data', async (req, res) => {
  try {
    const data = await db.all('SELECT * FROM contacts');
    res.send(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ success: false, message: 'Failed to retrieve data.' });
  }
});

export default router;
