import { createSlice } from "@reduxjs/toolkit"


export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {}
    },
    reducers: {
        setUser: (state, action) => {
            state.user = { ...action.payload }
        },
        updateUser: (state, action) => {
            state.user.courseCompleted.push(action.payload)
        },
        resetUser: (state, action) => {
            state.user = {}
        }
    }
})


export const { setUser, resetUser, updateUser } = userSlice.actions;

export default userSlice.reducer
