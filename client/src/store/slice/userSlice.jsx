import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: "user",
    initialState: { userData: null },
    reducers: {
        setUserData(state, action) {
            state.userData = action.payload;
        },
    }
})

export default userSlice;


