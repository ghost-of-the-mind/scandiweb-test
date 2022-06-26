import { createSlice } from '@reduxjs/toolkit'

//* The initial variable for this state */
    const initialState = {
        value: false,
    }

export const isCartVisibleSlice = createSlice({
    //* Name to identify this  state */
        name: 'isCartVisible',
    //* Initiates the initial state */
        initialState,
    //* All the actions to change the state */
    //* action.payload = whatever is added to the dispatched action argument field */
        reducers: {
            setisCartVisible: (state, action) => {
                state.value = action.payload;
            },
        },
})

//* Exports the actions to affect the state */
    export const { setisCartVisible } = isCartVisibleSlice.actions;

//* Exports the state */
    export default isCartVisibleSlice.reducer;