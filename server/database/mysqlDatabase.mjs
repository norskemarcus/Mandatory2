import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL server');

  // Create the database if it doesn't exist
  const createDatabaseSQL = 'CREATE DATABASE IF NOT EXISTS lego';

  connection.query(createDatabaseSQL, (err, results) => {
    if (err) {
      console.error('Error creating the database:', err);
    } else {
      if (results.warningStatus === 0) {
        console.log('Database lego created successfully');
      }
    }
    // Switch to the lego database
    connection.changeUser({ database: 'lego' }, err => {
      if (err) {
        console.error('Error switching to the lego database:', err);
        return;
      }
      console.log('Switched to the lego database');

      // Create the table if it doesn't exist
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS lego_sets (
          id INTEGER PRIMARY KEY AUTO_INCREMENT,
          itemNumber INTEGER,
          name TEXT,
          age INTEGER
        );
      `;

      connection.query(createTableSQL, err => {
        if (err) {
          console.error('Error creating the table:', err);
        } else {
          console.log('Table lego_sets created successfully');
        }
      });
    });
  });
});

export { connection };
