import React from 'react';
import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  LogOutIcon,
  VolumeOffIcon,
  Volume2Icon,
  Snowflake,
} from 'lucide-react';
import { logout, updateProfile } from '../features/auth/authSlice';
import { toggleSound } from '../features/chat/chatSlice';

const mouseClickSound = new Audio('/sounds/mouse-click.mp3');

const ProfileHeader = () => {
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();

  const { isSoundEnabled } = useSelector((state) => state.chat);
  const { authUser, isProfileUploading } = useSelector((state) => state.auth);

  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await dispatch(updateProfile({ profilePic: base64Image }));
    };
  };

  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {isProfileUploading ? (
            <Snowflake className="animate-spin w-6 h-6 text-blue-500 [animation-duration:1.5s]" />
          ) : (
            <div className="avatar avatar-online shrink-0">
              <button
                className="size-14 rounded-full overflow-hidden relative group"
                onClick={() => fileInputRef.current.click()}
              >
                <img
                  src={selectedImg || authUser.profilePic || '/avatar.png'}
                  alt="User image"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-xs">Change</span>
                </div>
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
            </div>
          )}
          {/* username and online text */}
          <div className="text-slate-200 font-medium text-base max-w-[180px] truncate">
            <h3>{authUser.fullName}</h3>
            <p className="text-slate-400 text-xs">Online</p>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex gap-4 items-center">
          {/* logout btn */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => dispatch(logout())}
          >
            <LogOutIcon />
          </button>
          {/* sound toggle btn */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              // play click sound before toggling
              mouseClickSound.currentTime = 0; // reset to start
              mouseClickSound
                .play()
                .catch((error) => console.log('Audio play failed:', error));
              dispatch(toggleSound());
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
