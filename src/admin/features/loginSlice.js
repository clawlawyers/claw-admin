// src/redux/phoneNumberSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Define the initial state for the phone number slice
const initialState = {
  phoneNumber: '', // Store the phone number
  status: 'idle',  // Status of any operation (e.g., loading, success)
  error: null,     // Error message if any operation fails
};

// Create the slice
const phoneNumberSlice = createSlice({
  name: 'phoneNumber',
  initialState,
  reducers: {
    // Action to set the phone number
    setPhoneNumber(state, action) {
      state.phoneNumber = action.payload;
    },
    // Action to set loading status
    setLoading(state, action) {
      state.status = action.payload;
    },
    // Action to set error
    setError(state, action) {
      state.error = action.payload;
    },
    // Action to clear the phone number (e.g., on logout or form reset)
    clearPhoneNumber(state) {
      state.phoneNumber = '';
    },
  },
});

// Export the actions
export const { setPhoneNumber, setLoading, setError, clearPhoneNumber } = phoneNumberSlice.actions;

// Export the reducer
export default phoneNumberSlice.reducer;
