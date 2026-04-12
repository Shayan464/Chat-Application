import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';

export const getAllContacts = createAsyncThunk(
  'messages/contact',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/messages/contacts');
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error, 'error in get all contacts');
      return thunkAPI.rejectWithValue(null);
    }
  }
);

export const getMyChatPartner = createAsyncThunk(
  '/messages/chat',
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/messages/chat');
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error, 'something went wrong in the getmychatpartner');
      return thunkAPI.rejectWithValue(null);
    }
  }
);

export const getMessagesByUserId = createAsyncThunk(
  '/messages/getMessagesByUserId',
  async (userId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error, 'something went wrong in the getMessagesByUserId');
      return thunkAPI.rejectWithValue(null);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    contacts: [],
    chats: [],
    messages: [],
    allContacts: [],
    activeTab: 'chat',
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: JSON.parse(
      localStorage.getItem('isSoundEnabled') === 'true'
    ),
  },
  reducers: {
    toggleSound: (state) => {
      state.isSoundEnabled = !state.isSoundEnabled;
      localStorage.setItem('isSoundEnabled', state.isSoundEnabled);
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // get all contacts
      .addCase(getAllContacts.fulfilled, (state, action) => {
        state.contacts = action.payload;
        state.allContacts = action.payload;
        state.isUsersLoading = false;
      })
      .addCase(getAllContacts.pending, (state) => {
        state.isUsersLoading = true;
      })
      .addCase(getAllContacts.rejected, (state) => {
        state.contacts = null;
        state.allContacts = null;
        state.isUsersLoading = false;
      })

      //get my chat partners
      .addCase(getMyChatPartner.fulfilled, (state, action) => {
        state.chats = action.payload;
        state.isUsersLoading = false;
      })
      .addCase(getMyChatPartner.pending, (state) => {
        state.isUsersLoading = true;
      })
      .addCase(getMyChatPartner.rejected, (state) => {
        state.chats = null;
        state.isUsersLoading = false;
      })

      //getMessagesByuserId
      .addCase(getMessagesByUserId.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.isMessagesLoading = false;
      })
      .addCase(getMessagesByUserId.pending, (state) => {
        state.isMessagesLoading = true;
      })
      .addCase(getMessagesByUserId.rejected, (state) => {
        state.isMessagesLoading = false;
      });
  },
});

export const { toggleSound, setActiveTab, setSelectedUser } = chatSlice.actions;
export default chatSlice.reducer;
