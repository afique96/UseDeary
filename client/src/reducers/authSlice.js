import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../data/baseUrl';

const initialState = {
  isLogged: false,
  token: null,
  user: null,
  plans: null,
  notifications: null,
};

export const verifyToken = createAsyncThunk('auth/verifyToken', async () => {
  try {
    const response = await fetch(baseUrl + '/auth/verify', {
      method: 'GET',
      headers: { token: localStorage.token },
    });

    return await response.json();
  } catch (err) {
    console.error(err.message);
  }
});

export const fetchUser = createAsyncThunk('user/getUser', async userId => {
  try {
    const response = await fetch(baseUrl + `/user/${userId}`, {
      method: 'GET',
    });

    return await response.json();
  } catch (err) {
    console.error(err.message);
  }
});


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { token, isLogged } = action.payload;
      state.token = token;
      state.isLogged = isLogged;
    },

    setUser: (state, action) => {
      const { user } = action.payload;
      state.user = user;
    },


    setPlans: (state, action) => {
      const { plans } = action.payload;
      state.plans = plans;

      // Save the updated state to localStorage
      localStorage.setItem('plans', JSON.stringify(state));
    },

    logOut: (state, action) => {
      state.user = null;
      state.token = null;
      state.isLogged = false;

      localStorage.removeItem('token');
    },
  },
});

export const {
  setAuth,
  setUser,
  logOut,
  setPlans
} = authSlice.actions;

export default authSlice.reducer;

export const getUser = state => state.auth.user;
export const getToken = state => state.auth.token;
export const getIsLogged = state => state.auth.isLogged;
export const getPlans = state => state.auth.plans;