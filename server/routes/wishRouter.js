import Router from 'express';
const router = Router();
import connection from '../database/connection.js';
import dotenv from 'dotenv';
dotenv.config();

router.get('/api/wishes', async (req, res) => {
  if (!req.session.user) {
    console.log('User is not logged in');
    return res.status(401).send({ error: 'User is not logged in' });
  }

  let userId = req.session.user.id;

  if (userId) {
    const query = `SELECT * FROM wishes WHERE user_id = "${userId}"`;
    console.log('Query:', query);

    connection.query(query, (err, results) => {
      if (err) {
        return res.status(500).send({ error: err.message });
      }
      res.send({ wishlist: results });
      console.log('Query results:', results);
    });
  } else {
    return res.status(401).send({ error: 'User session data not found' });
  }
});

router.post('/api/wishes', (req, res) => {
  if (!req.session.user) {
    console.log('User is not logged in');
    return res.status(401).send({ error: 'User is not logged in' });
  }

  const userId = req.session.user.id;
  const { title, description, price, url, imageUrl } = req.body;

  const checkExistingSQL = 'SELECT id FROM wishes WHERE title = ? AND user_id = ?';

  connection.query(checkExistingSQL, [title, userId], (checkErr, results) => {
    if (checkErr) {
      console.error('Error checking for existing wish:', checkErr);
      return res.status(500).send({ error: 'Failed to check for existing wish' });
    }

    if (results.length > 0) {
      return res.status(400).send({ error: 'A wish with this title already exists' });
    } else {
      const insertSQL = 'INSERT INTO wishes (title, description, price, url, image_url, user_id) VALUES (?, ?, ?, ?, ?, ?)';

      connection.query(insertSQL, [title, description, price, url, imageUrl, userId], (insertErr, result) => {
        if (insertErr) {
          console.error('Error inserting wish:', insertErr);
          return res.status(500).send({ error: 'Failed to insert wish' });
        }
        res.status(201).send({ message: 'Wish created successfully', wishId: result.insertId });
      });
    }
  });
});

/// save-selected-wishes

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
