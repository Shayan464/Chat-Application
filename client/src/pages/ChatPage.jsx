import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const ChatPage = () => {
  const dispatch = useDispatch();
  const logoutBtn = () => {
    dispatch(logout());
  };
  return (
    <div>
      <h1>Welcome to the chat page</h1>
      <button className="btn btn-primary" onClick={logoutBtn}>
        Click here
      </button>
    </div>
  );
};

export default ChatPage;
