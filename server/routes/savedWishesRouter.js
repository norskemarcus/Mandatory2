import { Router } from 'express';
import { query } from '../database/connection.js';

const router = Router();

// get all saved wishlist
router.get('/api/parent/saved-wishes', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'Parent') {
    return res.status(403).send({ message: 'Unauthorized' });
  }

  let parent_user_id = req.session.user.id;
  if (userId) {
    const selectSql = `SELECT * FROM saved_wishes WHERE parent_user_id = ?`;

    try {
      const results = await query(selectSql, [parent_user_id]);
      res.send({ wishlist: results });
      console.log('Query results:', results);
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  } else {
    return res.status(401).send({ error: 'User session data not found' });
  }
});

// get the selected child wishlist
// http://localhost:8080/api/parent/saved-wishes/${selectedChild.id}`,
router.get('/api/parent/saved-wishes/:childId', async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== 'Parent') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    //const parentId = req.session.user.id;
    const childId = req.params.childId;
    console.log('childID:', childId);

    const childWishlist = await query('SELECT sw.id, sw.child_id, w.title, w.url, w.bought FROM saved_wishes sw JOIN wishes w ON sw.wish_id = w.id WHERE sw.child_id = ?', [childId]);

    return res.status(200).send({ wishlist: childWishlist });
  } catch (error) {
    console.error('Fetch child wishlist error:', error);
    return res.status(500).send({ error: 'Internal server error' });
  }
});

router.post('/api/parent/saved-wishes/:childId', async (req, res) => {
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
      return res.status(200).send({ message: 'Wish is already saved' });
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

router.get('/api/parent/family-children', async (req, res) => {
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

router.delete('/api/parent/unsave-wish/:childId', async (req, res) => {
  try {
    // wishId bliver sendt med body
    const { wishId } = req.body;

    // childId bliver sendt som paramater
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

export default router;
