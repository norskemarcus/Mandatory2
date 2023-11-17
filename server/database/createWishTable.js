import connection from './connection.js';

export const createWishTable = () => {
  const createTableSQL = `
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

  // user_id column is a foreign key that links to the id column of the users table, which is the primary key in that table.

  // The FOREIGN KEY allows actions such as CASCADE on delete or update, which can automatically delete or update rows in the lego_sets table when the related user is deleted or updated in the users table.

  connection.query(createTableSQL, err => {
    if (err) {
      console.error('Error creating the wish table:', err);
    } else {
      console.log('Table wishes created successfully');
    }
  });
};
