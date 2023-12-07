import socket from '../sockets/socket.js';

export function initializeSocketListeners(addNotification) {
  socket.on('new-wish', data => {
    addNotification({
      message: `New wish from ${data.childUsername}: ${data.wish.title}`,
      link: `/wishlist`, // TODO: refactor with optional parameter, so this can link to: /${data.wish.id}
      color: 'default',
    });
  });

  socket.on('wish-deleted', data => {
    console.log('wish-deleted:', data);
    addNotification({
      message: `${data.childUsername} has deleted a wish: ${data.wish.title}`,
      link: `/childsWishlist`,
      type: 'alert',
    });
  });

  socket.on('child-wish-suggested', data => {
    addNotification({
      message: `You have a new wish suggestion: ${data.wish.title}`,
      link: `/wishlist/${data.wish.id}`,
      color: 'default',
    });
  });
}

export function respondToSuggestion(wishId, response) {
  socket.emit('respond-suggestion', { wishId, response });
}
