/* eslint-disable */
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CartController from './CartController';
import { toggleSidebar } from '../Layout/LayoutState';
import { initCart } from '../../pages/fileCentricCart/store/cart';

export default compose(
  withRouter,
  connect(
    (state) => ({
      isSidebarOpened: state.layout.isSidebarOpened,
      cartFieldIds: state.cartReducer.filesId? state.cartReducer.filesId:[],
    }),
    { toggleSidebar },
  ),
  lifecycle({
    componentDidMount() {
      initCart();
    },
    shouldComponentUpdate({ location: nextLocation }) {
      const pathName = this.props.location.pathname;
      return (
        pathName !== nextLocation || false // if the path is same don't update
      );
    },
  }),
)(CartController);
