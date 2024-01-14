import Router from 'express';
import { query } from '../database/connection.js';
import { fetchSuggestions, insertSuggestion } from '../services/suggestionsService.js';
import dotenv from 'dotenv';
import { getSocketIdByUserId } from '../sockets/socketManager.js';
import { getParentId } from '../services/userService.js';
import { saveNotification } from '../services/notificationService.js';
import sanitizeHtml from 'sanitize-html';
dotenv.config();

const router = Router();

router.get('/api/children/suggestions/:childId', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'Child') {
    return res.status(401).send({ error: 'Unauthorized' });
  }
  const childId = req.params.childId;

  try {
    const suggestions = await fetchSuggestions(childId);
    res.send({ suggestions });
  } catch (error) {
    console.error('Error in GET /api/children/suggestions:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

router.post('/api/parents/suggestions', async (req, res) => {
  try {
    let { childId, wish } = req.body;
    const parentUserId = req.session.user?.id;

    if (!parentUserId || req.session.user.role !== 'Parent') {
      return res.status(403).send({ message: 'Unauthorized' });
    }

    wish = {
      title: sanitizeHtml(wish.title),
      description: sanitizeHtml(wish.description),
      price: wish.price,
      url: sanitizeHtml(wish.url),
      imageUrl: wish.imageUrl ? sanitizeHtml(wish.imageUrl) : null,
      currency: wish.currency ? sanitizeHtml(wish.currency) : null,
    };

    const suggestionId = await insertSuggestion(wish, childId, parentUserId);

    if (suggestionId) {
      const childSocketId = getSocketIdByUserId(childId);

      if (childSocketId) {
        req.io.to(childSocketId).emit('new-suggestion', { childId: childId, wish, suggestionId: suggestionId });
      }
    }

    res.status(200).send({ message: 'Suggestion sent successfully' });
  } catch (error) {
    console.error('Error in sending suggestion:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

router.post('/api/children/responds-to-suggestions', async (req, res) => {
  try {
    const { suggestionId, response } = req.body;
    const userId = req.session.user.id;
    const childUsername = req.session.user.username;
    const parentId = await getParentId(userId);
    const parentSocketId = getSocketIdByUserId(parentId);

    if (!userId || req.session.user.role !== 'Child') {
      return res.status(403).send({ message: 'Unauthorized' });
    }

    const result = await acceptSuggestion(suggestionId, userId);

    if (result.error) {
      return res.status(500).send({ message: result.error });
    }

    if (response === 'accept') {
      await deleteSuggestion(suggestionId);

      if (parentSocketId) {
        const message = `${childUsername} liked "${result.title}" and saved it!`;

        const notificationId = await saveNotification(userId, parentId, message);

        req.io.to(parentSocketId).emit('suggestion-response', {
          suggestionId: suggestionId,
          message: message,
          url: result.url,
          notificationId: notificationId,
        });
      }

      res.status(200).send(result);
    } else if (response === 'deny') {
      await deleteSuggestion(suggestionId);

      if (parentSocketId) {
        const message = `${childUsername} did not like the "${result.title}" and denied it.`;

        const notificationId = await saveNotification(userId, parentId, message);

        req.io.to(parentSocketId).emit('suggestion-response', {
          suggestionId: suggestionId,
          message: message,
          url: result.url,
          notificationId: notificationId,
        });
      }

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

    await createWishFromSuggestion(userId, suggestion.title, suggestion.description, suggestion.price, suggestion.url, suggestion.image_url);

    await deleteSuggestion(suggestionId);

    return { message: 'Suggestion accepted and wish created', title: suggestion.title, url: suggestion.url };
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

    const insertSQL = 'INSERT INTO wishes (title, description, price, url, image_url, user_id) VALUES (?, ?, ?, ?, ?, ?)';

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

    return { message: 'Suggestion successfully deleted', deletedCount: result.affectedRows };
  } catch (error) {
    console.error('Error in deleteSuggestion:', error.message);
    return { error: 'Failed to delete suggestion', details: error.message };
  }
}

export default router;
