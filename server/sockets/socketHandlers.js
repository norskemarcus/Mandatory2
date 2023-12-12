import { addUser, removeUser, getUserId } from './socketStore.js';

export default function setupSocketHandlers(socket, io) {
  // socket.on('user-login', ({ userId }) => {
  //   console.log(`User ${userId} logged in with socket ID ${socket.id}`);
  //   // map each socket connection to the corresponding user ID.
  //   addUser(socket.id, userId);
  // });

  // socket.on('user-logout', () => {
  //   const userId = getUserId(socket.id);
  //   if (userId) {
  //     console.log(`User ${userId} logged out.`);
  //     removeUser(socket.id);
  //   }
  // });

  socket.on('child-add-wish', data => {
    // io.emit('parent-wish-added', data);
  });

  socket.on('new-suggestion', data => {
    io.emit('suggestion-response', data);
  });

  // socket.on('new-suggestion', async data => {
  //   console.log('new suggestion');
  //   try {
  //     const { childId, wish } = data;

  //     // Find the child's socket ID from the mapping
  //     const childSocketId = Object.keys(socketUserMap).find(key => socketUserMap[key] === childId);

  //     if (childSocketId) {
  //       // Emit the new-suggestion event to the child's socket
  //       io.to(childSocketId).emit('new-suggestion', {
  //         wish: wish,
  //         fromParentId: data.fromParentId
  //       });
  //     } else {
  //       console.error(`Socket ID for child ID ${childId} not found.`);
  //     }
  //   } catch (error) {
  //     console.error('Error suggesting wish:', error);
  //   }
  // });
}
