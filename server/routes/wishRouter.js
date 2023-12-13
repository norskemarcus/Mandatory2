import Router from 'express';
const router = Router();
import { query } from '../database/connection.js';
import dotenv from 'dotenv';
dotenv.config();

router.get('/api/wishes', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send({ error: 'User is not logged in' });
  }
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

router.get('/api/parent/child-wishlist/:childId', async (req, res) => {
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

async function getChildUsername(userId) {
  const getChildUserameSQL = 'SELECT username FROM users WHERE id = ?';
  try {
    const result = await query(getChildUserameSQL, [userId]);
    return result[0]?.username;
  } catch (error) {
    console.error('Error fetching child username:', error);
    throw new Error('Failed to fetch child username');
  }
}

async function createWish(io, userId, title, description, price, url, imageUrl) {
  try {
    const checkExistingSQL = 'SELECT id FROM wishes WHERE url = ? AND user_id = ?';
    const existingWishes = await query(checkExistingSQL, [url, userId]);

    if (existingWishes.length > 0) {
      return { error: 'A wish with this URL already exists' };
    }

    const insertSQL = 'INSERT INTO wishes (title, description, price, url, image_url, user_id) VALUES (?, ?, ?, ?, ?, ?)';

    const priceValue = price ? parseFloat(price) : null;
    // const priceValue = price && !isNaN(parseFloat(price)) ? parseFloat(price) : null;

    const insertResults = await query(insertSQL, [title, description, priceValue, url, imageUrl, userId]);

    if (insertResults.insertId) {
      const newWish = { title, description, price: priceValue, url, imageUrl };
      const childUsername = await getChildUsername(userId);

      const parentIdSQL = 'SELECT parent_id FROM users WHERE id = ?;';
      const parent_id_result = await query(parentIdSQL, [userId]);

      if (parent_id_result.length === 0) {
        return { error: 'User not found' };
      }

      const parentId = parent_id_result[0].parent_id;

      await saveNotification(userId, parentId, `${childUsername} added a new wish: ${title}`);
      emitNewWishEvent(io, userId, childUsername, newWish);
    }
    return { message: 'Wish created successfully', wishId: insertResults.insertId };
  } catch (error) {
    console.error('Error creating wish:', error);
    throw new Error('Failed to create wish');
  }
}

async function saveNotification(userId, parentId, message) {
  try {
    const notificationInsertSQL = 'INSERT INTO notifications (user_id, parent_id, message) VALUES (?, ?, ?)';
    await query(notificationInsertSQL, [userId, parentId, message]);
    // TODO returning notification ID or a success indicator
  } catch (error) {
    console.error('Error saving notification:', error);
  }
}

function emitNewWishEvent(io, userId, childUsername, newWish) {
  io.emit('new-wish', { userId: userId, childUsername: childUsername, wish: newWish });
}

router.post('/api/form/wishes', async (req, res) => {
  try {
    const { title, description, price, url } = req.body;
    const userId = req.session.user.id;

    const result = await createWish(req.io, userId, title, description, price, url, null);

    if (result.error) {
      res.status(400).send({ error: result.error });
    } else {
      res.status(200).send({ message: result.message, wishId: result.wishId });
    }
  } catch (error) {
    console.error('Error creating wish:', error);
    res.status(500).send({ error: 'Failed to create wish' });
  }
});

router.post('/api/wishes', async (req, res) => {
  try {
    const { title, description, price, url, imageUrl } = req.body;
    const userId = req.session.user.id;
    const result = await createWish(req.io, userId, title, description, price, url, imageUrl, userId);

    if (result.error) {
      return res.status(400).send({ error: result.error });
    }
    res.status(201).send(result);
  } catch (error) {
    console.error('Error creating wish:', error);
    res.status(500).send({ error: 'Failed to create wish' });
  }
});

router.get('/api/search', async (req, res) => {
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

router.get('/api/wishes/check', async (req, res) => {
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

router.delete('/api/wishes/:wishId', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send({ error: 'User is not logged in' });
  }

  const userId = req.session.user.id;
  const wishId = req.params.wishId;

  try {
    await query('START TRANSACTION');

    const wishTitleSQL = 'SELECT title FROM wishes WHERE id = ?';
    const [title] = await query(wishTitleSQL, [wishId]); // destructering, becuase object with title from sql

    const deleteSavedWishSQL = 'DELETE FROM saved_wishes WHERE wish_id = ?';
    await query(deleteSavedWishSQL, [wishId]);

    const childUsername = await getChildUsername(userId);

    const deleteWishSQL = 'DELETE FROM wishes WHERE id = ? AND user_id = ?';
    await query(deleteWishSQL, [wishId, userId]);
    await query('COMMIT');

    if (childUsername) {
      req.io.emit('wish-deleted', { childUsername: childUsername, wish: title });
    }

    res.status(200).send({ message: 'Wish deleted successfully' });
  } catch (error) {
    await query('ROLLBACK');
    console.error('Error during deleting wish:', error);
    res.status(500).send({ error: 'Failed to delete wish' });
  }
});

export default router;
