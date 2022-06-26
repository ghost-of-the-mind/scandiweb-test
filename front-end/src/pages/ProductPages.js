import React from 'react';

import { connect } from 'react-redux';
import { setCart } from '../redux/stateSlices/cartSlice';
import { setProductItems, clearProductItems } from '../redux/stateSlices/productItemsSlice';

import GET_PRODUCT_PAGE_BY_ID from '../components/graphql/GET_PRODUCT_PAGE_BY_ID';

import CheckIfInStock from '../components/functions/CheckIfInStock.js';

import { v4 as uuidv4 } from 'uuid';

import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

//* mapStateToProps - selects the state from the Redux store to use */
//* Access with this.props.stateInQuestion */
    const mapStateToProps = (state) => {
        const { 
            productCurrency, 
            productItems,
            cart,
        } = state;
        return { 
            productCurrency: productCurrency.value,
            cart: cart.value,
            productItems: productItems.value,
        };
    }
class ProductPages extends React.Component {
    //* Set state */
        constructor(props) { 
        super(props);
            this.state = {
                data: null,
            };
        }

    //* Fetch GraphQL method - GET_PRODUCT_PAGE_BY_ID */
        async fetchProductData() {
            try {
            //* Create the 'id' variable to pass down to GET_PRODUCT_PAGE_BY_ID based on page url */
                const urlParam = window.location.pathname.split('/').pop();

            const endpoint = 'http://localhost:4000/graphql';
            const headers = {
                'content-type': 'application/json',
            };
            const graphqlQuery = {
                'query': GET_PRODUCT_PAGE_BY_ID,
                'variables': {
                    'id': urlParam,
                }
            };
            const options = {
                'method': 'POST',
                'headers': headers,
                'body': JSON.stringify(graphqlQuery)
            };
            
            const response = await fetch(endpoint, options);
            const data = await response.json();

            this.setState({
                data: data.data.product,
            })
            } catch (error) {
                console.log(error);
            }
        }

    //* Fetch and save data in state after rendering components */
        componentDidMount(){
            this.fetchProductData();

            this.props.dispatch(clearProductItems());
        }

    //* 'Add to Cart' button handler function */
        addToCartFunction = () => {
                    
            //* Check if the product is already inside the 'cartState' */
            //* And, if it is, get it's index
                const productIndex = this.props.cart.findIndex(cart => { 
                    return cart.id === this.state.data.id 
                });

            //* Make a deep-copy of both the the 'cartState' and the 'itemState' */
                let newCart = JSON.parse(JSON.stringify(this.props.cart));
                let newItems = JSON.parse(JSON.stringify(this.props.productItems));

            //* If 'newItems' is an empty [], then use the 'defaultChecked' values from input a.k.a. first item from each attribute for attribute itmes
                if(newItems === undefined || newItems.length === 0) {

                    const obj = [];   

                    this.state.data.attributes.map((attribute) => {
                        return obj.push(
                            {
                                id: attribute.id,
                                selectedItem: attribute.items[0].value
                            }
                        )   
                    })

                    newItems = obj;
                }

            //* If 'newItems' is not empty, but does not have all the attributes
                if(newItems.length > 0) {

                    //* Find the attribute ids that are missing from newItems
                        const missingAttributes = this.state.data.attributes.filter(e => !newItems.find(a => e.id === a.id));

                    //* Add the missing attributes 
                        missingAttributes.map((attribute) => {
                            return newItems.push(
                                {
                                    id: attribute.id,
                                    selectedItem: attribute.items[0].value  
                                }
                            )
                        })
                }

            //* If the product EXSISTS in the cartState */
                if(productIndex >= 0) {

                    //* Prepare the new product obj */
                        const newProductObj = {
                            id: uuidv4().toString().replace(/-/g, ""),
                            graphId: this.state.data.id,
                            brand: this.state.data.brand,
                            name: this.state.data.name,
                            gallery: this.state.data.gallery,
                            count: 1,
                            prices: this.state.data.prices,
                            attributes: this.state.data.attributes,
                            selectedAttributes: newItems 
                        };
        
                //* Push the new product into the 'cartState' */
                    newCart.push(newProductObj);
                }

            //* If the product is not in the 'cartState' */
                if(productIndex === -1) {            
                    
                    //* Prepare the new product obj */
                        const newProductObj = {
                            id: uuidv4().toString().replace(/-/g, ""),
                            graphId: this.state.data.id,
                            brand: this.state.data.brand,
                            name: this.state.data.name,
                            gallery: this.state.data.gallery,
                            count: 1,
                            prices: this.state.data.prices,
                            attributes: this.state.data.attributes,
                            selectedAttributes: newItems 
                        };
            
                    //* Push the new product into the 'cartState' */
                        newCart.push(newProductObj);
                }       
                
                //* Update 'cartState' to be the new list of products + clear productItems */
                    return this.props.dispatch(setCart(newCart));
        };

