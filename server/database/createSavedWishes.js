import { query } from './connection.js';

export const createSavedWishesTable = async () => {
  const createSavedWishesTableSQL = `
    CREATE TABLE IF NOT EXISTS saved_wishes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      wish_id INT NOT NULL,
      parent_user_id INT NOT NULL,
      saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      bought BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (wish_id) REFERENCES wishes(id), 
      FOREIGN KEY (parent_user_id) REFERENCES users(id) ON DELETE CASCADE
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
