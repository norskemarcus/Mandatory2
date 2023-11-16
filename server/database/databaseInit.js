import connection from './connection.js';
import { createUsersTable } from './authDatabase.js';
import { createLegoSetsTable } from './createLegoset.js';

export const initializeDatabase = async () => {
  await createUsersTable(connection);
  await createLegoSetsTable(connection);
};