    //* Display the selected image from gallery */
        displayImg = (src) => {
            return document.getElementById('product-page-img-focus-selected').setAttribute('src', src)
        }

    //* Display all the images from the product's 'gallery' GraphQL data */
        displayProductImg = (gallery) => {
            
            return gallery.map((img, index) => {

                //* Check if the product is in stock */
                if(CheckIfInStock(this.state.data.inStock) === false) {
                    return (
                        <figure
                            key={index}
                        >
                            <img
                                src={img}
                                alt=''
                                className='out-of-stock-img'
                                onClick={() => this.displayImg(img)}
                            />
                            <figcaption
                                className='rale-small-figcaption'
                            > 
                                OUT OF STOCK 
                            </figcaption>
                        </figure>
                    )
                } else {
                    return (
                        <figure
                            key={index}
                        >
                            <img
                                src={img}
                                alt='' 
                                onClick={() => this.displayImg(img)}                              
                            />
                        </figure>
                    )
                }
        })};

    //* Handle input selection
        inputClick = (attribute, event) => {

            //* Parse state
                let state = JSON.parse(JSON.stringify(this.props.productItems));
    
            //* Get all the required values from the clicked input
                const attributeId = attribute.id;
                const itemTargetValue = event.target.value;
    
            //* Check if the attribute is in state
                const attributeIs = state.some(item => item.id === attributeId);
    
            //* If the attribute does not exsist - add the attribute to state
                if(attributeIs === false) {
    
                    const obj = {
                        id: attributeId,
                        selectedItem: itemTargetValue
                    };
        
                    state.push(obj);

                    return this.props.dispatch(setProductItems(state));
            }
    
            //* If the attribute id already exsists in state
                if(attributeIs) {
                
                    //* Find the index of the attribute in question
                        const attributeIndex = state.map(object => object.id).indexOf(attributeId);
                        const attributeInQuestion = state[attributeIndex].selectedItem;
    
                    //* If the attribute's item's id is the same as the seelected input - do nothing
                    if(attributeInQuestion === itemTargetValue) {
                        return
                    }
                    //* If the attribute's item's id is not the same - change it to the new value
                    if(attributeInQuestion !== itemTargetValue) {
    
                        state[attributeIndex].selectedItem = itemTargetValue;

                        return this.props.dispatch(setProductItems(state));
                    }
                }
        };

