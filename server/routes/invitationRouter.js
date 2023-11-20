import Router from 'express';
const router = Router();
import { createInvitationInTable } from '../services/invitationService.js';
// import { query } from '../database/connection.js';
import { sendEmail } from '../services/mailer.js';

router.post('/send-invitation', async (req, res) => {
  const { childEmail } = req.body;

  try {
    const invitationToken = await createInvitationInTable(childEmail);

    await sendEmail({
      from: `"The Wishing Wand" <${process.env.EMAIL_ADMIN}>`,
      to: childEmail,
      subject: 'Invitation to Join',
      html: `
        <p>Hello,</p>
        <p>You have been invited to join our application! Please click the link below to sign up:</p>
        <a href="${process.env.FRONTEND_HOST}/signup?invitationToken=${invitationToken}">Sign Up</a>
        <p>If you did not request this invitation, please ignore this email.</p>
      `,
    });

    res.status(201).json({ success: true, message: 'Invitation sent successfully.' });
  } catch (error) {
    console.error('Error sending invitation:', error);
    res.status(500).json({ success: false, message: 'Error sending invitation.', error: error.message });
  }
});

export default router;
