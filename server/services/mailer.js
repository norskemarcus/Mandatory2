import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
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

export async function sendEmail({ from, to, subject, html }) {
  const mailOptions = {
    from,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
