import { query } from '../database/connection.js';
import { sendEmail } from './mailer.js';
import crypto from 'crypto';

function generateUniqueToken() {
  return crypto.randomBytes(16).toString('hex');
}

function getExpirationDate() {
  const expirationPeriodInHours = 48;
  let expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expirationPeriodInHours);
  return expiresAt;
}

export async function createInvitationInTable(childEmail, role = 'Child') {
  const invitationToken = generateUniqueToken();
  const expiresAt = getExpirationDate();
  const createInvitationSQL = `
    INSERT INTO invitations (email, invitation_token, role, expires_at, status)
    VALUES (?, ?, ?, ?, 'sent');
  `;

  try {
    const results = await query(createInvitationSQL, [childEmail, invitationToken, role, expiresAt]);
    console.log(results);

    return invitationToken;
  } catch (error) {
    console.error('Error creating invitation:', error);
    throw error;
  }
}

// export async function sendInvitationEmail(email, invitationToken) {
//   const transporter = nodemailer.createTransport({
//     // Transport configuration (e.g., SMTP server, authentication)
//   });

//   const invitationLink = `http://localhost:5173/signup?invitationToken=${invitationToken}`;

//   await transporter.sendMail({
//     from: '"Parent" <parent@example.com>',
//     to: email,
//     subject: 'Invitation to Join',
//     text: `You have been invited to join! Please click on the link to sign up: ${invitationLink}`,
//   });
// }
