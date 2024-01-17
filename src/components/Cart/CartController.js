/* eslint-disable */
import React from 'react';
import CartView from './CartView';


const CartController = ({ cartFieldIds }) => (
    <CartView numberOfFiles={cartFieldIds.length || 0}  />
);
export default CartController;
