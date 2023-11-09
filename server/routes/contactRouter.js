import Router from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
const router = Router();
import sqlite3 from 'sqlite3'; // npm install sqlite3. NB! Its connected a database to this contact-page just to try out sqlite3
import { open } from 'sqlite';
//import path from 'path';
//import { fileURLToPath } from 'url';

dotenv.config();

const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT;
const emailAdmin = process.env.EMAIL_ADMIN;
const emailPassword = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  host: emailHost,
  port: emailPort,
  auth: {
    user: emailAdmin,
    pass: emailPassword,
  },
});

// Convert import.meta.url to a file path using fileURLToPath
// const __filename = fileURLToPath(import.meta.url);

// Get the directory path using path.dirname
//const __dirname = path.dirname(__filename);

//const databasePath = path.join(__dirname, 'database', 'sqlite.db');

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

    await db.run('INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)', [name, email, subject, message]);

    const info = await transporter.sendMail({
      from: `${name} <${email}>`, // sender address from contact formula
      to: emailAdmin, // receiver = "admin"
      subject: subject,
      html: message,
    });

    console.log('Message sent: %s', info.messageId);

    res.send({ success: true, message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ success: false, message: 'Failed to send email.' });
  }
});

router.get('/api/data', async (req, res) => {
  router.get('/api/data', async (req, res) => {
    try {
      const data = await db.all('SELECT * FROM contacts');
      res.send(data);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve data.' });
    }
  });
});

export default router;
