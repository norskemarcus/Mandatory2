import Router from 'express';
import { query } from '../database/connection.js';

const router = Router();

router.get('/notifications/:parentId', async (req, res) => {
  const parentId = req.params.parentId;
  try {
    const querySQL = 'SELECT * FROM notifications WHERE parent_Id = ?';
    const queryParams = [parentId];

    const notifications = await query(querySQL, queryParams);
    res.status(200).send(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

// router.post('/notifications', async (req, res) => {
//   try {
//     const { message } = req.body;

//     const userId = req.session.user.id;
//     console.log('userId:', userId);
//     const parentId = req.session.user.parent_id;

//     const insertSQL = 'INSERT INTO notifications (user_id,  parent_id, message) VALUES (?, ?, ?)';
//     await query(insertSQL, [userId, parentId, message]);

//     res.status(201).send({ message: 'Notification created successfully' });
//   } catch (error) {
//     console.error('Error creating notification:', error);
//     res.status(500).send({ error: 'Internal server error' });
//   }
// });

router.delete('/notifications/:id', async (req, res) => {
  const userRole = req.session.user.role;

  if (userRole === 'Parent') {
    try {
      const notificationId = req.params.id;

      const deleteSQL = 'DELETE FROM notifications WHERE id = ?';
      await query(deleteSQL, [notificationId]);

      res.status(200).send({ message: 'Notification deleted successfully' });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).send({ error: 'Internal server error' });
    }
  }
});

export default router;
