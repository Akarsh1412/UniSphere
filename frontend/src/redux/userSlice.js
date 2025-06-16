// src/redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = null; // Set initial state to null instead of empty object

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return action.payload;
    },
    clearUser: (state) => {
      return null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;