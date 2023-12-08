import Router from 'express';
const router = Router();
import { query } from '../database/connection.js';
// import dotenv from 'dotenv';
// dotenv.config();

// Route to get a user's profile by ID
router.get('/api/users/:userId', async (req, res) => {
  // Implementation here
});

// The transaction will ensure that all related data is deleted atomically, and if any part of the process fails, the transaction will be rolled back. This ensures data integrity and consistency.

router.delete('/api/users/:userId', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send({ error: 'User is not logged in' });
  }

  const userIdToDelete = req.params.userId;

  const userId = req.session.user.id;
  console.log('userId in backend:', userId);
  const userRole = req.session.user.role;
  console.log(userRole);

  try {
    // await query('START TRANSACTION');

    /*     if (userRole === 'Parent') {
      const checkSavedWishesSQL = 'SELECT COUNT(*) AS count FROM saved_wishes WHERE parent_user_id = ?';
      const [savedWishesResult] = await query(checkSavedWishesSQL, [userId]);
      if (savedWishesResult.count > 0) {
        const deleteSavedWishesSQL = 'DELETE FROM saved_wishes WHERE parent_user_id = ?';
        await query(deleteSavedWishesSQL, [userId]);
      }

      const checkSuggestionsSQL = 'SELECT COUNT(*) AS count FROM suggestions WHERE user_id = ?';
      const [suggestionsResult] = await query(checkSuggestionsSQL, [userId]);
      if (suggestionsResult.count > 0) {
        const deleteSuggestionsSQL = 'DELETE FROM suggestions WHERE parent_user_id = ?';
        await query(deleteSuggestionsSQL, [userId]);
      }
    } else if (userRole === 'Child') {
      const deleteDependentSavedWishesSQL = 'DELETE FROM saved_wishes WHERE wish_id IN (SELECT id FROM wishes WHERE user_id = ?)';
      await query(deleteDependentSavedWishesSQL, [userId]);

      const checkWishesSQL = 'SELECT COUNT(*) AS count FROM wishes WHERE user_id = ?';
      const [wishesResult] = await query(checkWishesSQL, [userId]);
      if (wishesResult.count > 0) {
        const deleteWishesSQL = 'DELETE FROM wishes WHERE user_id = ?';
        await query(deleteWishesSQL, [userId]);
      }

      const checkNotificationsSQL = 'SELECT COUNT(*) AS count FROM notifications WHERE child_id = ?';
      const [notificationsResult] = await query(checkNotificationsSQL, [userId]);
      if (notificationsResult.count > 0) {
        const deleteNotificationsSQL = 'DELETE FROM notifications WHERE child_id = ?';
        await query(deleteNotificationsSQL, [userId]);
      }
    }
 */ const deleteUserSQL = 'DELETE FROM users WHERE id = ?';
    await query(deleteUserSQL, [userId]);

    //await query('COMMIT');

    req.session.destroy(err => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).send({ error: 'Internal server error during session destruction' });
      }
      res.clearCookie('connect.sid');
      res.status(200).send({ message: 'User account and session deleted successfully' });
    });
  } catch (error) {
    // await query('ROLLBACK');
    console.error('Error during deleting user:', error);
    res.status(500).send({ error: 'Failed to delete user' });
  }
});
export default router;
