import Router from 'express';
const router = Router();

import { connection } from '../database/mysqlDatabase.mjs';

//  get all Lego sets
router.get('/api/legosets', (req, res) => {
  const query = 'SELECT * FROM lego_sets';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ legoSets: results });
  });
});

//  create a new Lego set
router.post('/api/legosets', (req, res) => {
  // Parse and validate the incoming data from the client
  const { itemNumber, name, age } = req.body;

  const sql = 'INSERT INTO lego_sets (itemNumber, name, age) VALUES (?, ?, ?)';
  connection.query(sql, [itemNumber, name, age], (err, result) => {
    if (err) {
      console.error('Error inserting Lego set:', err);
      return res.status(500).json({ error: 'Failed to insert Lego set' });
    }

    res.status(201).send({ message: 'Lego set created successfully', legoSetId: result.insertId });
  });
});

export default router;
