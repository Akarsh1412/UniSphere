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
      // If state is null, return the new user data
      if (!state) {
        return action.payload;
      }
      // Otherwise, merge the existing state with the new data
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