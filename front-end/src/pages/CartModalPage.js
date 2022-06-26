import React from 'react';

import { connect } from 'react-redux';
import { setCart, setCartCount, clearCart, clearCartCount } from '../redux/stateSlices/cartSlice';
import { setisCartVisible } from '../redux/stateSlices/isCartVisibleSlice';

import { Link } from 'react-router-dom';

//* mapStateToProps - selects the state from the Redux store to use */
//* Access with this.props.stateInQuestion */
  const mapStateToProps = (state) => {
    const { 
      cart,
      productCurrency,
      isCartVisible
    } = state;
    return { 
      cart: cart.value,
      cartCount: cart.cartCount,
      productCurrency: productCurrency.value,
      isCartVisible: isCartVisible.value,
    };
  }
class CartModalPage extends React.Component {

  //* Display prices by using the users chosen currency - this.props.productCurrency */
    displayPrices = (prices) => { 
      //* Get the the currency label to determine in what currency should all prices be displayed */
        const rightPrice = prices.find(item => item.currency.symbol === this.props.productCurrency);

      //* Display the price with the user's chosen label */
        return (
            <p
              style={{                 
                'fontFamily': 'Raleway',
                'fontStyle': 'normal',
                'fontWeight': '500',
                'fontSize': '1rem',
                'lineHeight': '160%',
                'color': '#1D1F22'
              }}
            >
                {rightPrice.currency.symbol}
                {rightPrice.amount}
            </p>
        )
    };

  //* Handle input selection if the user wishes to change item attributes */
    inputClick = (product, attribute, event) => {
      //* Deep-copy the cart state */
        let newCart = JSON.parse(JSON.stringify(this.props.cart));

      //* Get the values from event */
        const productId = product.id;
        const attributeId = attribute.id;
        const itemTargetValue = event.target.value;

      //* Find the product in cart state */
        const productIndex = newCart.map((object) => object.id).indexOf(productId);

      //* Find the attribute by id in question */
        const attributeIndex = newCart[productIndex].selectedAttributes.map(object => object.id).indexOf(attributeId);

      //* Change the products selected attribute item */
        newCart[productIndex].selectedAttributes[attributeIndex].selectedItem = itemTargetValue;

      //* Update theshopping cart */
        this.props.dispatch(setCart(newCart));
    };

  //* Displays all avaiable product atributes for the user to choose from (including the selected attributes) */
    displayAtributes = (product) => {
            
        //* If product atribute is a Hex color, display the color not the HEX code
          const reg = /^#([0-9a-f]{3}){1,2}$/i;

        return product.attributes.map((attribute, index) => {

            const selectedId = product.selectedAttributes.map(object => object.id).indexOf(attribute.id);

            return (
                <section
                  key={product.id + attribute.name + index}
                >
                    <label 
                        key={product.id + attribute.name}
                        style={{
                          'fontFamily': 'Raleway',
                          'fontStyle': 'normal',
                          'fontWeight': '400',
                          'fontSize': '1rem',
                          'lineHeight': '16px',
                          'color': '#1D1F22'
                      }}
                    >
                        {attribute.name + ":"}
                    </label>

                    <br/>

                    <section
                        className='cart-modal-option-section'
                    >
                        {attribute.items.map((item, i) => {

                                return (
                                    <section
                                        className='product-option'
                                        key={product.id + i}
                                    >
                                        <input 
                                            type='radio'

                                            key={product.id + attribute.name + item.id}
                                            id={product.id + attribute.name + item.id}
                                            name={product.id + attribute.name}
                                            value={item.value}

                                            defaultChecked={product.selectedAttributes[selectedId].selectedItem === item.value}

                                            onChange={(event) => this.inputClick(product, attribute, event)}
                                        >
                                        </input>

                                        {reg.test(item.value) ? 
                                            <label 
                                                htmlFor={product.id + attribute.name + item.id}
                                                className='source-normal-400'
                                                style={{
                                                  'backgroundColor': item.value,
                                                  'padding': '0.6rem',
                                                }}
                                            >
                                            </label> : 
                                            <label 
                                                htmlFor={product.id + attribute.name + item.id}
                                                style={{
                                                  'fontFamily': 'Source Sans Pro',
                                                  'fontStyle': 'normal',
                                                  'fontWeight': '400',
                                                  'fontSize': '0.9rem',

                                                  'padding': '0 0.4rem',
                                              }}
                                            >
                                            {
                                                item.value
                                            }
                                            </label>
                                        }
                                    </section>
                                ) 
                        })}
                    </section>
                </section>
            )
      })
  };

  //* Display the item's count */
    displayCount = (product) => {
      return product.count;
    }

  //* Increase the count of an item */
    increaseCount = (product) => {
      let newCart = JSON.parse(JSON.stringify(this.props.cart));

      const productIndex = newCart.map(item => item.id).indexOf(product.id);

      newCart[productIndex].count = newCart[productIndex].count + 1;

      return this.props.dispatch(setCart(newCart));
    }

