import { query } from './connection.js';

export const createInvitationsTable = async () => {
  const createInvitationsTableSQL = `
  CREATE TABLE IF NOT EXISTS invitations(
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    invitation_token VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL,
    expires_at DATETIME NOT NULL,
    status ENUM('sent', 'accepted', 'expired') DEFAULT 'sent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `;

  try {
    await query(createInvitationsTableSQL);
    console.log('Invitations table created successfully');
  } catch (err) {
    console.error('Error creating the invitations table:', err);
  }
};

//   connection.query(createInvitationsTableSQL, err => {
//     if (err) {
//       console.error('Error creating the invitations table:', err);
//     } else {
//       console.log('Invitations table created successfully');
//     }
//   });
// };

// Develop logic to create an invitation record in the database when a parent invites a child.

// Send an email to the child with the invitation link (which includes the invitation identifier).

// Implement the Child Signup Endpoint:

// Develop the signup logic for children that verifies the invitation identifier and creates a user account with the 'children' role.
