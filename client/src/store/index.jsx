// store.js
import { configureStore } from '@reduxjs/toolkit';
import socketReducer from "./slice/socketSlice";
import rtcReducer from './slice/rtcSlice';

const store = configureStore({
    reducer: {
        socket: socketReducer,
        webrtc: rtcReducer,
    },
});

export default store;
