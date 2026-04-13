import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';

export const getAllContacts = createAsyncThunk(
  'chat/getAllContacts',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/messages/contacts');
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(null);
    }
  }
);

export const getMyChatPartners = createAsyncThunk(
  'chat/getMyChatPartners',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/messages/chats');
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(null);
    }
  }
);

export const getMessagesByUserId = createAsyncThunk(
  'chat/getMessagesByUserId',
  async (userId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(null);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (messageData, thunkAPI) => {
    const { authUser } = thunkAPI.getState().auth;
    const { selectedUser } = thunkAPI.getState().chat;
    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    thunkAPI.dispatch(addOptimisticMessage(optimisticMessage));

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      thunkAPI.dispatch(
        replaceOptimisticMessage({ tempId, message: res.data })
      );
      return res.data;
    } catch (error) {
      thunkAPI.dispatch(removeOptimisticMessage(tempId));
      toast.error(error.response?.data?.message || 'Something went wrong');
      return thunkAPI.rejectWithValue(null);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: 'chats',
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem('isSoundEnabled')) === true,
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
    addOptimisticMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
    replaceOptimisticMessage: (state, action) => {
      const { tempId, message } = action.payload;
      state.messages = state.messages.map((msg) =>
        msg._id === tempId ? message : msg
      );
    },
    removeOptimisticMessage: (state, action) => {
      state.messages = state.messages.filter(
        (msg) => msg._id !== action.payload
      );
    },
    addNewMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllContacts.pending, (state) => {
        state.isUsersLoading = true;
      })
      .addCase(getAllContacts.fulfilled, (state, action) => {
        state.allContacts = action.payload;
        state.isUsersLoading = false;
      })
      .addCase(getAllContacts.rejected, (state) => {
        state.isUsersLoading = false;
      })

      .addCase(getMyChatPartners.pending, (state) => {
        state.isUsersLoading = true;
      })
      .addCase(getMyChatPartners.fulfilled, (state, action) => {
        state.chats = action.payload;
        state.isUsersLoading = false;
      })
      .addCase(getMyChatPartners.rejected, (state) => {
        state.isUsersLoading = false;
      })

      .addCase(getMessagesByUserId.pending, (state) => {
        state.isMessagesLoading = true;
      })
      .addCase(getMessagesByUserId.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.isMessagesLoading = false;
      })
      .addCase(getMessagesByUserId.rejected, (state) => {
        state.isMessagesLoading = false;
        state.messages = [];
      });
  },
});

export const {
  toggleSound,
  setActiveTab,
  setSelectedUser,
  addOptimisticMessage,
  replaceOptimisticMessage,
  removeOptimisticMessage,
  addNewMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
