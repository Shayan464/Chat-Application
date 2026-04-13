import { io } from 'socket.io-client';
import { setOnlineUsers } from '../features/auth/authSlice';
import { addNewMessage } from '../features/chat/chatSlice';

const BASE_URL =
  import.meta.env.MODE === 'development' ? 'http://localhost:3000' : '/';

let socket = null;

function connectSocket(store) {
  if (socket?.connected) return;

  socket = io(BASE_URL, { withCredentials: true });

  // when server sends online users list, save it in Redux
  socket.on('getOnlineUsers', (userIds) => {
    store.dispatch(setOnlineUsers(userIds));
  });
}

function disconnectSocket() {
  if (socket?.connected) socket.disconnect();
  socket = null;
}

function subscribeToMessages(store) {
  // remove old listener first to avoid duplicate messages
  socket.off('newMessage');

  socket.on('newMessage', (newMessage) => {
    const { selectedUser, isSoundEnabled } = store.getState().chat;

    // only show message if it's from the currently open chat
    if (newMessage.senderId !== selectedUser?._id) return;

    store.dispatch(addNewMessage(newMessage));

    if (isSoundEnabled) {
      const sound = new Audio('/sounds/notification.mp3');
      sound.currentTime = 0;
      sound.play().catch((e) => console.log('Audio play failed:', e));
    }
  });
}

const socketMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // connect socket after login/signup/checkAuth
  const shouldConnect =
    action.type === 'auth/login/fulfilled' ||
    action.type === 'auth/signup/fulfilled' ||
    action.type === 'auth/checkAuth/fulfilled';

  if (shouldConnect) connectSocket(store);

  // subscribe to messages when user selects a chat
  if (action.type === 'chat/setSelectedUser') {
    if (socket?.connected) subscribeToMessages(store);
  }

  // cleanup on logout
  if (action.type === 'auth/logout/fulfilled') {
    socket?.off('newMessage');
    disconnectSocket();
  }

  return result;
};

export default socketMiddleware;
