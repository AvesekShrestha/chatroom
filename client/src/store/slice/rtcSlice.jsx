import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import SimplePeer from "simple-peer"

export const initializePeer = createAsyncThunk(async (callStatus) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: callStatus.audio, video: callStatus.video })

    const peer = new SimplePeer({
        initiator: true,
        trickle: false,
        stream,
    })

    return { stream, peer }
})

const rtcSlice = createSlice({
    name: "webrtc",
    initialState: {
        senderPeer: null,
        mediaStream: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(initializePeer.pending, (state) => {
                state.loading = true;
            })
            .addCase(initializePeer.fulfilled, (state, action) => {
                state.loading = false;
                state.senderPeer = action.payload.peer;
                state.mediaStream = action.payload.stream;
            })
            .addCase(initializePeer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
})


export default rtcSlice.reducer;