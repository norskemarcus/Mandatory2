import Router from "express";
import nodemailer from 'nodemailer'; 
import dotenv from 'dotenv';
const router = Router();

const database = []; // dummy database
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
  }
});



router.post('/api/submit', async (req, res) => {
 
  try {
    const { name, email, subject, message } = req.body;
    database.push({ name, email, subject, message });
  
  
    const info = await transporter.sendMail({
      from: `${name} <${email}>`, // sender address from contact formula
      to: emailAdmin, // receiver = "admin"
      subject: subject, 
      html: message, 
    });
  
    console.log("Message sent: %s", info.messageId);
    res.send({ success: true, message: 'Email sent successfully.' });
   
  } catch (error){
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});


// Add an additional route to retrieve the saved data
router.get('/api/data', (req, res) => {
  res.send(database);
});



export default router;
