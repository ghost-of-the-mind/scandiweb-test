import { createSlice } from '@reduxjs/toolkit'

//* The initial variable for this state */
    const initialState = {
        value: 'all',
        categories: [],
    }

export const productCategorySlice = createSlice({
    //* Name to identify this  state */
        name: 'productCategory',
    //* Initiates the initial state */
        initialState,
    //* All the actions to change the state */
    //* action.payload = whatever is added to the dispatched action argument field */
        reducers: {
            setProductCategory: (state, action) => {
                state.value = action.payload;
            },
            setCategories: (state, action) => {
                state.categories = action.payload;
            },
        },
})

//* Exports the actions to affect the state */
    export const { setProductCategory, setCategories } = productCategorySlice.actions;

//* Exports the state */
    export default productCategorySlice.reducer;