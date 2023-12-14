import { query } from './connection.js';

export const createNotificationsTable = async () => {
  const createNotificationsTableSQL = `
  CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wish_id INT,
    user_id INT,
    parent_id INT,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE
  );
  `;

  try {
    await query(createNotificationsTableSQL);
    console.log('Notifications table created successfully');
  } catch (err) {
    console.error('Error creating the notifications table:', err);
    throw err;
  }
};
