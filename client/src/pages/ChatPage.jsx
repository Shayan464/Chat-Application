import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';

const ChatPage = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    console.log('USER:', user);
  }, [user]);

  const handleLogin = () => {
    dispatch(login('john'));
  };
  return (
    <div>
      <button className="btn btn-primary" onClick={handleLogin}>
        CLick me
      </button>
    </div>
  );
};

export default ChatPage;
