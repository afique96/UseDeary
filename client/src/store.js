import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';

// Load state from localStorage if available
const persistedState = JSON.parse(localStorage.getItem('reduxState')) || {};

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: persistedState, // Initialize with the persisted state
});

// Subscribe to store changes and save the state to localStorage
store.subscribe(() => {
  localStorage.setItem('reduxState', JSON.stringify(store.getState()));
});
