import connection from './connection.js';
import { createUsersTable } from './authDatabase.js';
import { createWishTable } from './createWish.js';

export const initializeDatabase = async () => {
  await createUsersTable(connection);
  await createWishTable(connection);
};
