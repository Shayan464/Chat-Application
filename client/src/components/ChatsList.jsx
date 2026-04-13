import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyChatPartners, setSelectedUser } from '../features/chat/chatSlice';
import UsersLoadingSkeleton from './UserLoadingSkeleton';
import NoChatsFound from './NoChatsFound';

const ChatsList = () => {
  const dispatch = useDispatch();
  const { chats, isUsersLoading } = useSelector((state) => state.chat);
  const { onlineUsers } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyChatPartners());
  }, [dispatch]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-cyan-500/10 transition-colors group"
          onClick={() => dispatch(setSelectedUser(chat))}
        >
          {/* Avatar */}
          <div className="relative  shrink-0">
            <div
              className={`avatar ${onlineUsers.includes(chat._id) ? 'avatar-online' : 'avatar-offline'}`}
            >
              <img
                src={chat.profilePic || '/avatar.png'}
                alt={chat.fullName}
                className="size-12 rounded-full object-cover"
              />
            </div>
          </div>

          {/* Name */}
          <div className="flex-1 min-w-0">
            <h4 className="text-slate-200 font-medium truncate">
              {chat.fullName}
            </h4>
            <p className="text-slate-400 text-xs truncate">Click to chat</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatsList;
