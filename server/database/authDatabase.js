import bcrypt from 'bcrypt';
import connection from './connection.js';

const saltRounds = 10; // cost factor for hashing

export const createUsersTable = () => {
  const createUserTableSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  connection.query(createUserTableSQL, err => {
    if (err) {
      console.error('Error creating the users table:', err);
    } else {
      console.log('Users table created successfully');
    }
  });
};

export async function signUp(email, password) {
  try {
    const selectSql = 'SELECT id FROM users WHERE email = ?';
    const [existingUsers] = await connection.promise().query(selectSql, [email]);
    if (existingUsers.length > 0) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertSql = 'INSERT INTO users (email, password) VALUES (?, ?)';

    const [results] = await connection.promise().query(insertSql, [email, hashedPassword]);
    return results.insertId;
  } catch (error) {
    throw error;
  }
}

export async function logIn(email, password) {
  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [results] = await connection.promise().query(query, [email]);

    if (results.length === 0) {
      throw new Error('User not found');
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error('Password is incorrect');
    }

    delete user.password;
    return user;
  } catch (error) {
    throw error; // You might want to handle it differently depending on your error handling strategy
  }
}

// export const logIn = async (email, password) => {
//   try {
//     const query = 'SELECT * FROM users WHERE email = ?';

//     return new Promise((resolve, reject) => {
//       connection.query(query, [email], async (error, results) => {
//         if (error) {
//           reject(error);
//         } else if (results.length === 0) {
//           reject(new Error('User not found'));
//         } else {
//           const isMatch = await bcrypt.compare(password, results[0].password);
//           if (isMatch) {
//             resolve(results[0]);
//           } else {
//             reject(new Error('Password is incorrect'));
//           }
//         }
//       });
//     });
//   } catch (error) {
//     throw error;
//   }
// };
