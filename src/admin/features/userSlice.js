// src/redux/userSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NODE_API_ENDPOINT } from "../../utils/utils";

export const retrieveUserslist = createAsyncThunk(
  "auth/retrieveUserslist",
  async () => {
    // if (parsedUser.expiresAt < new Date().valueOf()) return null;
    const props = await fetch(`${NODE_API_ENDPOINT}/admin/getAllUsers`, {
      method: "GET",
    });
    const parsedProps = await props.json();
    console.log(parsedProps.data.adminNumbers);
    return {
      adminUsers: [...parsedProps.data.adminNumbers],
    };
  }
);

// Create the slice
const userSlice = createSlice({
  name: "adminUsersNumber",
  initialState: {
    adminUsers: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(retrieveUserslist.fulfilled, (state, action) => {
      if (action.payload && action.payload.adminUsers) {
        state.adminUsers = action.payload.adminUsers;
      }
    });
  },
});

// Export the actions
export const {} = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
