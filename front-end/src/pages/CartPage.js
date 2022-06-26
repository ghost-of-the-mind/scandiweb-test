import React from 'react';

import { connect } from 'react-redux';
import { setCart, setCartCount, clearCart, clearCartCount } from '../redux/stateSlices/cartSlice';

//* mapStateToProps - selects the state from the Redux store to use */
//* Access with this.props.stateInQuestion */
  const mapStateToProps = (state) => {
    const { 
      cart,
      productCurrency,
    } = state;
    return { 
      cart: cart.value,
      cartCount: cart.cartCount,
      productCurrency: productCurrency.value,
    };
  }

class DisplayCart extends React.Component {

  //* Display prices by using the users chosen currency - this.props.productCurrency */
    displayPrices = (prices) => { 
      //* Get the the currency label to determine in what currency should all prices be displayed */
        const rightPrice = prices.find(item => item.currency.symbol === this.props.productCurrency);

      //* Display the price with the user's chosen label */
        return (
            <p
              className='rale-cart-page-price'
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
                      className='roboto-normal-700'
                      style={{
                          'textTransform': 'uppercase'
                      }}
                  >
                      {attribute.name + ":"}
                  </label>

                  <br/>

                  <section
                      className='product-page-option-section'
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
                                                  'padding': '0.8rem'
                                              }}
                                          >
                                          </label> : 
                                          <label 
                                              htmlFor={product.id + attribute.name + item.id}
                                              className='source-normal-400'
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

  //* Display the images of the item in shopping cart */
    displayImageGallery = (id, gallery) => {
        
      let imgIndex = 0;

      const slideRight = () => {
        imgIndex = (imgIndex + 1) % gallery.length; 
        return document.getElementById(id).src = gallery[imgIndex];
      };

      const slideLeft = () => {
        const nextIndex = imgIndex - 1;
        if(nextIndex < 0) {
          imgIndex = gallery.length - 1;
          return document.getElementById(id).src = gallery[imgIndex];
        } else {
          imgIndex = nextIndex;
          return document.getElementById(id).src = gallery[imgIndex];
        }
      };

      return (
          <section
            className='cart-page-gallery'
          >

            <section>
              <figure>
                <img 
                  src={gallery[0]} 
                  id={id}
                  alt='' 
                />
              </figure>
            </section>

            <section
              className='cart-page-gallery-buttons'
            >
              <button 
                onClick={() => slideLeft()}
              >
                &#60;
              </button>
              <button 
                onClick={() => slideRight()}
              >
                &#62;
              </button>
            </section>

          </section>
      );
    }

  //* onClick for the 'Clear Cart' Button */
    clearCart = () => {
      this.props.dispatch(clearCart());
      return this.props.dispatch(clearCartCount())
    }

  render() {

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
                    className='rale-product-page-title'
                  >
                    {
                      product.brand
                    }
                  </p>
                  <p
                    className='rale-product-page-sub-title'
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
    
              {this.displayImageGallery(product.id, product.gallery)}
    
            </section>
          )
        })
      }

    //* Display shopping cart order totals */
      const CartTotals = () => {
        let totalTax = 0;
        let totalCost = 0;

        for (const product of this.props.cart) {
          const rightPrice = product.prices.find(item => item.currency.symbol === this.props.productCurrency);
          
          totalCost = totalCost + (product.count * rightPrice.amount);
        }

        totalTax = totalCost * 12 / 100;

        return (
          <section
            className='cart-page-order-totals'
          >
            <section>
              <p
                className='cart-total-p'
              >
                Tax: <b>{this.props.productCurrency + totalTax.toFixed(2)}</b>
              </p>
              <p
                className='cart-total-p'
              >
                Qty: <b>{this.props.cartCount}</b>
              </p>
            </section>

            <p
              className='cart-total-p'
              style={{'fontWeight': '500'}}
            >
              Total: &nbsp; &nbsp; <b
                style={{
                  'fontFamily': 'Raleway',
                  'fontStyle': 'normal',
                  'fontWeight': '700'
                }}
              >{this.props.productCurrency + totalCost.toFixed(2)}</b>
            </p>
          </section>
        )
      }

    //* If the shopping cart is empty - render 'Your Cart is Empty' */
      if(this.props.cart.length === undefined || this.props.cart.length === 0) {
        
        this.props.dispatch(setCartCount(0));
      
        return (
          <main
            className='cart-page-main-empty'
          >
            <h2
              style={{
                'textAlign': 'center'
              }}
            >
              Your Cart is Empty.
            </h2>
          </main>
        )
      }
      
      return (
          <main
            className='cart-page-main'
          >
            <h1
              className='rale-normal-700'
            >
              CART
            </h1>
    
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
    
                <button
                  className='rale-normal-600 product-add-to-cart-button'
                  onClick={() => {
                    this.props.dispatch(clearCart())
                    return alert('Thank you for your order!')
                  }}
                >
                  ORDER
                </button> 
    
            </section>
          </main>
    )
  }
}

export default connect(mapStateToProps)(DisplayCart);