import { User } from "@/types/auth.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthStatetype{
accessToken: string |null,
    refreshToken: string | null,
    user: User | null, //defined in types/auth.types.ts
    isAuthenticated: boolean,
}
const initialState:AuthStatetype = {
    accessToken: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,
}
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    setAuth: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user: User;
      }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    clearAuth(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAccessToken, setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;