import React from 'react';
import { useSelector } from 'react-redux';
// import { logout } from '../features/auth/authSlice';
import ProfileHeader from '../components/ProfileHeader';
import ActiveTabSwitch from '../components/ActiveTabSwitch';
import ChatsList from '../components/ChatsList';
import ContactList from '../components/ContactList';
import BorderAnimatedContainer from '../components/BorderAnimatedContainer';
import NoConversationPlaceHolder from '../components/NoConversationPlaceHolder';
import ChatContainer from '../components/ChatContainer';

const ChatPage = () => {
  // const dispatch = useDispatch();

  const { activeTab, selectedUser } = useSelector((state) => state.chat);

  return (
    <div className="relative w-full flex max-w-6xl h-[800px]">
      <BorderAnimatedContainer>
        {/* left side */}
        <div className="w-80 bg-slate-800/50 backdrop:blur-sm flex flex-col">
          <ProfileHeader />
          <ActiveTabSwitch />
          <div className="flex-1 overflow-auto-y p-4 space-y-2">
            {activeTab === 'chat' ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceHolder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
};

export default ChatPage;
