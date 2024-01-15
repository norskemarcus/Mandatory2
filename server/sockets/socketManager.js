const socketUserMap = {}; // key = socketId , value = userId

function addUser(socketId, userId) {
  socketUserMap[socketId] = userId;
}

function removeUser(socketId) {
  delete socketUserMap[socketId];
}

function getUserId(socketId) {
  return socketUserMap[socketId];
}

function getSocketIdByUserId(userId) {
  // make array out of the object (socketUserMap)
  return Object.keys(socketUserMap).find(socketId => socketUserMap[socketId] === userId);
}

export { addUser, removeUser, getUserId, getSocketIdByUserId };
