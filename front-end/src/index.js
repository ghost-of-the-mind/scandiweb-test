import React, { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import { persistStore } from 'redux-persist';
import store from './redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './css/reset.css';
import './css/styles.css';
import './css/fonts.css';

import NavSection from './components/nav/NavSection';
  import AllPage from './pages/store/AllPage';
  import TechPage from './pages/store/TechPage';
  import ClothesPage from './pages/store/ClothesPage';
    import ProductPages from './pages/ProductPages';
import FooterSection from './components/footer/FooterSection';
import CartPage from './pages/CartPage.js';


//* The ID of the main <section> in index.html */
  const rootElement = document.getElementById('root'); 
    const root = createRoot(rootElement);

//* Prepares the redux-toolkit store to be passed to <PersistGate> */
  let persistor = persistStore(store);

//* Creates the App in index.js rather than having a seperate App.js file */
  class App extends React.Component {
    render () {
      return (
        <BrowserRouter
          //* Allows linking and routing between pages with routes */
        >
          <Provider 
            //* Provides the redux-toolkit store to all children */
            store={store}
          >
          <PersistGate 
            //* Delays rendering until persisted state has been retrieved and saved to redux */
            loading={null} persistor={persistor}
          >

            <NavSection />
              <Routes>
                <Route 
                  path='/' 
                  element={
                    <AllPage />
                  } 
                />
                <Route 
                  path='/clothes' 
                  element={
                    <ClothesPage />
                  } 
                />
                <Route 
                  path='/tech' 
                  element={
                    <TechPage />
                  } 
                />
                
                <Route 
                  path='/product/:id' 
                  element={
                    <ProductPages />
                  } 
                />
                <Route 
                  path='/cart' 
                  element={
                    <CartPage />
                  } 
                />
              </Routes>

            <FooterSection />

          </PersistGate>
          </Provider>
        </BrowserRouter>
      )
    }
  }

//* Renders the App root that was created with createRoot */
  root.render(
    <StrictMode>
        <App />
    </StrictMode>,
  );
