import React from 'react';

import { connect } from 'react-redux';
import { setisCartVisible } from '../../redux/stateSlices/isCartVisibleSlice';

import CartModalPage from '../../pages/CartModalPage';
import ShoppingCart from '../../assets/shopping-cart.png';

//* mapStateToProps - selects the state from the Redux store to use */
//* Access with this.props.stateInQuestion */
    const mapStateToProps = (state) => {
        const { 
            isCartVisible,
        } = state;
        return { 
            //* Should the CartModal be shown - true or false */
            isCartVisible: isCartVisible.value,
        };
    }

class CartModal extends React.Component {

    //* Set state and ref */
        constructor(props) {
            super(props);
            this.ref = React.createRef(null);
            this.handleClickOutside = this.handleClickOutside.bind(this);
        }

    //* Add event-listener when component renders and fetch state data */
        componentDidMount() {
            document.addEventListener('click', this.handleClickOutside, true);
        }

    //* Remove event-listener when component de-renders */
        componentWillUnmount() {
            document.removeEventListener('click', this.handleClickOutside, true);
        }
    
    //* Close modal when event-listener detects click outside component */
        handleClickOutside = (event) => {
            if(this.ref.current && !this.ref.current.contains(event.target)) {
                this.props.dispatch(setisCartVisible(false));
            }
        };

    //* Handles what happens when the shopping cart icon is clicked on - opens modal or shows alert */
        handleShopingCartClick = () => {
            const urlParam = window.location.pathname.split('/').pop();

            if(urlParam === 'cart'){
                return alert('You already are viewing the shopping cart.')
            } else {
                return this.props.dispatch(setisCartVisible(true));
            }
        };

    render() {
        
        //* The cart modal itself with the <CartModalPage /> */
            const Modal = () => {
                if(!this.props.isCartVisible) {
                    return null;
                }
                    
                return (
                    <section
                        ref={this.ref}
                        className='cart-modal' 
                    >
                        <CartModalPage />
                    </section>
                )
            };

        return (
            <section>
                <img
                    className='shopping-cart-icon'
                    alt=''
                    src={ShoppingCart}                
                    onClick={() => this.handleShopingCartClick()}
                />
                <Modal />
            </section>
        )
    }
}

export default connect(mapStateToProps)(CartModal);
