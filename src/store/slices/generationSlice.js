import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isGenerating: false,
  generationType: null, // 'music' | 'lyrics'
};

const generationSlice = createSlice({
  name: 'generation',
  initialState,
  reducers: {
    startGeneration: (state, action) => {
      state.isGenerating = true;
      state.generationType = action.payload;
    },
    stopGeneration: (state) => {
      state.isGenerating = false;
      state.generationType = null;
    },
  },
});

export const { startGeneration, stopGeneration } = generationSlice.actions;
export default generationSlice.reducer;