    //* Displays all avaiable product atributes for the user to choose from
        displayAtributes = (attributes) => {

            //* If product atribute is a Hex color, display the color not the HEX code
            const reg = /^#([0-9a-f]{3}){1,2}$/i;

            return attributes.map((attribute, index) => {
                return (
                    <section
                        key={attribute.name + index}
                    >
                        <label 
                            key={attribute.name}
                            className='roboto-normal-700'
                            style={{
                                'textTransform': 'uppercase'
                            }}
                        >
                            {attribute.name + ":"}
                        </label>

                        <section
                            className='product-page-option-section'
                        >
                            {attribute.items.map((item, i) => {
                                    return (
                                        <section
                                            className='product-option'
                                            key={i}
                                        >
                                            <input 
                                                type='radio'

                                                key={attribute.name + item.id}
                                                id={attribute.name + item.id}
                                                name={attribute.name}
                                                value={item.value}

                                                defaultChecked={i === 0}

                                                onChange={(event) => this.inputClick(attribute, event)}
                                            />

                                            {reg.test(item.value) ? 
                                                <label 
                                                    htmlFor={attribute.name + item.id}
                                                    className='source-normal-400'
                                                    style={{
                                                        'backgroundColor': item.value,
                                                        'padding': '0.8rem'
                                                    }}
                                                >
                                                </label> : 
                                                <label 
                                                    htmlFor={attribute.name + item.id}
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

    //* Display prices by using the label from 'currencyAtom' that stores the users chosen currency */
        displayPrices = (prices) => { 
            const rightPrice = prices.find(item => item.currency.symbol === this.props.productCurrency);
            return (
                <p
                    className='rale-cart-page-price'
                >
                    {rightPrice.currency.symbol}
                    {rightPrice.amount}
                </p>
            )
        };        

    //* Cleans the "description" string with HTML before inserting it into a React component
        cleanDescription = (text) => {
            const sanitizedText = DOMPurify.sanitize(text, {
                USE_PROFILES: {
                    html: true
                }});

            return parse(sanitizedText);
        }
    

    render() {

        //* Delay normal component rendering until api data is fetched in this.state.data */
            if (!this.state.data) {
                return (
                    <main
                        className='product-page-grid'
                    >
                        <h2>
                            Loading...
                        </h2>
                    </main>
                )
            }
        
        //* 'Add To Cart' button component */
            const AddToCartButton = () => {
                return (
                    <button
                        onClick={this.addToCartFunction}
                        id='add-to-cart-btn'
                        disabled={CheckIfInStock(this.state.data.inStock) === false}
                        style={CheckIfInStock(this.state.data.inStock) === false ? {'cursor': 'not-allowed'} : {'cursor': 'pointer'}}
                        className='rale-normal-600 product-add-to-cart-button'
                    >
                        ADD TO CART
                    </button>
                )
            };

        return (
            <main
                className='product-page-grid'
            >

                <section
                    className='product-page-img-gallery-section'
                >
                    {this.displayProductImg(this.state.data.gallery)}
                </section>

                <section
                    className='product-page-img-focus-section'
                >
                    <figure>
                        <img
                            id='product-page-img-focus-selected'
                            alt=''
                            src={this.state.data.gallery[0]}
                        >
                        </img>
                    </figure>
                </section>

                <section
                    className='product-page-info-section'
                >
                    <section
                        className='info-name-section'
                    >    
                        <p
                            className='rale-product-page-title'
                            style={{
                                'marginBottom': '1rem'
                            }}
                        >
                            {
                                this.state.data.brand
                            }
                        </p>
                        <h1
                            className='rale-product-page-sub-title'
                        >
                            {
                               this.state.data.name
                            }
                        </h1>
                    </section>

                    <section
                        className='info-options-section'
                    >
                        {this.displayAtributes(this.state.data.attributes)}
                    </section>

                    <section
                        className='info-price-section'
                    >
                        <p
                            className='roboto-normal-700'
                        >
                            PRICE:
                        </p>

                        {this.displayPrices(this.state.data.prices)}
                    </section>

                    <section
                        className='info-add-to-cart-section'
                    >
                        <AddToCartButton /> 
                    </section>

                    <section
                        className='roboto-normal-400 product-page-description'
                    >
                        {this.cleanDescription(this.state.data.description)}
                    </section>
                </section>
            </main>
        )
    }
}

export default connect(mapStateToProps)(ProductPages);