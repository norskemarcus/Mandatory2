import { addUser, removeUser, getUserId, getSocketIdByUserId } from './socketStore.js';

export default function setupSocketHandlers(socket, io) {
  socket.on('user-login', ({ userId }) => {
    console.log(`User ${userId} logged in with socket ID ${socket.id}`);
    // map each socket connection to the corresponding user ID.
    addUser(socket.id, userId);
  });

  socket.on('user-logout', () => {
    const userId = getUserId(socket.id);
    if (userId) {
      console.log(`User ${userId} logged out.`);
      removeUser(socket.id);
    }
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
  });

  socket.on('child-add-wish', data => {
    // io.emit('parent-wish-added', data);
  });

  socket.on('new-suggestion', async data => {
    const { childId, wish } = data;

    const childSocketId = getSocketIdByUserId(childId);

    if (childSocketId) {
      io.to(childSocketId).emit('new-suggestion', {
        wish: wish,
        fromParentId: data.fromParentId,
      });
    } else {
      console.error(`No active socket for child ID ${childId}`);
    }
  });
}
