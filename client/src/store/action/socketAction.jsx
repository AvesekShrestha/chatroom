import socketSlice from "../slice/socketSlice";
export const { connect, disconnect, emitEvent } = socketSlice.actions;