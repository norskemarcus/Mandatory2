// import sqlite3 from 'sqlite3'; // npm install sqlite3

// // Create a new database in memory
// const db = new sqlite3.Database(':memory:');

// const sqlScript = `
//   CREATE TABLE lego_sets (
//     id INTEGER PRIMARY KEY,
//     name TEXT,
//     pieces INTEGER,
//     description TEXT
//   );
// `;

// db.serialize(() => {
//   db.exec(sqlScript, err => {
//     if (err) {
//       console.error('Error executing SQL script:', err);
//     } else {
//       console.log('Table created successfully');
//     }
//   });
// });

// // Export the 'db' object if needed
// export { db };
