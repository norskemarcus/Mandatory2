const socketUserMap = {};

function addUser(socketId, userId) {
  socketUserMap[socketId] = userId;
}

function removeUser(socketId) {
  delete socketUserMap[socketId];
}

function getUserId(socketId) {
  return socketUserMap[socketId];
}

export { addUser, removeUser, getUserId };
