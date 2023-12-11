export default function setupSocketHandlers(socket, socketUserMap) {
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

    // Update the suggestion status in the database
    await updateSuggestionStatus(suggestionId, response);

    // Get parent user ID from socketUserMap
    const parentUserId = socketUserMap[socket.id];

    if (parentUserId) {
      // Notify the parent about the child's decision
      io.to(parentUserId).emit('child-responded', { suggestionId, response });
    } else {
      console.error('Parent user ID not found for socket:', socket.id);
    }
  });

  // Notify the parent about the child's decision
  // io.to(parentUserId).emit('child-responded', { suggestionId, response });
  // });
}
