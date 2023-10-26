import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'YourEmailServiceProvider', // e.g., 'Gmail', 'Yahoo', etc.
  auth: {
    user: 'your_email@gmail.com', // Your email address
    pass: 'your_email_password', // Your email password or an app-specific password
  },
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
