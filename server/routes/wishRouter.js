import Router from 'express';
const router = Router();
import { query } from '../database/connection.js';
import dotenv from 'dotenv';
dotenv.config();

// This is for the logged in child, who wants to see his or hers list and edit/delete button
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

// /api/parent/child-wishlist/${selectedChild.id}`,
// Define the route for fetching a child's wishlist
router.get('/api/parent/child-wishlist/:childId', async (req, res) => {
  try {
    const childId = req.params.childId;

    const selectSql = `SELECT * FROM wishes WHERE user_id = ?`;

    const results = await query(selectSql, [childId]);
    console.log(results);

    res.send({ wishlist: results });
  } catch (error) {
    console.error('Error fetching child wishlist:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// async function getChildUsername(userId) {
//   const getChildUserameSQL = 'SELECT username FROM users WHERE id = ?';
//   try {
//     const result = await query(getChildUserameSQL, [userId]);
//     return result[0]?.username;
//   } catch (error) {
//     console.error('Error fetching child username:', error);
//     throw new Error('Failed to fetch child username');
//   }
// }

async function createWish(io, userId, title, description, price, url, imageUrl) {
  const checkExistingSQL = 'SELECT id FROM wishes WHERE title = ? AND user_id = ?';

  try {
    // const childUsername = await getChildUsername(userId);

    const existingWishes = await query(checkExistingSQL, [title, userId]);
    if (existingWishes.length > 0) {
      return { error: 'A wish with this title already exists' };
    }

    const insertSQL = 'INSERT INTO wishes (title, description, price, url, image_url, user_id) VALUES (?, ?, ?, ?, ?, ?)';

    const priceValue = price ? parseFloat(price) : null;
    const insertResults = await query(insertSQL, [title, description, priceValue, url, imageUrl, userId]);

    if (insertResults.insertId) {
      const newWish = { title, description, price: priceValue, url, imageUrl };
      // Emit the event
      // const notificationMessage = `${childUsername} added a new wish: ${title}`;
      // io.emit('new-wish', { userId: userId, message: notificationMessage, wish: newWish });

      io.emit('new-wish', { userId: userId, wish: newWish });
    }
    console.log('Wish created successfully, wishId:', insertResults.insertId);

    return { message: 'Wish created successfully', wishId: insertResults.insertId };
  } catch (error) {
    console.error('Error creating wish:', error);
    throw new Error('Failed to create wish');
  }
}

router.post('/api/form/wishes', async (req, res) => {
  try {
    const { title, description, price, url } = req.body;
    const userId = req.session.user.id;

    const result = await createWish(req.io, userId, title, description, price, url, null);

    if (result.error) {
      return res.status(400).send({ error: result.error });
    }

    res.status(201).send(result);
  } catch (error) {
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
// router.post('/api/wishes', async (req, res) => {
//   if (!req.session.user) {
//     console.log('User is not logged in');
//     return res.status(401).send({ error: 'User is not logged in' });
//   }

//   const userId = req.session.user.id;
//   const { title, description, price, url, imageUrl } = req.body;

//   const checkExistingSQL = 'SELECT id FROM wishes WHERE title = ? AND user_id = ?';

//   try {
//     const existingWishes = await query(checkExistingSQL, [title, userId]);
//     if (existingWishes.length > 0) {
//       return res.status(400).send({ error: 'A wish with this title already exists' });
//     }

//     const insertSQL = 'INSERT INTO wishes (title, description, price, url, image_url, user_id) VALUES (?, ?, ?, ?, ?, ?)';
//     const insertResults = await query(insertSQL, [title, description, price, url, imageUrl, userId]);

//     res.status(201).send({ message: 'Wish created successfully', wishId: insertResults.insertId });
//   } catch (error) {
//     console.error('Error processing your request:', error);
//     res.status(500).send({ error: 'Failed to process your request' });
//   }
// });

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

router.delete('/api/wishes/:wishId', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send({ error: 'User is not logged in' });
  }

  const userId = req.session.user.id;
  const wishId = req.params.wishId;

  try {
    await query('START TRANSACTION');
    const deleteSavedWishSQL = 'DELETE FROM saved_wishes WHERE wish_id = ?';
    await query(deleteSavedWishSQL, [wishId]);

    const deleteWishSQL = 'DELETE FROM wishes WHERE id = ? AND user_id = ?';
    await query(deleteWishSQL, [wishId, userId]);
    await query('COMMIT');

    res.status(200).send({ message: 'Wish deleted successfully' });
  } catch (error) {
    await query('ROLLBACK');
    console.error('Error during deleting wish:', error);
    res.status(500).send({ error: 'Failed to delete wish' });
  }
});

export default router;
