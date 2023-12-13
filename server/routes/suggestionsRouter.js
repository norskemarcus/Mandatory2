import Router from 'express';
import { query } from '../database/connection.js';
import { fetchSuggestions, checkExistingSuggestion, insertSuggestion } from '../services/suggestionsService.js';
import dotenv from 'dotenv';
dotenv.config();
import { createWish } from './wishRouter.js';

const router = Router();

router.get('/api/child/suggestions/:childId', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'Child') {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  const childId = req.params.childId;
  // TODO: WHATS BEST TO USE  ?????*******************************************************************
  //const childId = req.session.user.id;

  try {
    const suggestions = await fetchSuggestions(childId);
    res.send({ suggestions });
    console.log('suggestions in the router.get:', suggestions);
  } catch (error) {
    console.error('Error in GET /api/child/suggestions:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

router.post('/api/parent/suggestions', async (req, res) => {
  try {
    // Destructure wish from the request body
    const { childId, wish } = req.body;
    const parentUserId = req.session.user?.id;

    if (!parentUserId || req.session.user.role !== 'Parent') {
      return res.status(403).send({ message: 'Unauthorized' });
    }

    const suggestionSaved = await insertSuggestion(wish, childId, parentUserId);

    if (suggestionSaved) {
      // Er user logget ind, kun sende hvis logget ind -
      req.io.emit('new-suggestion', { childId: childId, wish, suggestionId: suggestionSaved.id });
      return res.status(201).send({ message: 'Suggestion saved successfully', suggestionId: suggestionSaved.id });
    } else {
      return res.status(500).send({ error: 'Failed to save suggestion' });
    }
  } catch (error) {
    console.error('Error saving suggestion:', error);
    return res.status(500).send({ error: error.message });
  }
});

router.post('/api/child/respond-to-suggestion', async (req, res) => {
  try {
    const { suggestionId, response } = req.body;
    const userId = req.session.user.id;

    if (response === 'accept') {
      const result = await acceptSuggestion(suggestionId, userId);
      res.status(200).send(result);
    } else if (response === 'deny') {
      const result = await deleteSuggestion(suggestionId);
      res.status(200).send(result);
    } else {
      res.status(400).send({ error: 'Invalid response' });
    }
  } catch (error) {
    console.error('Error responding to suggestion:', error);
    res.status(500).send({ error: 'Failed to process suggestion response' });
  }
});

async function acceptSuggestion(suggestionId, userId) {
  try {
    const getSuggestionSQL = 'SELECT * FROM suggestions WHERE id = ?';
    const suggestions = await query(getSuggestionSQL, [suggestionId]);

    if (suggestions.length === 0) {
      return { error: 'Suggestion not found' };
    }

    const suggestion = suggestions[0];

    const wishResult = await createWish(suggestion.title, suggestion.description, suggestion.price, suggestion.url, suggestion.image_url, userId);

    if (wishResult.error) {
      return { error: wishResult.error };
    }

    await deleteSuggestion(suggestionId);

    return { message: 'Suggestion accepted and wish created' };
  } catch (error) {
    console.error('Error in acceptSuggestion:', error);
    return { error: 'Failed to accept suggestion' };
  }
}

async function deleteSuggestion(suggestionId) {
  try {
    const deleteSuggestionSQL = 'DELETE FROM suggestions WHERE id = ?';
    await query(deleteSuggestionSQL, [suggestionId]);

    return { message: 'Suggestion denied' };
  } catch (error) {
    console.error('Error in denySuggestion:', error);
    return { error: 'Failed to deny suggestion' };
  }
}

export default router;
