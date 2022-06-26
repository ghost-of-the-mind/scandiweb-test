import { createSlice } from '@reduxjs/toolkit'

//* The initial variable for this state */
    const initialState = {
        value: [],
    }

export const productItemsSlice = createSlice({
    //* Name to identify this  state */
        name: 'productItems',
    //* Initiates the initial state */
        initialState,
    //* All the actions to change the state */
    //* action.payload = whatever is added to the dispatched action argument field */
        reducers: {
            setProductItems: (state, action) => {
                state.value = action.payload;
            },
            clearProductItems: (state) => {
                state.value = [];
            },
        },
})

//* Exports the actions to affect the state */
    export const { setProductItems, clearProductItems } = productItemsSlice.actions;

//* Exports the state */
    export default productItemsSlice.reducer;