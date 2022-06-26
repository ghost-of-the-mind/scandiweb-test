import storage from 'redux-persist/lib/storage';
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist';
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import productCurrencySlice from './stateSlices/productCurrencySlice';
import productCategorySlice from './stateSlices/productCategorySlice';
import cartSlice from './stateSlices/cartSlice';
import isCartVisibleSlice from './stateSlices/isCartVisibleSlice';
import productItemsSlice from './stateSlices/productItemsSlice';

//* The configuration used when persisting redux-toolkit store with redux-persist */
    const persistConfig = {
        key: 'root',
        version: 1,
        //* Local storage by default, optional: session storage or async storge. */
        storage,
    };

//* Combine all your reducers a.k.a. state slices to avoid having to persist them individualy */
    const rootReducer = combineReducers({
        //* Use this slice reducer function to handle all updates to that state. */
            productCurrency: productCurrencySlice,
            productCategory: productCategorySlice,
            cart: cartSlice,
            isCartVisible: isCartVisibleSlice,
            productItems: productItemsSlice,
    });

//* Persist the state slices in Localhost based on the persistConfig as settings */ 
    const persistedReducer = persistReducer(persistConfig, rootReducer);

//* Creates the Redux store that holds are state to be shared in0between react components *
    const store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }),
    });

export default store;
