import { query } from '../database/connection.js';

async function fetchSuggestions(childId) {
  const selectSql = 'SELECT * FROM suggestions WHERE child_id = ?';
  try {
    const suggestions = await query(selectSql, [childId]);
    return suggestions;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    throw error;
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

  const lastIdSql = `SELECT LAST_INSERT_ID() as id`;

  const insertResult = await query(insertSql, [parentUserId, childId, title, description, price, url, imageUrl, currency]);

  if (insertResult && insertResult.affectedRows > 0) {
    const idResult = await query(lastIdSql);
    return idResult[0].id;
  }

  return null;
}

export { fetchSuggestions, checkExistingSuggestion, insertSuggestion };
