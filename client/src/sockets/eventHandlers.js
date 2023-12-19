import socket from '../sockets/socket.js';

export function initializeSocketListeners(addNotification, addSuggestion) {
  socket.on('new-wish', async data => {
    addNotification({
      message: `${data.childUsername} added a new wish: ${data.wish.title}`,
      link: `/wishlist`,
      color: 'default',
      id: data.notificationId,
    });
  });

  socket.on('wish-deleted', async data => {
    console.log('wish-deleted socket on in eventHandlers.js');

    addNotification({
      message: `${data.childUsername} has deleted a wish: ${data.wish.title}`,
      link: `/wishlist`,
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
    addNotification({
      message: `${data.message}`,
      link: data.url,
    });
  });
}
