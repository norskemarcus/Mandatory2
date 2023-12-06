import { query } from './connection.js';

export const createWishTable = async () => {
  const createWishesSQL = `
  CREATE TABLE IF NOT EXISTS wishes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    description TEXT DEFAULT NULL,
    price DECIMAL(10,2) DEFAULT NULL,
    currency VARCHAR(3) DEFAULT NULL,
    url TEXT DEFAULT NULL,
    image_url TEXT DEFAULT NULL,
    user_id INT, 
    FOREIGN KEY (user_id) REFERENCES users(id)
  );`;



  try {
    await query(createWishesSQL);
    console.log('Wishes table created successfully');
  } catch (err) {
    console.error('Error creating the wishes table:', err);
    throw err;
  }
};
