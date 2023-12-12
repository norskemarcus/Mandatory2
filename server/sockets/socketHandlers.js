import { addUser, removeUser, getUserId } from './socketStore.js';

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

  socket.on('child-add-wish', data => {
    io.emit('parent-wish-added', data);
  });

  // Listening for the 'suggest-wish' event. When this event is recieved, the code inside the callback function is executed
  socket.on('suggest-wish', async data => {
    try {
      const { childId, wish } = data;
      //  emit a confirmation back to the parent
      socket.emit('suggestion-saved', { success: true, message: 'Suggestion sent' });

      // Notify the child in real-time
      socket.to(childId).emit('new-suggestion', { wish: wish, fromParentId: parentUserId });
    } catch (error) {
      console.error('Error suggesting wish:', error);
    }
  });

  // Handle child's response to a suggestion
  socket.on('respond-to-suggestion', async data => {
    const { suggestionId, response } = data;
    await updateSuggestionStatus(suggestionId, response);

    const parentUserId = getUserId(socket.id);

    if (parentUserId) {
      // Notify the parent about the child's decision
      io.to(parentUserId).emit('child-responded', { suggestionId, response });
    } else {
      console.error('Parent user ID not found for socket:', socket.id);
    }
  });

  socket.on('disconnect', () => {
    const userId = getUserId(socket.id);
    if (userId) {
      console.log(`User ${userId} disconnected.`);
      removeUser(socket.id);
    }
  });
}
