import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  uid: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  uid: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setAuth: (state, action) => {
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        uid: action.payload.uid,
      };
    },
    resetAuth: (_) => {
      return {
        accessToken: null,
        refreshToken: null,
        uid: null,
      };
    },
    setAccessToken: (state, action) => ({
      ...state,
      accessToken: action.payload,
    }),
  },
});

export const { setAuth, resetAuth, setAccessToken } = authSlice.actions;

export default authSlice.reducer;
