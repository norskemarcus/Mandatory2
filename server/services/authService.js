import bcrypt from 'bcrypt';
import { query } from '../database/connection.js';

const saltRounds = 13;

export async function signUp(username, password) {
  try {
    const selectSql = 'SELECT id FROM users WHERE username = ?';
    const existingUsers = await query(selectSql, [username]);
    if (existingUsers.length > 0) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const role = 'Parent';

    const insertSql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    const params = [username, hashedPassword, role];
    const result = await query(insertSql, params);
    console.log(result);

    if (result.affectedRows && result.insertId) {
      return { id: result.insertId };
    } else {
      throw new Error('Insert failed');
    }
  } catch (error) {
    console.error('Error signing up user:', error);
    throw new Error('Error signing up user:', error);
  }
}

export async function signUpChild(username, password, parent_id) {
  const selectSql = 'SELECT id FROM users WHERE username = ?';
  const existingUsers = await query(selectSql, [username]);
  if (existingUsers.length > 0) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const role = 'Child';
  const insertSql = 'INSERT INTO users (username, password, role, parent_id) VALUES (?, ?, ?, ?)';
  const params = [username, hashedPassword, role, parent_id];

  const result = await query(insertSql, params);

  if (result.affectedRows && result.insertId) {
    return { id: result.insertId };
  } else {
    throw new Error('Insert failed');
  }
}

export async function logIn(username, password) {
  try {
    const sqlQuery = 'SELECT * FROM users WHERE username = ?';
    const results = await query(sqlQuery, [username]);

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
    throw error;
  }
}
