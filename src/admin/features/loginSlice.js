// src/redux/phoneNumberSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NODE_API_ENDPOINT } from "../../utils/utils";

export const retrieveAuth = createAsyncThunk("auth/retrieveAuth", async () => {
  const storedAuth = localStorage.getItem("auth-courtroom-admin");
  if (storedAuth) {
    const parsedUser = await JSON.parse(storedAuth);
    if (parsedUser.expiresAt < new Date().valueOf()) return null;
    const props = await fetch(`${NODE_API_ENDPOINT}/admin/verify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${parsedUser.jwt}`,
      },
    });
    const parsedProps = await props.json();
    console.log(parsedProps.data);
    return {
      user: parsedProps.data,
    };
  } else return null;
});

// Create the slice
const phoneNumberSlice = createSlice({
  name: "adminAuthUser",
  initialState: {
    user: "",
  },
  reducers: {
    login(state, action) {
      const { user } = action.payload;
      state.user = user;
      localStorage.setItem("auth-courtroom-admin", JSON.stringify(user));
    },
    logout(state) {
      state.user = "";
      localStorage.removeItem("auth-courtroom-admin");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(retrieveAuth.fulfilled, (state, action) => {
      if (action.payload && action.payload.user) {
        state.user = action.payload.user;
      }
    });
  },
});

// Export the actions
export const { login, logout } = phoneNumberSlice.actions;

// Export the reducer
export default phoneNumberSlice.reducer;
