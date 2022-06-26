import React from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { setProductCategory, setCategories } from '../../redux/stateSlices/productCategorySlice.js';
import { setProductCurrency, setCurrencies } from '../../redux/stateSlices/productCurrencySlice.js';
import { setCartCount } from '../../redux/stateSlices/cartSlice.js';

import GET_CURRENCIES from '../graphql/GET_CURRENCIES';
import GET_CATEGORIES from '../graphql/GET_CATEGORIES';

import NavLogo from '../../assets/shopping-bag.png';

import CartModal from './CartModal';

//* mapStateToProps - selects the state from the Redux store to use */
//* Access with this.props.stateInQuestion */
  const mapStateToProps = (state) => {
    const { 
      productCategory,
      productCurrency, 
      cart,
      isCartVisible,
    } = state;
    return { 
      productCategory: productCategory.value, //*  */
      categories: productCategory.categories, //* */
      productCurrency: productCurrency.value, //* */
      currencies: productCurrency.currencies, //* */
      cart: cart.value, //* */
      cartCount: cart.cartCount, //* */
      isCartVisible: isCartVisible.value, //* */
    };
  }

class NavSection extends React.Component {

  //* Fetch GraphQL method - GET_CURRENCIES and GET_CATEGORIES */
    async fetchNavData() {
      try{
        const endpoint = 'http://localhost:4000/graphql';
        const headers = {
          'content-type': 'application/json',
        };

        //* GET_CATEGORIES */
          const categoryQuery = {
            'query': GET_CATEGORIES,
            'variables': {}
          };
          const categoryOptions = {
            'method': 'POST',
            'headers': headers,
            'body': JSON.stringify(categoryQuery)
          };

          const categoryResponse = await fetch(endpoint, categoryOptions);
          const categoryData = await categoryResponse.json();
          const categoryList = await categoryData.data.categories.map(category => category.name);

          this.props.dispatch(setCategories(categoryList));

        //* GET_CURRENCIES */
          const currencyQuery = {
            'query': GET_CURRENCIES,
            'variables': {}
          };

          const currencyOptions = {
            'method': 'POST',
            'headers': headers,
            'body': JSON.stringify(currencyQuery)
          };
          
          const currencyResponse = await fetch(endpoint, currencyOptions);
          const currencyData = await currencyResponse.json();
          const currencyList = await currencyData.data.currencies.map(currency => currency);

          this.props.dispatch(setCurrencies(currencyList));
      } 
      catch (error) {
        console.log(error);
      }
    }

  //* Fetch and save data in state after rendering components */
    componentDidMount() {
      this.fetchNavData();
    }

  //* onChange handler for 'ChangeCategoryButtons' - changes the product's cateogry */
    changeCategory = (event) => {
      this.props.dispatch(setProductCategory(event.target.value));
    };


  render() {

    //* Buttons for changing product category */
      const ChangeCategoryButtons = () => {
        return this.props.categories.map((category, index) => {

          const toLink = (cat) => {
            if(cat === 'all') {
              return '/'
            } else if (cat === 'tech') {
              	return '/tech'
            } else if (cat === 'clothes') {
              return '/clothes'
            }
          };

          return (
            <Link
              to={toLink(category)}
              key={index}
            >
              <button
                id={'category-button-' + category}
                key={category}
                value={category}
                onClick={this.changeCategory}
                onChange={this.changeCategory}
                className={this.props.productCategory === category ?
                  'category-select-button-active' : 
                  'category-select-button-inactive'}
              >
                {category}
              </button>
            </Link>
          )
        })
      };

    //* A <select> dropdown for setting the site-wide-currency 
      const DisplayCurrencyDropDown = () => {
        return (
          <select 
            onChange={(event) => this.props.dispatch(setProductCurrency(event.target.value))}
            onClick={(event) => this.props.dispatch(setProductCurrency(event.target.value))}
            className='nav-currency-dropdown rale-normal-500'
          >
            {this.props.currencies.map(money => {
              return (
                <option 
                  key={money.label}
                  value={money.symbol}
                  selected={this.props.productCurrency === money.symbol}
                >
                  {money.symbol} {money.label}
                </option>
              )
            })}
          </select>
        )
      };

    //* Set the cart item quantity to appear on the cart badge */
      let totalQty = 0;
        
      for (const product of this.props.cart) {
        totalQty = totalQty + product.count;
      }

      this.props.dispatch(setCartCount(totalQty))

    return (
      <nav
        className={
          this.props.isCartVisible === true ? 'nav-open-cart-modal' : null
        }
      >

        <section
          className='nav-category-button-section'
        >
          <ChangeCategoryButtons /> 
        </section>

        <section>
          <Link to="/">
            <img
              alt='Icon that, when clicked, takes you to the Home Page'
              src={NavLogo}
              className='nav-home-page-icon'
              onClick={() => this.props.dispatch(setProductCategory('all'))}
              onChange={() => this.props.dispatch(setProductCategory('all'))}
            />
          </Link>
        </section>

        <section
          className='nav-modal-section'
        >
          <DisplayCurrencyDropDown />
          
          <CartModal />

          {this.props.cartCount <= 0 ? null : <section
              className='nav-cart-badge'
            >
              <p
                className='nav-cart-badge-content'
              >
                {
                  this.props.cartCount
                }
              </p>
            </section>
          }

        </section>
      </nav>
    )
  }
}

export default connect(mapStateToProps)(NavSection);