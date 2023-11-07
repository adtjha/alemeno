import { createSlice } from "@reduxjs/toolkit"


export const tokenSlice = createSlice({
    name: 'token',
    initialState: {
        token: ''
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload
        },
        resetToken: (state, action) => {
            state.token = ''
        }
    }
})


export const { setToken, resetToken } = tokenSlice.actions;

export default tokenSlice.reducer
