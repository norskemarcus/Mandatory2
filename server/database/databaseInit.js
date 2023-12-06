import { createUsersTable } from './createUsers.js';
import { createWishTable } from './createWishes.js';
import { createSavedWishesTable } from './createSavedWishes.js';

export const initializeDatabase = async () => {
  try {
    await createUsersTable();
    await createWishTable();
    await createSavedWishesTable();
    console.log('All tables created successfully');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
};
