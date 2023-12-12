import socket from '../sockets/socket.js';
import { suggestions } from '../stores/suggestionStore';

export function initializeSocketListeners(addNotification, addSuggestion) {
  socket.on('new-wish', async data => {
    const notificationMessage = `${data.childUsername} added a new wish: ${data.wish.title}`;

    addNotification({
      message: notificationMessage,
      link: `/wishlist`, // TODO: refactor with an optional parameter
      color: 'default',
    });
  });

  socket.on('wish-deleted', async data => {
    console.log('wish-deleted:', data);

    addNotification({
      message: `${data.childUsername} has deleted a wish: ${data.wish.title}`,
      link: `/childsWishlist`,
      type: 'alert',
    });
  });

  // TODO: CHECK IF THIS IS CORRECT!!
  socket.on('new-suggestion', async data => {
    addSuggestion({
      message: `You have a new wish suggestion: ${data.wish.title}`,
      link: `/wishlist/${data.wish.id}`, // Assuming data.wish.id exists
      wish: data.wish, // Storing the entire wish object for future use
    });
  });

  // parents should get to know what the child answered to the suggestion
  socket.on('child-responded', data => {
    // Update the UI based on the child's response
  });
}

export function respondToSuggestion(suggestionId, response) {
  socket.emit('respond-to-suggestion', { suggestionId: suggestionId, response: response });
}

// async function saveWishDeletedNotification(childUsername, wishTitle) {
//   try {
//     const response = await fetch('http://localhost:8080/notifications', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         message: `${childUsername} has deleted a wish: ${wishTitle}`,
//         link: '/childsWishlist',
//         type: 'alert',
//       }),
//       credentials: 'include',
//     });

//     if (!response.ok) {
//       throw new Error('Failed to send wish-deleted notification');
//     }

//     console.log('Notification successfully sent');
//   } catch (error) {
//     console.error('Error sending wish-deleted notification:', error);
//     throw error;
//   }
// }
