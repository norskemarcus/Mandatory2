import bcrypt from 'bcrypt';
import { query } from './connection.js';

const saltRounds = 13; // cost factor for hashing

export const createUsersTable = async () => {
  const createUserTableSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await query(createUserTableSQL);
    console.log('Users table created successfully');
  } catch (err) {
    console.error('Error creating the users table:', err);
    throw err;
  }
};

export async function signUp(email, password) {
  try {
    const selectSql = 'SELECT id FROM users WHERE email = ?';
    const existingUsers = await query(selectSql, [email]);
    if (existingUsers && existingUsers.length > 0) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertSql = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
    const role = 'Parent';

    const [results] = await query(insertSql, [email, hashedPassword, role]);
    return results.insertId;
  } catch (error) {
    throw error;
  }
}

//TODO: implement additional functionality where parents can invite their children to join the platform and assign them the 'Child' role during the invitation acceptance process

export async function logIn(email, password) {
  try {
    const sqlQuery = 'SELECT * FROM users WHERE email = ?';
    const results = await query(sqlQuery, [email]);

    if (results && results.length === 0) {
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
    throw error; // TODO: Lave en toast med fejlmelding
  }
}
