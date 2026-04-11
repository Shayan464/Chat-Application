import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../features/chat/chatSlice';

const ActiveTabSwitch = () => {
  const dispatch = useDispatch();
  const { activeTab } = useSelector((state) => state.chat);

  return (
    <div className="tabs tabs-boxed  gap-2 bg-transparent p-2 m-2">
      <button
        className={`tab-active ${
          activeTab === 'chat'
            ? 'bg-cyan-500/20 text-cyan-400 border rounded-xl p-1 w-30'
            : 'text-slate-400  border border-transparent rounded-xl p-1  w-30'
        }`}
        onClick={() => dispatch(setActiveTab('chat'))}
      >
        Chats
      </button>
      <button
        className={`tab-active ${
          activeTab === 'contacts'
            ? 'bg-cyan-500/20 text-cyan-400  border rounded-xl p-1 w-30'
            : 'text-slate-400 border border-transparent rounded-xl p-1  w-30'
        }`}
        onClick={() => dispatch(setActiveTab('contacts'))}
      >
        Contacts
      </button>
    </div>
  );
};

export default ActiveTabSwitch;
