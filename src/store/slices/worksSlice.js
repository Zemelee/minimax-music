import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../constants';

const initialState = {
  lyrics: [],
  music: [],
};

// 从 localStorage 加载作品
const loadWorks = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.WORKS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load works:', error);
  }
  return initialState;
};

const worksSlice = createSlice({
  name: 'works',
  initialState: loadWorks(),
  reducers: {
    addLyrics: (state, action) => {
      const newWork = { id: Date.now(), ...action.payload };
      state.lyrics = [newWork, ...state.lyrics].slice(0, 50);
      localStorage.setItem(STORAGE_KEYS.WORKS, JSON.stringify(state));
    },
    addMusic: (state, action) => {
      const newWork = { id: Date.now(), ...action.payload };
      state.music = [newWork, ...state.music].slice(0, 50);
      localStorage.setItem(STORAGE_KEYS.WORKS, JSON.stringify(state));
    },
    deleteWork: (state, action) => {
      const { type, id } = action.payload;
      state[type] = state[type].filter((work) => work.id !== id);
      localStorage.setItem(STORAGE_KEYS.WORKS, JSON.stringify(state));
    },
    setWorks: (state, action) => {
      state.lyrics = action.payload.lyrics || [];
      state.music = action.payload.music || [];
      localStorage.setItem(STORAGE_KEYS.WORKS, JSON.stringify(state));
    },
  },
});

export const { addLyrics, addMusic, deleteWork, setWorks } = worksSlice.actions;
export default worksSlice.reducer;
