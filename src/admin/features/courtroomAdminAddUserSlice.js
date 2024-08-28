import { createSlice } from '@reduxjs/toolkit';

const courtroomAdminAdduserSlice = createSlice({
  name: 'courtroomAdminAdduser',
  initialState: {
    userData: {
      username: '',
      email: '',
      phoneNumber: '',
      date: '',
      time: '',
      slots: [],
    },
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    addSlot: (state, action) => {
      state.userData.slots.push(action.payload);
    },
    removeSlot: (state, action) => {
      state.userData.slots = state.userData.slots.filter((_, index) => index !== action.payload);
    },
  },
});

export const { setUserData, addSlot, removeSlot } = courtroomAdminAdduserSlice.actions;

export default courtroomAdminAdduserSlice.reducer;
