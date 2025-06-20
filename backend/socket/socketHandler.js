const onlineUsers = new Map();

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    const { userId, userName, userAvatar } = socket.handshake.query;

    if (userId && userId !== 'undefined') {
      onlineUsers.set(userId, {
        id: userId,
        name: userName,
        avatar: userAvatar,
        socketId: socket.id
      });
      io.emit('updateOnlineUsers', Array.from(onlineUsers.values()));
    }

    socket.on('privateMessage', async ({ content, to, from }) => {
      const receiverSocketId = onlineUsers.get(to.toString())?.socketId;
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newMessageNotification', {
          from: from,
          message: content,
          timestamp: new Date().toISOString()
        });
      }
    });

    socket.on('disconnect', () => {
      for (let [key, value] of onlineUsers.entries()) {
        if (value.socketId === socket.id) {
          onlineUsers.delete(key);
          break;
        }
      }
      io.emit('updateOnlineUsers', Array.from(onlineUsers.values()));
    });
  });
};

export default initializeSocket;
