import Router from 'express';
const router = Router();
import { query } from '../database/connection.js';
import dotenv from 'dotenv';
dotenv.config();

router.get('/api/wishes', async (req, res) => {
  if (!req.session.user) {
    console.log('User is not logged in');
    return res.status(401).send({ error: 'User is not logged in' });
  }
  let userId = req.session.user.id;
  if (userId) {
    const selectSql = `SELECT * FROM wishes WHERE user_id = ?`;

    try {
      const results = await query(selectSql, [userId]);
      res.send({ wishlist: results });
      console.log('Query results from get wishes (child):', results);
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  } else {
    return res.status(401).send({ error: 'User session data not found' });
  }
});

// General function to reuse code in 2 post
async function createWish(userId, title, description, price, url, imageUrl) {
  const checkExistingSQL = 'SELECT id FROM wishes WHERE title = ? AND user_id = ?';

  try {
    const existingWishes = await query(checkExistingSQL, [title, userId]);
    if (existingWishes.length > 0) {
      throw new Error('A wish with this title already exists');
    }

    const insertSQL = 'INSERT INTO wishes (title, description, price, url, image_url, user_id) VALUES (?, ?, ?, ?, ?, ?)';

    const priceValue = price ? parseFloat(price) : null;
    const insertResults = await query(insertSQL, [title, description, priceValue, url, imageUrl, userId]);

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

    const result = await createWish(userId, title, description, price, url, null, userId);
    res.status(201).send(result);
  } catch (error) {
    console.error('Error creating wish:', error);
    res.status(500).send({ error: 'Failed to create wish' });
  }
});

router.post('/api/wishes', async (req, res) => {
  try {
    const { title, description, price, url, imageUrl } = req.body;
    const userId = req.session.user.id;

    const result = await createWish(userId, title, description, price, url, imageUrl, userId);
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

router.delete('/api/wishes/:wishId', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send({ error: 'User is not logged in' });
  }

  const userId = req.session.user.id;
  const wishId = req.params.wishId;

  const checkExistingSQL = 'SELECT id, user_id FROM wishes WHERE id = ?';
  connection.query(checkExistingSQL, [wishId], (checkErr, results) => {
    if (checkErr) {
      console.error('Error checking for existing wish:', checkErr);
      return res.status(500).send({ error: 'Failed to check for existing wish' });
    }

    if (results.length === 0) {
      return res.status(404).send({ error: 'Wish not found' });
    }

    if (results[0].user_id !== userId) {
      return res.status(403).send({ error: 'Permission denied. You cannot delete this wish.' });
    }

    const deleteSQL = 'DELETE FROM wishes WHERE id = ?';
    connection.query(deleteSQL, [wishId], (deleteErr, result) => {
      if (deleteErr) {
        console.error('Error deleting wish:', deleteErr);
        return res.status(500).send({ error: 'Failed to delete wish' });
      }

      res.status(200).send({ message: 'Wish deleted successfully' });
    });
  });
});

export default router;