  //* Decrease the count of an item */
    decreaseCount = (product) => {
      let newCart = JSON.parse(JSON.stringify(this.props.cart));

      const productIndex = newCart.map(item => item.id).indexOf(product.id);

      newCart[productIndex].count = newCart[productIndex].count - 1;

      if(newCart[productIndex].count === 0) {
        //* delete an object from an array javascript
        newCart.splice(productIndex, 1);
      }

      return this.props.dispatch(setCart(newCart));
    } 

  //* onClick for the 'Clear Cart' Button */
    clearCart = () => {
      this.props.dispatch(clearCart());
      return this.props.dispatch(clearCartCount())
    }

  render () {

    //* Display all the items that have been added to the shopping cart */
      const DisplayCartItems = () => {    
        return this.props.cart.map((product, index) => {
          return (
            <section
              className='cart-page-grid'
              key={index}
            >
              <section>
                <section>
                  <p
                    style={{
                      'fontFamily': 'Raleway',
                      'fontStyle': 'normal',
                      'fontWeight': '300',
                      'fontSize': '1rem',
                      'lineHeight': '160%',
                      'color': '#1D1F22'
                    }} 
                  >
                    {
                      product.brand
                    }
                  </p>
                  <p
                    style={{
                      'fontFamily': 'Raleway',
                      'fontStyle': 'normal',
                      'fontWeight': '300',
                      'fontSize': '1rem',
                      'lineHeight': '160%',
                      'color': '#1D1F22'
                    }} 
                  >
                    {
                      product.name
                    }
                  </p>
    
                  {this.displayPrices(product.prices)}
                </section>
    
                <section>
                  {this.displayAtributes(product)}
                </section>
              </section>
    
              <section
                  className='cart-page-count-buttons'
                >
                  <button
                    onClick={() => this.increaseCount(product)}  
                  >
                    &#43;
                  </button>
    
                  <p>
                    {this.displayCount(product)}
                  </p>
    
                  <button
                    onClick={() => this.decreaseCount(product)}  
                  >
                    &#8722;
                  </button>
              </section>
    
              <section
                  className='cart-page-gallery'
                >
                  <section>
                    <figure>
                      <img 
                        src={product.gallery[0]} 
                        alt='' 
                      />
                    </figure>
                  </section>
                </section>
    
            </section>
          )
        })
      }

    //* Display shopping cart order totals */
      const CartTotals = () => {
        let totalCost = 0;

        for (const product of this.props.cart) {
          const rightPrice = product.prices.find(item => item.currency.symbol === this.props.productCurrency);
          
          totalCost = totalCost + (product.count * rightPrice.amount);
        }

        return (
          <section
            /* className='cart-page-order-totals' */
            className='cart-modal-order-totals'
          >
            <p
              /* className='cart-total-p' */
              style={{
                'fontFamily': 'Roboto',
                'fontStyle': 'normal',
                'fontWeight': '500',
                'fontSize': '1rem',
                'lineHeight': '18px',
                'color': '#1D1F22'
              }}
            >
              <b>
                Total
              </b>
            </p>
            <p
              style={{
                'fontFamily': 'Raleway',
                'fontStyle': 'normal',
                'fontWeight': '700',
                'fontSize': '1rem',
                'lineHeight': '160%',
                'color': '#1D1F22'
              }}
            >
              {this.props.productCurrency + totalCost.toFixed(2)}
            </p>
          </section>
        )
      }

    //* If the shopping cart is empty - render 'Your Cart is Empty' */
      if(this.props.cart.length === undefined || this.props.cart.length === 0) {
        
        this.props.dispatch(setCartCount(0));
        
        return (
          <main>
            <h2
              style={{
                'textAlign': 'center'
              }}
            >
              Your Cart is Empty.
            </h2>
          </main>
        )
      } else {
        return (
          <main
            className='cart-modal-main'
          >
            <section
              className='cart-modal-title'
            >
              <p
                className='cart-modal-title-main'
              >
                My Bag,
              </p>
              <p
                className='cart-modal-title-count'
              >
                {' ' + this.props.cartCount + ' items'}
              </p>
            </section>
    
            <section>
              <DisplayCartItems />
            </section>
    
            <CartTotals />
            
            <section
              className='cart-page-button-grid'
            >
                <button 
                  onClick={() => this.props.dispatch(clearCart())}
                  className='rale-normal-600 product-add-to-cart-button-white'
                >
                  CLEAR CART
                </button>
    
                <Link to="/cart"
                  className='store-product-card-link'
                >
                  <button
                    className='rale-normal-600 product-add-to-cart-button'
                    onClick={() => this.props.dispatch(setisCartVisible(false))}
                  >
                    VIEW BAG
                  </button>
                </Link>   
    
            </section>
          </main>
        )
      }      
  }
}

export default connect(mapStateToProps)(CartModalPage);