// Create a saved_wishes table that links wishes to a user (parent) account.

// CREATE TABLE saved_wishes (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   wish_id INT NOT NULL,
//   parent_user_id INT NOT NULL,
//   FOREIGN KEY (wish_id) REFERENCES wishes(id),
//   FOREIGN KEY (parent_user_id) REFERENCES users(id)
// );
