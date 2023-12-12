import Router from 'express';
const router = Router();
import { query } from '../database/connection.js';

// Route to get a user's profile by ID
router.get('/api/users/:userId', async (req, res) => {
  // Implementation here
});

router.delete('/api/users/:userId', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send({ error: 'User is not logged in' });
  }

  const userId = req.session.user.id;
  console.log('userId in backend:', userId);
  const userRole = req.session.user.role;
  console.log(userRole);

  try {
    const deleteUserSQL = 'DELETE FROM users WHERE id = ?';
    await query(deleteUserSQL, [userId]);

    req.session.destroy(err => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).send({ error: 'Internal server error during session destruction' });
      }
      res.clearCookie('connect.sid');
      res.status(200).send({ message: 'User account and session deleted successfully' });
    });
  } catch (error) {
    console.error('Error during deleting user:', error);
    res.status(500).send({ error: 'Failed to delete user' });
  }
});
export default router;
