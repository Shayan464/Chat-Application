import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UsersLoadingSkeleton from './UserLoadingSkeleton';
import { getAllContacts, setSelectedUser } from '../features/chat/chatSlice';

const ContactList = () => {
  const { allContacts, isUsersLoading } = useSelector((state) => state.chat);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllContacts());
  }, [dispatch]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <div>
      {' '}
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-4 m-2 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => dispatch(setSelectedUser(contact))}
        >
          <div className="flex items-center gap-3">
            {/* TODO: fix this online status and make it work with socket  */}
            <div className={`avatar-online`}>
              <div className="size-12 rounded-full ">
                <img
                  src={contact.profilePic || '/avatar.png'}
                  alt={contact.fullName}
                />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">
              {contact.fullName}
            </h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
