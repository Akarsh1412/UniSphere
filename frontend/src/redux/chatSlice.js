import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUnreadCount = createAsyncThunk(
  'chat/fetchUnreadCount',
  async (_, { getState }) => {
    const token = getState().user?.token;
    if (!token) return 0;

    try {
      const response = await axios.get('http://localhost:5000/api/chat/unread-count', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.count;
    } catch (error) {
      console.error("Failed to fetch unread count", error);
      return 0;
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    unreadCount: 0,
    status: 'idle',
  },
  reducers: {
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnreadCount.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, (state) => {
        state.status = 'failed';
      });
  }
});

export const { incrementUnreadCount, resetUnreadCount } = chatSlice.actions;
export default chatSlice.reducer;
