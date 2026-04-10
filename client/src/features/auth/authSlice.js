import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/auth/check');
      return res.data;
    } catch (error) {
      console.error(error, 'error in check auth');
      return thunkAPI.rejectWithValue(null);
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post('/auth/signup', data);
      toast.success('Account created successfully!');
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const login = createAsyncThunk('auth/login', async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/auth/login', data);
    toast.success('Logged in successfully');
    return res.data;
  } catch (error) {
    toast.error(error.response.data.message);
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await axiosInstance.post('/auth/logout');
    toast.success('Logged out successfully');
  } catch (error) {
    toast.error('Error logging out');
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.put('/auth/update-profile', data);
      toast.success('Profile updated successfully');
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    onlineUsers: [],
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // checkAuth
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isCheckingAuth = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.authUser = null;
        state.isCheckingAuth = false;
      })

      // signup
      .addCase(signup.pending, (state) => {
        state.isSigningUp = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isSigningUp = false;
      })
      .addCase(signup.rejected, (state) => {
        state.isSigningUp = false;
      })

      // login
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isLoggingIn = false;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      })

      // logout
      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
      })

      // updateProfile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.authUser = action.payload;
      });
  },
});

export const { setOnlineUsers } = authSlice.actions;
export default authSlice.reducer;
