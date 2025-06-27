/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import CartView from './CartView';

const CartController = ({ cartFieldIds }) => (
  <CartView numberOfFiles={cartFieldIds.length || 0}  />
);

const mapStateToProps = (state) => ({
  cartFieldIds: state.cartReducer.filesId ? state.cartReducer.filesId : [],
});
  
export default connect(mapStateToProps)(CartController);
