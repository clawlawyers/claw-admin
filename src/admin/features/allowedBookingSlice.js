// src/slices/allowedBookingSlice.js

import { createSlice } from '@reduxjs/toolkit';

// Define the initial state for allowed booking
const initialState = {
  username: '',
  email: '',
  phoneNumber: '',
  date: '',
  time: '',
  slots: [], // Array of slots
};

const allowedBookingSlice = createSlice({
  name: 'allowedBooking',
  initialState,
  reducers: {
    // Reducer to set form data
    setFormData(state, action) {
      return { ...state, ...action.payload };
    },
    // Reducer to add a slot
    addSlot(state, action) {
      state.slots.push(action.payload);
    },
    // Reducer to remove a slot
    removeSlot(state, action) {
      state.slots = state.slots.filter((_, index) => index !== action.payload);
    },
    // Reducer to clear the form
    clearForm(state) {
      return initialState;
    },
  },
});

// Export actions and reducer
export const { setFormData, addSlot, removeSlot, clearForm } = allowedBookingSlice.actions;
export default allowedBookingSlice.reducer;
