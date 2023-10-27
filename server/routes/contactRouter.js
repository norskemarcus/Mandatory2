import Router from "express";
import nodemailer from 'nodemailer'; // npm install nodemailer
// import dotenv from 'dotenv'; // npm install dotenv, remember to install it at the same level as the .env file. In this case: server, and not root


import dotenv from 'dotenv';
const router = Router();

const database = [];

dotenv.config(); 

const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT;
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;


const transporter = nodemailer.createTransport({
  host: emailHost,
  port: emailPort,
  auth: {
    user: emailUser,
    pass: emailPassword,
  }
});

console.log(emailHost, emailPort, emailUser, emailPassword);

router.post('/api/submit', async (req, res) => {
 
  try {
    const { name, email, subject, message } = req.body;
    database.push({ name, email, subject, message });
  

    const info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      // from: `${name} <${process.env.EMAIL_USER}>`, // sender address
      to: email, // list of receivers,
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
