/* eslint-disable */
import React from 'react';
import {
  navBarData, navBarCartData, navBarstyling, externalLinks,
} from '../../bento/navigationBarData';
import styled from 'styled-components';
import { Tooltip as MuiTooltip } from '@material-ui/core';
import {Link} from 'react-router-dom'

const CartView = (props) => {

const CartContainer = styled.div`
  .badge{
    padding-top: 45px;
    display: flex;
    vertical-align: middle;
     padding-right: 20px;
  },
  .cartLink{
    text-decoration: none;
  },
  .cartIcon{
     height: 63px;
     margin-left: 5px;
  },
  .cartCounter {
    min-width: 16px;
    font-family: inter;
    font-weight: 600;
    letter-spacing: 0.8px;
    transform: scale(1) translate(0%, -50%);
  },
  .cartCounter2Wrapper {
    padding-top: 0px;
    margin-left: -12px;
  },
  .cartCounter2 {
    color: #6D6D6D;
    font-size: 12px;
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;

const getCartLabel = (labelType) => {
    switch (labelType) {
      case 'labelUnderCount':
        return (
          <div className="cartCounter2Wrapper">
            <div className="cartCounter2">
              {props.numberOfFiles || 0}
            </div>
          </div>
        );
      default:
        return (
          <span className="badge">
            <span className="cartCounter">
              {props.numberOfFiles || 0}
            </span>
          </span>

        );
    }
  };

  const Tooltip =  MuiTooltip;
  return (
    <CartContainer>
      <Link to="/fileCentricCart" className="cartLink">
        <span className="badge">
            <img
              className="cartIcon"
              src={navBarCartData.cartIcon}
              alt={navBarCartData.cartIconAlt}
            />
          {getCartLabel(navBarCartData.cartLabelType)}
        </span>
      </Link>
    </CartContainer>
  )
}

export default CartView;

