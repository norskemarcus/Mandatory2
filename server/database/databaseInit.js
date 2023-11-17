import connection from './connection.js';
import { createUsersTable } from './authDatabase.js';
import { createWishTable } from './createWishTable.js';

export const initializeDatabase = async () => {
  await createUsersTable(connection);
  await createWishTable(connection);
};
