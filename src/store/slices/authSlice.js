import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../constants';

const initialState = {
  user: null,
  token: null,
  balance: null,
  isAuthenticated: false,
};

// 从 localStorage 加载初始状态
const loadAuthState = () => {
  try {
    const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedToken && savedUser) {
      return {
        ...initialState,
        token: savedToken,
        user: JSON.parse(savedUser),
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Failed to load auth state:', error);
  }
  return initialState;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuthState(),
  reducers: {
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.balance = null;
      state.isAuthenticated = false;
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    clearBalance: (state) => {
      state.balance = null;
    },
  },
});

export const { loginSuccess, logout, setBalance, clearBalance } = authSlice.actions;
export default authSlice.reducer;
