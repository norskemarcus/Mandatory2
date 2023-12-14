import socket from '../sockets/socket.js';

export function initializeSocketListeners(addNotification, addSuggestion, showToast) {
  socket.on('new-wish', async data => {
    const notificationMessage = `${data.childUsername} added a new wish: ${data.wish.title}`;

    addNotification({
      message: notificationMessage,
      link: `/wishlist`, // TODO: refactor with an optional parameter
      color: 'default',
      id: data.notificationId,
    });
  });

  socket.on('wish-deleted', async data => {
    console.log('wish-deleted:', data);

    addNotification({
      message: `${data.childUsername} has deleted a wish: ${data.wish.title}`,
      link: `/childsWishlist`,
      type: 'alert',
      id: data.notificationId,
    });
  });

  socket.on('new-suggestion', async data => {
    addSuggestion({
      title: `You have a new wish suggestion: ${data.wish.title}`,
      url: data.wish.url,
      wish: data.wish,
      id: data.suggestionId,
    });
  });

  socket.on('suggestion-response', data => {
    if (showToast) {
      showToast(data.message);
    }
  });
}

// socket.on('suggestion-deleted', data => {
//   const deletedSuggestionId = data.suggestionId;

//   suggestions.update(currentSuggestions => {
//     return currentSuggestions.filter(suggestion => suggestion.id !== deletedSuggestionId);
//   });
// });

export function respondToSuggestion(suggestionId, response) {
  socket.emit('respond-to-suggestion', { suggestionId: suggestionId, response: response });
}
