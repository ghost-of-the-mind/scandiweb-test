import { createSlice } from '@reduxjs/toolkit'

//* The initial variable for this state */
    const initialState = {
        value: '$',
        currencies: [],
    }

export const productCurrencySlice = createSlice({
    //* Name to identify this  state */
        name: 'productCurrency',
    //* Initiates the initial state */
        initialState,
    //* All the actions to change the state */
    //* action.payload = whatever is added to the dispatched action argument field */
        reducers: {
            setProductCurrency: (state, action) => {
                state.value = action.payload;
            },
            setCurrencies: (state, action) => {
                state.currencies = action.payload;
            },
        },
})

//* Exports the actions to affect the state */
    export const { setProductCurrency, setCurrencies } = productCurrencySlice.actions;

//* Exports the state */
    export default productCurrencySlice.reducer;