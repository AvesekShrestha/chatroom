// socketSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    connect: (state) => {
      state.isConnected = true;
    },
    disconnect: (state) => {
      state.isConnected = false;
    },
    emitEvent: (state, action) => {
    },
  },
});


export default socketSlice.reducer;
