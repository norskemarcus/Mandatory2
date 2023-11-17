import connection from './connection';

// Create a new table for invitations that includes fields for a unique invitation identifier, the child's email, a role, and an expiration date.

// Develop logic to create an invitation record in the database when a parent invites a child.

// Send an email to the child with the invitation link (which includes the invitation identifier).

// Implement the Child Signup Endpoint:

// Develop the signup logic for children that verifies the invitation identifier and creates a user account with the 'children' role.


// CREATE TABLE invitations (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   email VARCHAR(255) NOT NULL,
//   invitation_token VARCHAR(255) NOT NULL UNIQUE,
//   role VARCHAR(50) NOT NULL,
//   expires_at DATETIME NOT NULL,
//   -- Add a status to track if the invitation is used
//   status ENUM('sent', 'accepted', 'expired') DEFAULT 'sent',
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );