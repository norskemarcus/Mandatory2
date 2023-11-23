import { Router } from 'express';
import { query } from '../database/connection.js';

const router = Router();

// get all saved wishlist
router.get('/api/parent/saved-wishes', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'Parent') {
    return res.status(403).send({ message: 'Unauthorized' });
  }

  let userId = req.session.user.id;
  if (userId) {
    const selectSql = `SELECT * FROM saved_wishes WHERE user_id = ?`;

    try {
      const results = await query(selectSql, [userId]);
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

    const parentId = req.session.user.id;
    const childId = req.params.childId;

    const isChildBelongsToParent = await checkIfChildBelongsToParent(parentId, childId);

    if (!isChildBelongsToParent) {
      return res.status(403).json({ message: 'Child does not belong to the parent' });
    }

    const childWishlist = await query('SELECT * FROM saved_wishes WHERE child_id = ?', [childId]);

    return res.status(200).send({ wishlist: childWishlist });
  } catch (error) {
    console.error('Fetch child wishlist error:', error);
    return res.status(500).send({ error: 'Internal server error' });
  }
});

async function checkIfChildBelongsToParent(parentId, childId) {
  const result = await query('SELECT COUNT(*) as count FROM users WHERE id = ? AND role = "Child" AND parent_id = ?', [childId, parentId]);
  return result[0].count > 0;
}

router.post('/api/parent/saved-wishes', async (req, res) => {
  try {
    const { wishId } = req.body;

    if (!req.session.user || req.session.user.role !== 'Parent') {
      return res.status(403).send({ message: 'Unauthorized' });
    }

    const parentUserId = req.session.user.id; // Make sure to use the correct parent user ID
    const insertSql = 'INSERT INTO saved_wishes (wish_id, parent_user_id) VALUES (?, ?)'; // Adjust the column names

    const result = await query(insertSql, [wishId, parentUserId]);

    if (result.affectedRows > 0) {
      return res.status(201).send({ message: 'Wish saved successfully' });
    }

    return res.status(500).send({ error: 'Failed to save wish' });
  } catch (error) {
    console.error('Error saving wish:', error);
    return res.status(500).send({ error: error.message });
  }
});

// http://localhost:8080/api/parent/family-children'
router.get('/api/parent/family-children', async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== 'Parent') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const parentId = req.session.user.id;
    console.log(parentId);

    const familyChildren = await query('SELECT * FROM users WHERE role = "Child" AND parent_id = ?', [parentId]);
    console.log(familyChildren);

    return res.status(200).send({ children: familyChildren });
  } catch (error) {
    console.error('Fetch family children error:', error);
    return res.status(500).sendDate({ error: 'Internal server error' });
  }
});

export default router;
