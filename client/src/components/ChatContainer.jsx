import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMessagesByUserId } from '../features/chat/chatSlice';
import ChatHeader from './ChatHeader';
import NoChatHistoryPlaceHolder from '../components/NoChatHistoryPlaceHolder';
import MessageInput from './MessageInput';
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton';

const ChatContainer = () => {
  const { selectedUser, messages, isMessagesLoading } = useSelector(
    (state) => state.chat
  );
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMessagesByUserId(selectedUser?._id));
  }, [dispatch, selectedUser]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8 ">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6 ">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${msg.senderId === authUser._id ? 'chat-end' : 'chat-start'} `}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === authUser._id
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="shared"
                      className="rouded-lg h-48 object-cover"
                    />
                  )}
                  {msg.text && <p className="mt-2"> {msg.text}</p>}

                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toISOString().slice(11, 16)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceHolder name={selectedUser.fullName} />
        )}
      </div>
      <MessageInput />
    </>
  );
};

export default ChatContainer;
