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
