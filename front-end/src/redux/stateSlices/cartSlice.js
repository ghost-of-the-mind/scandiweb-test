import { createSlice } from '@reduxjs/toolkit'

//* The initial variable for this state */
    const initialState = {
        value: [],
        cartCount: 0,
    }

export const cartSlice = createSlice({
    //* Name to identify this  state */
        name: 'cart',
    //* Initiates the initial state */
        initialState,
    //* All the actions to change the state */
    //* action.payload = whatever is added to the dispatched action argument field */
        reducers: {
            setCart: (state, action) => {
                state.value = action.payload;
            },
            setCartCount: (state, action) => {
                state.cartCount = action.payload;
            },
            clearCart: (state) => {
                state.value = [];
            },
            clearCartCount: (state) => {
                state.cartCount = 0;
            }
        },
})

//* Exports the actions to affect the state */
    export const { setCart, setCartCount, clearCart, clearCartCount } = cartSlice.actions;

//* Exports the state */
    export default cartSlice.reducer;