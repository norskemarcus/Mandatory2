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
    url VARCHAR(255),
    image_url VARCHAR(255),
    currency VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(255) DEFAULT 'pending',
    FOREIGN KEY (parent_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (child_id) REFERENCES users(id)
  );

  `;

  // When the child accepts the suggestion and it becomes a wish, you can update the suggestion row in the database to include the wishId and change the suggestion_status to "accepted."

  try {
    await query(createSuggestionsTableSQL);
    console.log('Suggestions table created successfully');
  } catch (err) {
    console.error('Error creating the suggestions table:', err);
    throw err;
  }
};

// CREATE TABLE IF NOT EXISTS suggestions (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   parent_user_id INT,
//   child_id INT,
//   wish_id INT,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   status VARCHAR(255) DEFAULT 'pending',
//   FOREIGN KEY (parent_user_id) REFERENCES users(id) ON DELETE CASCADE,
//   FOREIGN KEY (child_id) REFERENCES users(id),
//   FOREIGN KEY (wish_id) REFERENCES wishes(id)
// );
