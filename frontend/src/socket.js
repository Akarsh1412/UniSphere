import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

let socket;

export const initializeSocketConnection = (user) => {
  if (socket) {
    socket.disconnect();
  }

  if (user?.id) {
    socket = io(URL, {
      query: {
        userId: user.id,
        userName: user.name,
        userAvatar: user.profilePicture
      },
      reconnection: true,
      reconnectionAttempts: 5,
    });
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    console.warn("Socket not initialized. Call initializeSocketConnection first.");
  }
  return socket;
};

export const disconnectSocket = () => {
  if(socket) {
    socket.disconnect();
    socket = null;
  }
};
