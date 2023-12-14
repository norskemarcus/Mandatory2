import socket from '../sockets/socket.js';
import { suggestions } from '../stores/suggestionStore.js';

export function initializeSocketListeners(addNotification, addSuggestion) {
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
      message: `You have a new wish suggestion: ${data.wish.title}`,
      link: `/wishlist`, // TODO, fix this /${data.wish.id} **************************
      wish: data.wish,
      id: data.suggestionId,
    });
  });

  // TODO: THIS IS NOT WORKING!! ********************************
  socket.on('suggestion-response', data => {
    addNotification({
      message: `${data.wish.title} was accepted or denied by your child`,
    });
  });

  // TODO: THIS IS NOT WORKING ****************************
  socket.on('suggestion-deleted', data => {
    const deletedSuggestionId = data.suggestionId;

    suggestions.update(currentSuggestions => {
      return currentSuggestions.filter(suggestion => suggestion.id !== deletedSuggestionId);
    });
  });
}

export function respondToSuggestion(suggestionId, response) {
  socket.emit('respond-to-suggestion', { suggestionId: suggestionId, response: response });
}
