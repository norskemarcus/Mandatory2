import Router from 'express';
const router = Router();

import { connection } from '../database/mysqlDatabase.mjs';

router.get('/api/legosets', (req, res) => {
  const userId = req.session.user.uid;

  const query = 'SELECT * FROM lego_sets WHERE user_id = ?';

  connection.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send({ legoSets: results });
  });
});

router.post('/api/legosets', (req, res) => {
  if (!req.session.user) {
    console.log('User is not logged in');
    return res.status(401).send({ error: 'User is not logged in' });
  }

  const userId = req.session.user.uid; // Get the user's UID from the session
  const { itemNumber, name, age } = req.body;

  console.log('userId in the post:', userId);

  const checkExistingSQL = 'SELECT itemNumber FROM lego_sets WHERE itemNumber = ? AND user_id = ?';

  connection.query(checkExistingSQL, [itemNumber, userId], (checkErr, results) => {
    if (checkErr) {
      console.error('Error checking for existing Lego set:', checkErr);
      return res.status(500).send({ error: 'Failed to check for existing Lego set' });
    }

    if (results.length > 0) {
      return res.status(400).send({ error: 'The Lego set is already added to the database' });
    } else {
      const insertSQL = 'INSERT INTO lego_sets (itemNumber, name, age, user_id) VALUES (?, ?, ?, ?)';

      connection.query(insertSQL, [itemNumber, name, age, userId], (insertErr, result) => {
        if (insertErr) {
          console.error('Error inserting Lego set:', insertErr);
          return res.status(500).send({ error: 'Failed to insert Lego set' });
        }
        res.status(201).send({ message: 'Lego set created successfully', legoSetId: result.insertId });
      });
    }
  });
});

router.delete('/api/legosets/:itemNumber', (req, res) => {
  const userId = req.session.user.uid;
  const itemNumber = req.params.itemNumber;

  const checkExistingSQL = 'SELECT itemNumber, user_id FROM lego_sets WHERE itemNumber = ?';
  connection.query(checkExistingSQL, [itemNumber], (checkErr, results) => {
    if (checkErr) {
      console.error('Error checking for existing Lego set:', checkErr);
      return res.status(500).json({ error: 'Failed to check for existing Lego set' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Lego set not found' });
    }

    // Check if the Lego set belongs to the logged-in user
    if (results[0].user_id !== userId) {
      return res.status(403).json({ error: 'Permission denied. You cannot delete this Lego set.' });
    }

    const deleteSQL = 'DELETE FROM lego_sets WHERE itemNumber = ?';
    connection.query(deleteSQL, [itemNumber], (deleteErr, result) => {
      if (deleteErr) {
        console.error('Error deleting Lego set:', deleteErr);
        return res.status(500).json({ error: 'Failed to delete Lego set' });
      }

      res.status(200).send({ message: 'Lego set deleted successfully' });
    });
  });
});

export default router;
