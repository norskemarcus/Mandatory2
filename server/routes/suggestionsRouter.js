import Router from 'express';
import { query } from '../database/connection.js';
import { fetchSuggestions, checkExistingSuggestion, insertSuggestion } from '../services/suggestionsService.js';
import dotenv from 'dotenv';
dotenv.config();

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

    const suggestionId = await insertSuggestion(wish, childId, parentUserId);

    if (suggestionId) {
      req.io.emit('new-suggestion', { childId: childId, wish, suggestionId: suggestionId });

      return res.status(201).send({ message: 'Suggestion saved successfully', suggestionId: suggestionId });
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

    if (!userId || req.session.user.role !== 'Child') {
      return res.status(403).send({ message: 'Unauthorized' });
    }

    if (response === 'accept') {
      const result = await acceptSuggestion(suggestionId, userId);

      await deleteSuggestion(suggestionId);

      req.io.emit('suggestion-deleted', { suggestionId: suggestionId });

      // const parentUserId = await getParentId(userId);

      // req.io.to(parentUserId).emit('suggestion-response', {
      //   message: `Your suggestion of ${result.title} was accepted by ${userId.username}.`,
      // });

      res.status(200).send(result);
    } else if (response === 'deny') {
      const result = await deleteSuggestion(suggestionId);

      const parentId = await getParentId(userId);

      req.io.to(parentId).emit('suggestion-response', {
        message: `Your suggestion of ${result.title} was not accepted by ${userId.username}.`,
      });
      res.status(200).send(result);
    } else {
      res.status(400).send({ error: 'Invalid response' });
    }
  } catch (error) {
    console.error('Error responding to suggestion:', error);
    res.status(500).send({ error: 'Failed to process suggestion response' });
  }
});

async function getParentId(userId) {
  const parentIdSQL = 'SELECT parent_id FROM users WHERE id = ?;';
  const parent_id_result = await query(parentIdSQL, [userId]);

  console.log('parent_id_result :', parent_id_result.parent_id);

  if (parent_id_result.length === 0) {
    return { error: 'ParentId not found' };
  }

  return parent_id_result[0].parent_id;
}

async function acceptSuggestion(suggestionId, userId) {
  try {
    const getSuggestionSQL = 'SELECT * FROM suggestions WHERE id = ?';
    const suggestions = await query(getSuggestionSQL, [suggestionId]);

    if (suggestions.length === 0) {
      return { error: 'Suggestion not found' };
    }

    const suggestion = suggestions[0];

    // misses currency
    const wishResult = await createWishFromSuggestion(userId, suggestion.title, suggestion.description, suggestion.price, suggestion.url, suggestion.image_url);

    console.log('wishResult:', wishResult); // TODO: FJERNE

    await deleteSuggestion(suggestionId);
    console.log('deleteSuggestion'); // TODO: FJERNE

    return { message: 'Suggestion accepted and wish created' };
  } catch (error) {
    console.error('Error in acceptSuggestion:', error);
    return { error: 'Failed to accept suggestion' };
  }
}

async function createWishFromSuggestion(userId, title, description, price, url, imageUrl) {
  try {
    const checkExistingSQL = 'SELECT id FROM wishes WHERE url = ? AND user_id = ?';
    const existingWishes = await query(checkExistingSQL, [url, userId]);

    if (existingWishes.length > 0) {
      return { error: 'A wish with this URL already exists' };
    }
    // TODO: currency misses

    const insertSQL = 'INSERT INTO wishes (title, description, price, url, image_url, user_id) VALUES (?, ?, ?, ?, ?, ?)';

    //     const priceValue = price ? parseFloat(price) : null;  // TODO: FJERNE?????
    const priceValue = price && !isNaN(parseFloat(price)) ? parseFloat(price) : null;

    const result = await query(insertSQL, [title, description, priceValue, url, imageUrl, userId]);

    if (result.ok) {
      return { message: 'Wish created successfully', wishId: insertResults.insertId };
    }
  } catch (error) {
    console.error('Error creating wish:', error);
    throw new Error('Failed to create wish');
  }
}

async function deleteSuggestion(suggestionId) {
  try {
    if (!suggestionId) {
      throw new Error('No suggestionId provided');
    }

    const deleteSuggestionSQL = 'DELETE FROM suggestions WHERE id = ?';
    const result = await query(deleteSuggestionSQL, [suggestionId]);

    if (result.affectedRows === 0) {
      throw new Error('No suggestion found with the provided ID');
    }

    return { message: 'Suggestion successfully deleted', deletedCount: result.affectedRows };
  } catch (error) {
    console.error('Error in deleteSuggestion:', error.message);
    return { error: 'Failed to delete suggestion', details: error.message };
  }
}

export default router;
