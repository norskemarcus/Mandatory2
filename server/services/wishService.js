import { saveNotification } from '../services/notificationService.js';
import { getParentId, getChildUsername } from '../services/userService.js';
import { getSocketIdByUserId } from '../sockets/socketManager.js';
import { query } from '../database/connection.js';

export async function createWish(io, userId, title, description, price, url, imageUrl) {
  try {
    if (url) {
      const checkExistingURLSQL = 'SELECT id FROM wishes WHERE url = ? AND user_id = ?';
      const existingWishesByURL = await query(checkExistingURLSQL, [url, userId]);

      if (existingWishesByURL.length > 0) {
        return { error: 'A wish with this URL already exists' };
      }
    } else {
      const checkExistingTitleSQL = 'SELECT id FROM wishes WHERE title = ? AND user_id = ?';
      const existingWishesByTitle = await query(checkExistingTitleSQL, [title, userId]);

      if (existingWishesByTitle.length > 0) {
        return { error: 'A wish with this title already exists' };
      }
    }
    const insertSQL = 'INSERT INTO wishes (title, description, price, url, image_url, user_id) VALUES (?, ?, ?, ?, ?, ?)';

    const priceValue = price ? parseFloat(price) : null;

    const insertResults = await query(insertSQL, [title, description, priceValue, url, imageUrl, userId]);

    if (insertResults.insertId) {
      const newWish = { title, description, price: priceValue, url, imageUrl };
      const childUsername = await getChildUsername(userId);

      const parentId = await getParentId(userId);

      const notificationMessage = `${childUsername} added a new wish: ${title}`;
      const notificationId = await saveNotification(userId, parentId, notificationMessage, insertResults.insertId);

      emitNewWishEvent(io, userId, childUsername, newWish, notificationId, parentId);
    }
    return { message: 'Wish created successfully', wishId: insertResults.insertId };
  } catch (error) {
    console.error('Error creating wish:', error);
    throw new Error('Failed to create wish');
  }
}

function emitNewWishEvent(io, userId, childUsername, newWish, notificationId, parentId) {
  const parentSocketId = getSocketIdByUserId(parentId);
  if (parentSocketId) {
    io.to(parentSocketId).emit('new-wish', {
      userId: userId,
      childUsername: childUsername,
      wish: newWish,
      notificationId: notificationId,
    });
  }
}
