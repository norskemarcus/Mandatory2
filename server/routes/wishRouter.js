import Router from 'express';
const router = Router();
import { query } from '../database/connection.js';
import dotenv from 'dotenv';
import { getSocketIdByUserId } from '../sockets/socketManager.js';
import { getParentId, getChildUsername } from '../services/userService.js';
import { createWish } from '../services/wishService.js';
dotenv.config();
import sanitizeHtml from 'sanitize-html';
import { isAuthenticated, isChild } from '../middleware/authMiddleware.js';

router.get('/api/wishes', isAuthenticated, async (req, res) => {
  let userId = req.session.user.id;
  if (userId) {
    const selectSql = `SELECT * FROM wishes WHERE user_id = ?`;

    try {
      const results = await query(selectSql, [userId]);
      res.send({ wishlist: results });
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  } else {
    return res.status(401).send({ error: 'User session data not found' });
  }
});

router.get('/api/parents/children-wishlists/:childId', isAuthenticated, async (req, res) => {
  try {
    const childId = req.params.childId;

    const selectSql = `SELECT * FROM wishes WHERE user_id = ?`;

    const results = await query(selectSql, [childId]);
    res.send({ wishlist: results });
  } catch (error) {
    console.error('Error fetching child wishlist:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

router.get('/api/searches', isAuthenticated, async (req, res) => {
  try {
    const { query } = req.query;
    const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CUSTOM_SEARCH_CX}&q=${query}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('API search error:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/api/wishes/checks', isAuthenticated, async (req, res) => {
  try {
    const url = req.query.url;
    const userId = req.session.user.id;

    const queryResult = await query('SELECT id FROM wishes WHERE url = ? AND user_id = ?', [url, userId]);

    if (queryResult.length > 0) {
      res.send({ isSavedByChild: true, wishId: queryResult[0].id });
    } else {
      res.send({ isSavedByChild: false });
    }
  } catch (error) {
    console.error('Error checking wish:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

router.post('/api/wishes', isAuthenticated, async (req, res) => {
  try {
    let { title, description, price, url, imageUrl } = req.body;
    title = sanitizeHtml(title);
    description = sanitizeHtml(description);
    price = sanitizeHtml(price);
    url = sanitizeHtml(url);
    imageUrl = imageUrl ? sanitizeHtml(imageUrl) : null;

    const userId = req.session.user.id;

    const result = await createWish(req.io, userId, title, description, price, url, imageUrl);

    if (result.error) {
      return res.status(400).send({ error: result.error });
    }
    res.status(201).send(result);
  } catch (error) {
    console.error('Error creating wish:', error);
    res.status(500).send({ error: 'Failed to create wish' });
  }
});

router.delete('/api/wishes/:wishId', isAuthenticated, isChild, async (req, res) => {
  const userId = req.session.user.id;
  const wishId = req.params.wishId;

  try {
    await query('START TRANSACTION');

    // Check if the wish is saved and delete it from saved_wishes
    const deleteSavedWishSQL = 'DELETE FROM saved_wishes WHERE wish_id = ?';
    await query(deleteSavedWishSQL, [wishId]);

    const wishTitleSQL = 'SELECT title FROM wishes WHERE id = ?';
    const [wish] = await query(wishTitleSQL, [wishId]);
    const wishTitle = wish?.title;

    const childUsername = await getChildUsername(userId);
    const notificationMessage = `${childUsername} has deleted a wish: ${wishTitle}`;

    const parentId = await getParentId(userId);

    const notificationInsertSQL = 'INSERT INTO notifications (user_id, parent_id, message, wish_id) VALUES (?, ?, ?, ?)';
    await query(notificationInsertSQL, [userId, parentId, notificationMessage, wishId]);

    // Retrieve the ID of the newly created notification
    const lastIdSql = 'SELECT LAST_INSERT_ID() as id';
    const idResult = await query(lastIdSql);
    const notificationId = idResult[0]?.id;

    const deleteWishSQL = 'DELETE FROM wishes WHERE id = ? AND user_id = ?';
    await query(deleteWishSQL, [wishId, userId]);

    await query('COMMIT');

    if (childUsername) {
      const parentId = await getParentId(userId);
      const parentSocketId = getSocketIdByUserId(parentId);

      if (parentSocketId) {
        req.io.to(parentSocketId).emit('wish-deleted', {
          childUsername: childUsername,
          wish: wishTitle,
          notificationId: notificationId,
        });
      }
    }

    res.status(200).send({ message: 'Wish deleted successfully' });
  } catch (error) {
    await query('ROLLBACK');

    console.error('Error during deleting wish:', error);
    res.status(500).send({ error: 'Failed to delete wish' });
  }
});

export default router;
