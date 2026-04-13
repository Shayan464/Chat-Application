import { io } from 'socket.io-client';
import { setOnlineUsers } from '../features/auth/authSlice';

const BASE_URL =
  import.meta.env.MODE === 'development' ? 'http://localhost:3000' : '/';

// socket lives outside Redux - one instance for the whole app
let socket = null;

function connectSocket(store) {
  // don't create a new socket if already connected
  if (socket?.connected) return;

  socket = io(BASE_URL, { withCredentials: true });

  // when server sends online users list, save it in Redux
  socket.on('getOnlineUsers', (userIds) => {
    store.dispatch(setOnlineUsers(userIds));
  });
}

function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect();
  }
  socket = null;
}

const socketMiddleware = (store) => (next) => (action) => {
  // let the action update Redux state first
  const result = next(action);

  // connect after user logs in, signs up, or auth is checked
  const shouldConnect =
    action.type === 'auth/login/fulfilled' ||
    action.type === 'auth/signup/fulfilled' ||
    action.type === 'auth/checkAuth/fulfilled';

  if (shouldConnect) connectSocket(store);

  // disconnect when user logs out
  if (action.type === 'auth/logout/fulfilled') disconnectSocket();

  return result;
};

export default socketMiddleware;
