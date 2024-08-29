// src/redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Define the initial state for the user slice
const initialState = {
  users: [], // Array to store user data
  status: 'idle', // Status of data fetching or any operation
  error: null, // Error message if any operation fails
};

// Create the slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Action to set user data
    setUsers(state, action) {
      state.users = action.payload;
    },
    // Action to add a new user
    addUser(state, action) {
      state.users.push(action.payload);
    },
    // Action to update an existing user
    updateUser(state, action) {
      const { id, updatedData } = action.payload;
      const index = state.users.findIndex(user => user.id === id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...updatedData };
      }
    },
    // Action to delete a user
    deleteUser(state, action) {
      const id = action.payload;
      state.users = state.users.filter(user => user.id !== id);
    },
    // Action to set loading status
    setLoading(state, action) {
      state.status = action.payload;
    },
    // Action to set error
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

// Export the actions
export const { setUsers, addUser, updateUser, deleteUser, setLoading, setError } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
