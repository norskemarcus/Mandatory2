import nodemailer from 'nodemailer'; // npm install nodemailer
import dotenv from 'dotenv'; // npm install dotenv


const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'mary.kuphal81@ethereal.email',
      pass: 'YeCHNKbHt6x7jwHwXj'
  }
});

const mailOptions = {
  from: 'your_email@gmail.com', // Sender's email address
  to: 'recipient_email@example.com', // Recipient's email address
  subject: 'Contact Us Form Submission',
  text: 'Name: John Doe\nEmail: example@gmail.com\nMessage: My name is John Doe...',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
