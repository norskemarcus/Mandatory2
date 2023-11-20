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
    throw err; // Rethrow the error to be caught by the caller
  }
};

// import connection from './connection';

//   connection.query(createSavedWishesTableSQL, err => {
//     if (err) {
//       console.error('Error creating the saved_wishes table:', err);
//     } else {
//       console.log('Saved_wishes table created successfully');
//     }
//   });
// };

// FOREIGN KEY (wish_id) REFERENCES wishes(id): This sets up a foreign key relationship between saved_wishes.wish_id and the wishes.id column. It ensures that each wish_id in the saved_wishes table corresponds to a valid wish.

// FOREIGN KEY (parent_user_id) REFERENCES users(id): Similarly, this sets up a foreign key relationship between saved_wishes.parent_user_id and the users.id column, ensuring that each parent_user_id corresponds to a valid user.
