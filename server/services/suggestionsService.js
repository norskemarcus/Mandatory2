import { query } from '../database/connection.js';

async function fetchSuggestions(childId) {
  const selectSql = 'SELECT * FROM suggestions WHERE child_id = ?';
  try {
    const suggestions = await query(selectSql, [childId]);
    return suggestions;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    throw error; // Propagate the error to be handled by the caller
  }
}

async function checkExistingSuggestion(childId, parentUserId) {
  const checkSql = 'SELECT * FROM suggestions WHERE child_id = ? AND parent_user_id = ?';
  const checkResult = await query(checkSql, [childId, parentUserId]);
  return checkResult.length > 0;
}

async function insertSuggestion(wish, childId, parentUserId) {
  if (!wish || !wish.title || !wish.url) {
    console.error('Invalid or incomplete wish object:', wish);
    return false;
  }

  const { title, description = null, price = null, url, imageUrl = null, currency = null } = wish;

  const insertSql = `INSERT INTO suggestions (parent_user_id, child_id, title, description, price, url, image_url, currency) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  const insertResult = await query(insertSql, [parentUserId, childId, title, description, price, url, imageUrl, currency]);

  return insertResult.affectedRows > 0;
}

export { fetchSuggestions, checkExistingSuggestion, insertSuggestion };
