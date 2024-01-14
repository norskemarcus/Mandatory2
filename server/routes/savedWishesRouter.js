import { Router } from 'express';
import { query } from '../database/connection.js';

const router = Router();

router.get('/api/parents/saved-wishes/:childId', async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== 'Parent') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const childId = req.params.childId;

    const childWishlist = await query('SELECT sw.wish_id, sw.child_id, sw.bought, w.title, w.url FROM saved_wishes sw JOIN wishes w ON sw.wish_id = w.id WHERE sw.child_id = ?', [childId]);

    return res.status(200).send({ wishlist: childWishlist });
  } catch (error) {
    console.error('Fetch child wishlist error:', error);
    return res.status(500).send({ error: 'Internal server error' });
  }
});

router.post('/api/parents/saved-wishes/:childId', async (req, res) => {
  try {
    const { wishId } = req.body;

    const childId = req.params.childId;

    if (!req.session.user || req.session.user.role !== 'Parent') {
      return res.status(403).send({ message: 'Unauthorized' });
    }

    const parentUserId = req.session.user.id;

    const checkSql = 'SELECT * FROM saved_wishes WHERE child_id = ? AND parent_user_id = ? AND wish_id = ?';
    const checkResult = await query(checkSql, [childId, parentUserId, wishId]);

    if (checkResult.length > 0) {
      return res.send({ message: 'Wish is already saved' });
    }

    const insertSql = 'INSERT INTO saved_wishes (wish_id, parent_user_id, child_id) VALUES (?, ?, ?)';

    const result = await query(insertSql, [wishId, parentUserId, childId]);

    if (result.affectedRows > 0) {
      return res.status(201).send({ message: 'Wish saved successfully' });
    }

    return res.status(500).send({ error: 'Failed to save wish' });
  } catch (error) {
    console.error('Error saving wish:', error);
    return res.status(500).send({ error: error.message });
  }
});

router.patch('/api/parents/saved-wishes/:childId', async (req, res) => {
  try {
    const { bought } = req.body;
    console.log('bought:', bought);
    const childId = req.params.childId;
    console.log('childId:', childId);
    const { wishId } = req.body;
    console.log('wishId:', wishId);

    if (!req.session.user || req.session.user.role !== 'Parent') {
      return res.status(403).send({ message: 'Unauthorized' });
    }

    const parentUserId = req.session.user.id;

    const updateSql = 'UPDATE saved_wishes SET bought = ? WHERE child_id = ? AND parent_user_id = ? AND wish_id = ?';
    const updateResult = await query(updateSql, [bought, childId, parentUserId, wishId]);

    if (updateResult.affectedRows > 0) {
      return res.status(200).send({ message: 'Wish status updated successfully' });
    }

    return res.status(404).send({ message: 'Wish not found' });
  } catch (error) {
    console.error('Error updating wish status:', error);
    return res.status(500).send({ error: error.message });
  }
});

router.delete('/api/parents/unsave-wishes/:childId', async (req, res) => {
  try {
    const { wishId } = req.body;
    const childId = req.params.childId;

    if (!req.session.user || req.session.user.role !== 'Parent') {
      return res.status(403).send({ message: 'Unauthorized' });
    }

    const parentUserId = req.session.user.id;

    const checkSql = 'SELECT * FROM saved_wishes WHERE child_id = ? AND parent_user_id = ? AND wish_id = ?';
    const checkResult = await query(checkSql, [childId, parentUserId, wishId]);

    if (checkResult.length === 0) {
      return res.status(404).send({ error: 'Wish not found in saved list' });
    }

    const deleteSql = 'DELETE FROM saved_wishes WHERE child_id = ? AND parent_user_id = ? AND wish_id = ?';
    await query(deleteSql, [childId, parentUserId, wishId]);

    return res.status(200).send({ message: 'Wish un-saved successfully' });
  } catch (error) {
    console.error('Error un-saving wish:', error);
    return res.status(500).send({ error: error.message });
  }
});

router.get('/api/parents/family-children', async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== 'Parent') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const parentId = req.session.user.id;

    const familyChildren = await query('SELECT * FROM users WHERE role = "Child" AND parent_id = ?', [parentId]);

    return res.status(200).send({ children: familyChildren });
  } catch (error) {
    console.error('Fetch family children error:', error);
    return res.status(500).send({ error: 'Internal server error' });
  }
});

export default router;
