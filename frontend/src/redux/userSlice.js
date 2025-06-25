import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return action.payload;
    },
    updateUser: (state, action) => {
      if (!state) {
        return action.payload;
      }
      return {
        ...state,
        ...action.payload
      };
    },
    clearUser: (state) => {
      return null;
    },
  },
});

export const { setUser, updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;