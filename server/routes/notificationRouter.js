import Router from 'express';

const router = Router();

router.get('/notifications', async (req, res) => {
  try {
    // TODO: WRITE THIS BETTER:
    const parent_id = req.query.parent_id;
    const child_id = req.query.child_id;

    let querySQL = 'SELECT * FROM notifications';
    let queryParams = [];

    if (parent_id) {
      querySQL += ' WHERE parent_id = ?';
      queryParams.push(parent_id);
    } else if (child_id) {
      querySQL += ' WHERE child_id = ?';
      queryParams.push(child_id);
    }

    const notifications = await query(querySQL, queryParams);
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

router.post('/notifications', async (req, res) => {
  try {
    const { parent_id, child_id, message } = req.body;

    // Validation logic can be added here as needed

    const insertSQL = 'INSERT INTO notifications (parent_id, child_id, message) VALUES (?, ?, ?)';
    await query(insertSQL, [parent_id, child_id, message]);

    res.status(201).send({ message: 'Notification created successfully' });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

router.delete('/notifications/:id', async (req, res) => {
  try {
    const notificationId = req.params.id;

    const deleteSQL = 'DELETE FROM notifications WHERE id = ?';
    await query(deleteSQL, [notificationId]);

    res.status(200).send({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

export default router;
