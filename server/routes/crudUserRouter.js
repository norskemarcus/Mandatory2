import Router from 'express';
const router = Router();
import { query } from '../database/connection.js';

router.get('/api/children/:parentId', async (req, res) => {
  try {
    const parentId = req.params.parentId;
    const selectSql = 'SELECT username FROM users WHERE id = ? AND role = "Parent"';
    const result = await query(selectSql, [parentId]);

    if (result.length > 0) {
      res.send({ username: result[0].username });
    } else {
      res.status(404).send('Parent not found');
    }
  } catch (error) {
    console.error('Error fetching parent:', error);
    res.status(500).send('Internal server error');
  }
});

router.get('/api/children', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'Parent') {
    return res.status(401).send('Unauthorized');
  }

  try {
    const parentId = req.session.user.id;
    const selectSql = 'SELECT * FROM users WHERE parent_id = ?';
    const children = await query(selectSql, [parentId]);

    res.send(children);
  } catch (error) {
    console.error('Error fetching children:', error);
    res.status(500).send('Internal server error');
  }
});

// when a parent deletes a child
router.delete('/api/children/:childId', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'Parent') {
    return res.status(401).send('Unauthorized');
  }

  try {
    const childId = req.params.childId;
    const deleteSql = 'DELETE FROM users WHERE id = ? AND parent_id = ?'; // Adjust SQL query as needed
    await query(deleteSql, [childId, req.session.user.id]);

    res.send('Child account deleted successfully');
  } catch (error) {
    console.error('Error deleting child account:', error);
    res.status(500).send('Internal server error');
  }
});

// when the user deletes h*self
router.delete('/api/users/:userId', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send({ error: 'User is not logged in' });
  }

  const userId = req.session.user.id;
  //const userRole = req.session.user.role;

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
