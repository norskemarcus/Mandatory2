export async function saveNotification(userId, parentId, message, wishId = null) {
  try {
    const notificationInsertSQL = 'INSERT INTO notifications (user_id, parent_id, message, wish_id) VALUES (?, ?, ?, ?)';

    const lastIdSql = 'SELECT LAST_INSERT_ID() as id';

    const insertResult = await query(notificationInsertSQL, [userId, parentId, message, wishId]);

    if (insertResult && insertResult.affectedRows > 0) {
      const idResult = await query(lastIdSql);
      return idResult[0].id;
    }

    return null;
  } catch (error) {
    console.error('Error saving notification:', error);
    throw error;
  }
}
