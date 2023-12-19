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

function getSocketIdByUserId(userId) {
  console.log('userId in socketStore.js:', userId);
  return Object.keys(socketUserMap).find(socketId => socketUserMap[socketId] === userId);
}

export { addUser, removeUser, getUserId, getSocketIdByUserId };
