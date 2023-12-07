// import Router from 'express';
// const router = Router();
// import { query } from '../database/connection.js';
// import dotenv from 'dotenv';
// dotenv.config();

// router.get('/api/child/suggestions', async (req, res) => {
//   if (!req.session.user || req.session.user.role !== 'Child') {
//     return res.status(401).send({ error: 'Unauthorized' });
//   }

//   const childId = req.session.user.id;
//   try {
//     const suggestions = await getSuggestionsForChild(childId);
//     res.json(suggestions);
//   } catch (error) {
//     res.status(500).send({ error: 'Internal Server Error' });
//   }
// });

// router.post('/api/parent/suggestions', async (req, res) => {
//   try {
//     const { childId } = req.body;

//     if (!req.session.user || req.session.user.role !== 'Parent') {
//       return res.status(403).send({ message: 'Unauthorized' });
//     }

//     const parentUserId = req.session.user.id;

//     const checkSql = 'SELECT * FROM suggestions WHERE child_id = ? AND parent_id = ? AND wish_id = ?';
//     const checkResult = await query(checkSql, [childId, parentUserId, wishId]);

//     if (checkResult.length > 0) {
//       return res.status(200).send({ message: 'Suggestion already exists' });
//     }

//     const insertSql = 'INSERT INTO suggestions (parent_id, child_id, wish_id, suggestion_status) VALUES (?, ?, NULL, ?)';
//     const insertResult = await query(insertSql, [parentUserId, childId, 'pending']);

//     if (insertResult.affectedRows > 0) {
//       return res.status(201).send({ message: 'Suggestion saved successfully' });
//     }

//     return res.status(500).send({ error: 'Failed to save suggestion' });
//   } catch (error) {
//     console.error('Error saving suggestion:', error);
//     return res.status(500).send({ error: error.message });
//   }
// });

// router.post('/api/child/accept-suggestion', async (req, res) => {
//   try {
//     const { suggestionId, wishId } = req.body;
//     const childId = req.session.user.id;

//     const checkSql = 'SELECT * FROM suggestions WHERE id = ? AND child_id = ?';
//     const checkResult = await query(checkSql, [suggestionId, childId]);

//     if (checkResult.length === 0) {
//       return res.status(403).send({ message: 'Unauthorized: This suggestion does not belong to you' });
//     }

//     const updateSql = 'UPDATE suggestions SET wish_id = ?, suggestion_status = "accepted" WHERE id = ?';
//     const updateResult = await query(updateSql, [wishId, suggestionId]);

//     if (updateResult.affectedRows > 0) {
//       return res.status(200).send({ message: 'Suggestion accepted and converted to a wish' });
//     }

//     return res.status(500).send({ error: 'Failed to accept suggestion' });
//   } catch (error) {
//     console.error('Error accepting suggestion:', error);
//     return res.status(500).send({ error: error.message });
//   }
// });

// export default router;
