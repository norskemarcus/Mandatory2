import Router from 'express';
const router = Router();
import { query } from '../database/connection.js';
import dotenv from 'dotenv';
import { getSocketIdByUserId } from '../sockets/socketStore.js';
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
    if (url) {
      const checkExistingURLSQL = 'SELECT id FROM wishes WHERE url = ? AND user_id = ?';
      const existingWishesByURL = await query(checkExistingURLSQL, [url, userId]);

      if (existingWishesByURL.length > 0) {
        return { error: 'A wish with this URL already exists' };
      }
    } else {
      const checkExistingTitleSQL = 'SELECT id FROM wishes WHERE title = ? AND user_id = ?';
      const existingWishesByTitle = await query(checkExistingTitleSQL, [title, userId]);

      if (existingWishesByTitle.length > 0) {
        return { error: 'A wish with this title already exists' };
      }
    }
    const insertSQL = 'INSERT INTO wishes (title, description, price, url, image_url, user_id) VALUES (?, ?, ?, ?, ?, ?)';

    const priceValue = price ? parseFloat(price) : null;

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

      const notificationMessage = `${childUsername} added a new wish: ${title}`;
      const notificationId = await saveNotification(userId, parentId, notificationMessage, insertResults.insertId);

      emitNewWishEvent(io, userId, childUsername, newWish, notificationId, parentId);
    }
    return { message: 'Wish created successfully', wishId: insertResults.insertId };
  } catch (error) {
    console.error('Error creating wish:', error);
    throw new Error('Failed to create wish');
  }
}

async function saveNotification(userId, parentId, message, wishId = null) {
  try {
    const notificationInsertSQL = 'INSERT INTO notifications (user_id, parent_id, message, wish_id) VALUES (?, ?, ?, ?)';

    const lastIdSql = 'SELECT LAST_INSERT_ID() as id';

    const insertResult = await query(notificationInsertSQL, [userId, parentId, message, wishId]);

    if (insertResult && insertResult.affectedRows > 0) {
      const idResult = await query(lastIdSql);
      return idResult[0].id;
    }

    return null;
  } catch (error) {
    console.error('Error saving notification:', error);
    throw error;
  }
}

function emitNewWishEvent(io, userId, childUsername, newWish, notificationId, parentId) {
  const parentSocketId = getSocketIdByUserId(parentId);
  if (parentSocketId) {
    io.to(parentSocketId).emit('new-wish', {
      userId: userId,
      childUsername: childUsername,
      wish: newWish,
      notificationId: notificationId,
    });
  }
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
    const [wish] = await query(wishTitleSQL, [wishId]);
    const wishTitle = wish?.title;

    // Create a notification about the wish deletion
    const childUsername = await getChildUsername(userId);
    const notificationMessage = `${childUsername} has deleted a wish: ${wishTitle}`;
    const notificationInsertSQL = 'INSERT INTO notifications (user_id, parent_id, message, wish_id) VALUES (?, ?, ?, ?)';
    await query(notificationInsertSQL, [userId, req.session.user.parent_id, notificationMessage, wishId]);

    // Retrieve the ID of the newly created notification
    const lastIdSql = 'SELECT LAST_INSERT_ID() as id';
    const idResult = await query(lastIdSql);
    const notificationId = idResult[0]?.id;

    // Delete the wish
    const deleteWishSQL = 'DELETE FROM wishes WHERE id = ? AND user_id = ?';
    await query(deleteWishSQL, [wishId, userId]);

    await query('COMMIT');

    if (childUsername) {
      const parentSocketId = getSocketIdByUserId(req.session.user.parent_id);
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
