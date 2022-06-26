import React from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { setCart } from '../../redux/stateSlices/cartSlice';

import GET_ALL_PRODUCTS_BY_CATEGORY from '../../components/graphql/GET_ALL_PRODUCTS_BY_CATEGORY';

import CheckIfInStock from '../../components/functions/CheckIfInStock';

import { v4 as uuidv4 } from 'uuid';

import ShoppingCart from '../../assets/shopping-cart.png';


//* mapStateToProps - selects the state from the Redux store to use */
//* Access with this.props.stateInQuestion */
const mapStateToProps = (state) => {
    const { 
        productCurrency, 
        cart 
    } = state;
    return { 
        productCurrency: productCurrency.value,
        cart: cart.value
    };
  }

class TechPage extends React.Component {

    //* Set state */
        constructor(props) { 
        super(props); 
            this.state = {
                productCategory: 'tech',
                storeProducts: JSON.parse(localStorage.getItem('techProducts')) || null,
            };
        }

    //* Fetch GraphQL method - GET_ALL_PRODUCTS_BY_CATEGORY */
        async fetchStoreData() {
            try {
            const endpoint = 'http://localhost:4000/graphql';
            const headers = {
                'content-type': 'application/json',
            };
            const graphqlQuery = {
                'query': GET_ALL_PRODUCTS_BY_CATEGORY,
                'variables': {
                'title': this.state.productCategory,
                }
            };
            const options = {
                'method': 'POST',
                'headers': headers,
                'body': JSON.stringify(graphqlQuery)
            };
            
            const response = await fetch(endpoint, options);
            const data = await response.json();
            const productList = data.data.category.products ;

            this.setState({
                storeProducts: productList
            })

            } catch (error) {
            console.log(error);
            }
        }

    //* Fetch and save data in state after rendering components */
        componentDidMount() {
            this.fetchStoreData();

            //* Get techProducts from localstorage when mounting components */
                const storeProducts = JSON.parse(localStorage.getItem('techProducts'));
                    if(storeProducts) {
                        this.setState({ 
                            storeProducts: storeProducts
                    });
                }
        }

    //* Update/save data in localStorage when this.state changes */
        componentDidUpdate(_prevProps, prevState){   
            
            //* update localstorage if storeProducts changes  */
                if(prevState.storeProducts !== this.state.storeProducts) {
                    localStorage.setItem('techProducts', JSON.stringify(this.state.storeProducts));
                }
        }

    //* Render the image of the product */
        displayProductImg(product) {
        //* Check if the product is in stock */
          const check = CheckIfInStock(product.inStock);
  
          if(check === false) {
            return (
              <figure
              >
                <img
                  src={product.gallery[0]}
                  alt=''
                  className='out-of-stock-img'
                />
                <figcaption
                  className='rale-normal-400'
                > 
                  OUT OF STOCK 
                </figcaption>
              </figure>
            )
          } else if (check === true) {
            return (
              <figure>
                <img
                  src={product.gallery[0]}
                  alt=''
                />
              </figure>
            )
          }
        }
    
    //* Render a product's price by using the label from 'productCurrency' */
        displayPrices(prices) { 
            const rightPrice = prices.find(item => item.currency.symbol === this.props.productCurrency);
                return rightPrice.currency.symbol + rightPrice.amount;
        }

    //* 'Add to Cart' button handler function */
        addToCartFunction(product) {

            //* Make a deep-copy of both the the 'cartState' and the 'itemState' */
                let newCart = JSON.parse(JSON.stringify(this.props.cart));
    
                //* Use the 'defaultChecked' values from input a.k.a. first item from each attribute for attribute itmes
                    const obj = [];    
                
                    product.attributes.map(attribute => {
                        return obj.push(
                            {
                                id: attribute.id,
                                selectedItem: attribute.items[0].value
                            }
                        )   
                    })
    
                //* Prepare the new product obj */
                    const newProductObj = {
                        id: uuidv4().toString().replace(/-/g, ""),
                        graphId: product.id,
                        brand: product.brand,
                        name: product.name,
                        gallery: product.gallery,
                        count: 1,
                        prices: product.prices,
                        attributes: product.attributes,
                        selectedAttributes: obj 
                    };
                
                //* Push the new product into the 'cartState' */
                    newCart.push(newProductObj);     
                    
                //* Update 'cartState' to be the new list of products */
                    this.props.dispatch(setCart(newCart));
        }


    render () {

        //* Delay normal component rendering until api data is fetched in this.state.data */
            if (!this.state.storeProducts) {
                return (
                    <main>
                        <h2>
                            Loading...
                        </h2>
                    </main>
                )
            }

        return (
        <main>
            
            <h1
            className='h1-category'
            >
            {this.state.productCategory[0].toUpperCase() + this.state.productCategory.slice(1).toLowerCase()}
            </h1>

            <section
            className='store-page-grid'
            >

            {this.state.storeProducts.map((product) => (
                <article 
                key={product.id}
                className='store-product-card'
                >

                <Link 
                    to={`/product/${product.id}`}
                    className='store-product-card-link'
                >


                {this.displayProductImg(product)}

                <section
                    className={CheckIfInStock(product.inStock) ? 'store-product-card-info' : 'out-of-stock-info'}
                >
                    <p 
                        className='rale-normal-300'
                    >
                        {product.name}
                    </p>

                    <p
                        className='price-regular-font'
                    >
                        {this.displayPrices(product.prices)}
                    </p>
                </section>
                </Link>

                {CheckIfInStock(product.inStock) === false ? null : 
                    <section
                    className='store-product-card-quick-buy-button'  
                    >
                    <button
                        onClick={() => this.addToCartFunction(product)}
                    >
                        <img 
                        alt='' 
                        src={ShoppingCart} 
                        />
                    </button>
                    </section>
                }

                </article>
            ))}

            </section>

        </main>
        )
    }
}

export default connect(mapStateToProps)(TechPage);