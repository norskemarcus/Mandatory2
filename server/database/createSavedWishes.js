// Create a saved_wishes table that links wishes to a user (parent) account.

import { query } from './connection.js'; // Ensure this is the promise-based query function

export const createSavedWishesTable = async () => {
  const createSavedWishesTableSQL = `
    CREATE TABLE IF NOT EXISTS saved_wishes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      wish_id INT NOT NULL,
      parent_user_id INT NOT NULL,
      FOREIGN KEY (wish_id) REFERENCES wishes(id),
      FOREIGN KEY (parent_user_id) REFERENCES users(id)
    );
  `;

  try {
    await query(createSavedWishesTableSQL);
    console.log('Saved_wishes table created successfully');
  } catch (err) {
    console.error('Error creating the saved_wishes table:', err);
    throw err;
  }
};
