import { query } from '../database/connection.js';

export async function getParentId(childId) {
  try {
    const sql = 'SELECT parent_id FROM users WHERE id = ?';
    const results = await query(sql, [childId]);

    if (results.length > 0 && results[0].parent_id) {
      return results[0].parent_id;
    } else {
      throw new Error('Parent ID not found for the given child ID');
    }
  } catch (error) {
    console.error('Error fetching parent ID:', error);
    throw error;
  }
}

export async function getChildUsername(userId) {
  const getChildUserameSQL = 'SELECT username FROM users WHERE id = ?';
  try {
    const result = await query(getChildUserameSQL, [userId]);
    return result[0]?.username;
  } catch (error) {
    console.error('Error fetching child username:', error);
    throw new Error('Failed to fetch child username');
  }
}
