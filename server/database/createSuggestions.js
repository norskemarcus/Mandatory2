import { query } from './connection.js';

export const createSuggestionsTable = async () => {
  const createSuggestionsTableSQL = `
  CREATE TABLE IF NOT EXISTS suggestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_user_id INT,
    child_id INT,
    title VARCHAR(255),
    description TEXT,
    price DECIMAL(10, 2),
    url TEXT,
    image_url TEXT,
    currency VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(255) DEFAULT 'pending',
    FOREIGN KEY (parent_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (child_id) REFERENCES users(id)
  );

  `;

  try {
    await query(createSuggestionsTableSQL);
    console.log('Suggestions table created successfully');
  } catch (err) {
    console.error('Error creating the suggestions table:', err);
    throw err;
  }
};
