import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Initial state
const initialState = {
  name: "",
  salt: "",
  iv: "",
  registed_DID: "",
  encrypted_private_key: "",
  accessToken: localStorage.getItem("access_token"),
  refreshToken: Cookies.get("refresh_token"),
  isAuthenticated: !!Cookies.get("access_token"), // Check if accessToken exists
};

// Utility to filter payload fields
const filterPayload = (payload, state) => {
  const filteredPayload = {};
  Object.keys(state).forEach((key) => {
    if (key in payload) {
      filteredPayload[key] = payload[key];
    }
  });
  return filteredPayload;
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const filteredPayload = filterPayload(action.payload, state);
      return {
        ...state,
        ...filteredPayload,
        isAuthenticated: true, // Ensure user is authenticated
      };
    },
    resetUser: (state) => {
      return {
        ...state,
        name: "",
        salt: "",
        iv: "",
        registed_DID: "",
        encrypted_private_key: "",
        accessToken: "",
        refreshToken: "",
        isAuthenticated: false,
      };
    },
    logout: () => {
      Cookies.remove("access_token");
      localStorage.removeItem("refresh_token");
      return {
        ...initialState,
        accessToken: "", // Clear tokens
        refreshToken: "",
        isAuthenticated: false,
      };
    },
  },
});

export const { updateUser, resetUser, logout } = userSlice.actions;
export default userSlice.reducer;