import { createSlice } from '@reduxjs/toolkit';
import { config } from '@/config';
import Cookies from 'js-cookie';
import type { AuthState } from '@/common/types/authTypes';

const authToken = Cookies.get(config.AUTH_COOKIE_NAME);

const initialState: AuthState = {
  isAuthenticated: authToken ? true : false,
  user: {
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    phone: null,
    profile: null,
    created_at: '',
    permissions: [],
  },
  token: authToken || null,
  loading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = { permissions: initialState.user.permissions, ...action.payload };
      state.token = action.payload.token;
      Cookies.set(config.AUTH_COOKIE_NAME, action.payload.token, {
        expires: new Date(action.payload.expires),
      });
    },
    setUserValues: (state, action) => {
      state.user = action.payload;
    },

    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = initialState.user;
      state.token = null;
      Cookies.remove(config.AUTH_COOKIE_NAME);
    },
  },
});

export const { setUser, logoutUser, setUserValues } = authSlice.actions;
