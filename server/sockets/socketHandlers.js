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

  socket.on('child-add-wish', async data => {
    const { childId, wish } = data;

    const parentId = await getParentId(childId);

    if (parentId) {
      const parentSocketId = getSocketIdByUserId(parentId);
      if (parentSocketId) {
        io.to(parentSocketId).emit('new-wish', {
          childId: childId,
          wish: wish,
          // any other data you need to send
        });
      } else {
        console.error(`No active socket for parent ID ${parentId}`);
      }
    } else {
      console.error(`Parent ID for child ID ${childId} not found`);
    }
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

  socket.on('respond-to-suggestion', async data => {
    // Process the response (e.g., update the database)
    // Then notify the parent
    const parentSocketId = getSocketIdByUserId(parentId); // Assuming you have the parent's ID
    io.to(parentSocketId).emit('suggestion-response', {
      /* relevant data */
    });
  });
}
