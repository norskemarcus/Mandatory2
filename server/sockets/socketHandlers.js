import { addUser, removeUser, getUserId, getSocketIdByUserId } from './socketManager.js';
import { getParentId } from '../services/userService.js';

export default function setupSocketHandlers(socket, io) {
  socket.on('user-login', ({ userId }) => {
    addUser(socket.id, userId);
  });

  socket.on('user-logout', () => {
    const userId = getUserId(socket.id);
    if (userId) {
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
        });
      } else {
        console.error(`No active socket for parent ID ${parentId}`);
      }
    } else {
      console.error(`Parent ID for child ID ${childId} not found`);
    }
  });

  socket.on('new-suggestion', data => {
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

  socket.on('respond-to-suggestion', () => {
    const parentSocketId = getSocketIdByUserId(parentId);
    io.to(parentSocketId).emit('suggestion-response', {});
  });
}
