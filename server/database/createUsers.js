import { query } from './connection.js';

export const createUsersTable = async () => {
  const createUserTableSQL = `
    CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('Parent', 'Child') NOT NULL,
        parent_id INT, 
        FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `;

  try {
    await query(createUserTableSQL);
    console.log('Users table created successfully');
  } catch (err) {
    console.error('Error creating the users table:', err);
    throw err;
  }
};
