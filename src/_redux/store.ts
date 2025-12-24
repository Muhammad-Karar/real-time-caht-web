
import { configureStore, Middleware } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import chatReducer, { addMessage, updateUserStatus } from './features/chatSlice';
import { connectSocket, getSocket } from './services/socketService';



// --- Socket Middleware ---
// This bridges the "Socket World" to the "Redux World"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const socketMiddleware: Middleware = (store) => (next) => (action: any) => {
  
  // 1. When User Logged In -> Connect Socket
  if (action.type === 'auth/login/fulfilled'|| action.type === 'auth/restoreSession') {
    const username = action.payload;
    const socket = connectSocket(username);

    // Listeners
    socket.on('receive_message', (msg) => {
      store.dispatch(addMessage(msg));
    });

    socket.on('user_status_change', (data) => {
      store.dispatch(updateUserStatus(data));
    });
  }

  // 2. When User Logs Out -> Disconnect
  if (action.type === 'auth/logout') {
    const socket = getSocket();
    if(socket) socket.disconnect();
  }

  return next(action);
};

// --- Store Configuration ---
export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(socketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;