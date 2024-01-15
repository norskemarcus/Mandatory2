import socket from '../sockets/socket.js';

export function initializeSocketListeners(addNotification, addSuggestion) {
  socket.on('new-wish', data => {
    addNotification({
      message: `${data.childUsername} added a new wish: ${data.wish.title}`,
      link: `/wishlist`,
      color: 'default',
      id: data.notificationId,
    });
  });

  socket.on('wish-deleted', data => {
    addNotification({
      message: `${data.childUsername} has deleted a wish: ${data.wish}`,
      link: `/wishlist`,
      type: 'alert',
      id: data.notificationId,
    });
  });

  socket.on('new-suggestion', data => {
    addSuggestion({
      title: `You have a new wish suggestion: ${data.wish.title}`,
      url: data.wish.url,
      wish: data.wish,
      id: data.suggestionId,
    });
  });

  socket.on('suggestion-response', data => {
    addNotification({
      message: `${data.message}`,
      link: data.url,
      id: data.suggestionId,
    });
  });
}
