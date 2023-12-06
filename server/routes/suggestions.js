import Router from 'express';
const router = Router();
import { query } from '../database/connection.js';
import dotenv from 'dotenv';
dotenv.config();

router.get('/api/child/suggestions', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'Child') {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  const childId = req.session.user.id;
  try {
    const suggestions = await getSuggestionsForChild(childId);
    res.json(suggestions);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Suggestion from parent to child
router.post('/api/suggest', async (req, res) => {
  const { childId, title, ...otherDetails } = req.body;

  // Logic to save the suggested wish for the child
  // ...

  res.status(200).send({ message: 'Wish suggested successfully' });
});


async function saveSuggestionToDatabase(data) {
  // Assuming data contains childId, title, and otherDetails
  const { childId, title, ...otherDetails } = data;

  // Logic to save the suggested wish in your database
  // ...
}

export default router;
