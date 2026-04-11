import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyChatPartner, setSelectedUser } from '../features/chat/chatSlice';
import UsersLoadingSkeleton from './UserLoadingSkeleton';
import NoChatsFound from './NoChatsFound';

const ChatsList = () => {
  const dispatch = useDispatch();
  const { chats, isUsersLoading } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(getMyChatPartner());
  }, [dispatch]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => dispatch(setSelectedUser(chat))}
        >
          <div className="flex items-center gap-3">
            {/* TODO: fix this online status and make it work with socket  */}
            <div className={`avatar-online`}>
              <div className="size-12 rounded-full ">
                <img
                  src={chat.profilePic || '/avatar.png'}
                  alt={chat.fullName}
                />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">
              {chat.fullName}
            </h4>
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatsList;
