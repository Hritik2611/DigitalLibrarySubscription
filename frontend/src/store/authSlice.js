import { createSlice } from '@reduxjs/toolkit';

// When the app first loads, check if user info is already saved in the browser's local storage.
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage, // Set the initial user state from storage
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
      state.error = null;
      // When login is successful, save the user info to local storage to keep them logged in.
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo'); // Remove user info on logout
    },
  },
});

export const { setLoading, setError, loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;

