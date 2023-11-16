import connection from './connection.js';

export const createLegoSetsTable = () => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS lego_sets (
      id INT PRIMARY KEY AUTO_INCREMENT,
      itemNumber INT,
      name TEXT,
      age INT,
      user_id INT, 
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;
  // user_id column is a foreign key that links to the id column of the users table, which is the primary key in that table.

  // The FOREIGN KEY allows actions such as CASCADE on delete or update, which can automatically delete or update rows in the lego_sets table when the related user is deleted or updated in the users table.

  connection.query(createTableSQL, err => {
    if (err) {
      console.error('Error creating the lego_sets table:', err);
    } else {
      console.log('Table lego_sets created successfully');
    }
  });
};
