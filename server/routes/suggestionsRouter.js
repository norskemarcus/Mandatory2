import Router from 'express';
import { query } from '../database/connection.js';
import { getSuggestions, checkExistingSuggestion, insertSuggestion } from '../services/suggestionsService.js';
import dotenv from 'dotenv';
dotenv.config();
import { getUserId } from '../sockets/socketStore.js';

const suggestionsRouter = (io, socketUserMap) => {
  const router = Router();

  router.get('/api/child/suggestions', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'Child') {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const childId = req.session.user.id;
    try {
      const suggestions = await getSuggestions(childId);
      res.json({ suggestions });
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

      const userId = getUserId(someSocketId);

      if (!parentUserId || req.session.user.role !== 'Parent') {
        return res.status(403).send({ message: 'Unauthorized' });
      }

      // const suggestionExists = await checkExistingSuggestion(childId, parentUserId);
      // if (suggestionExists) {
      //   return res.status(200).send({ message: 'Suggestion already exists' });
      // }

      const suggestionSaved = await insertSuggestion(wish);

      if (suggestionSaved) {
        const childSocketId = Object.keys(socketUserMap).find(key => socketUserMap[key] === childId);

        // Emit the event to the child's socket if the socket ID is found
        if (childSocketId) {
          req.io.to(childSocketId).emit('wish-suggested', { wish: wish, fromParentId: parentUserId });
        }

        // socket.emit('wish-suggested', { childId: selectedChild.id, wish, suggestionId: data.suggestionId });

        return res.status(201).send({ message: 'Suggestion saved successfully', suggestionId: suggestionSaved.id });
      } else {
        return res.status(500).send({ error: 'Failed to save suggestion' });
      }
    } catch (error) {
      console.error('Error saving suggestion:', error);
      return res.status(500).send({ error: error.message });
    }
  });

  router.post('/api/child/accept-suggestion', async (req, res) => {
    try {
      const { suggestionId, wishId } = req.body;
      const childId = req.session.user.id;

      const checkSql = 'SELECT * FROM suggestions WHERE id = ? AND child_id = ?';
      const checkResult = await query(checkSql, [suggestionId, childId]);

      if (checkResult.length === 0) {
        return res.status(403).send({ message: 'Unauthorized: This suggestion does not belong to you' });
      }

      const updateSql = 'UPDATE suggestions SET wish_id = ?, suggestion_status = "accepted" WHERE id = ?';
      const updateResult = await query(updateSql, [wishId, suggestionId]);

      if (updateResult.affectedRows > 0) {
        return res.status(200).send({ message: 'Suggestion accepted and converted to a wish' });
      }

      return res.status(500).send({ error: 'Failed to accept suggestion' });
    } catch (error) {
      console.error('Error accepting suggestion:', error);
      return res.status(500).send({ error: error.message });
    }
  });

  return router;
};
export default suggestionsRouter;
