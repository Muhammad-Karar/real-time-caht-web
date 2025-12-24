import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (username: string) => {
  // FIX 1: If a socket already exists, disconnect it first!
  // This ensures we don't accidentally reuse an old user's connection.
  if (socket) {
    socket.close();
    socket = null;
  }

  // FIX 2: Create a fresh connection
  socket = io(process.env.NEXT_LOCAL_API_URL || 'http://localhost:4000', {
    auth: { username },
    query: { username },
    reconnectionAttempts: 5,
    transports: ['websocket'], // FIX 3: Force WebSocket to avoid polling delays
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const emitMessage = (recipient: string, content: string) => {
  if (socket) {
    socket.emit('send_message', { recipient, content });
  }
};