/* eslint-disable */
import React from 'react';
import {
  navBarData, navBarCartData, navBarstyling, externalLinks,
} from '../../bento/navigationBarData';
import styled from 'styled-components';
import { Tooltip as MuiTooltip } from '@material-ui/core';


const CartView = (props) => {

const CartContainer = styled.div`
  .badge{
    padding-top: 30px;
    display: flex;
    position: relative;
    vertical-align: middle;
     padding-right: 20px;
  },
  .cartIcon{
     margin: 0px 0px 0px 6px;
     height: 46.6px;
  },
  .cartCounter {
    min-width: 16px;
    font-family: inter;
    font-weight: 600;
    letter-spacing: 0.8px;
    transform: scale(1) translate(0%, -50%);
  },
  .cartCounter2Wrapper {
    margin-left: 6px;
  },
  .cartCounter2 {
    color: #6D6D6D;
    font-size: 12px;
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
  .cartLabel {
    min-width: 16px;
    color: #00846A;
    font-family: Raleway;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-align: start;
    font-size: 12px;
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
            <div className="cartLabel">
              Files
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
              <span className="badge">
                          <img
                            className="cartIcon"
                            src={navBarCartData.cartIcon}
                            alt={navBarCartData.cartIconAlt}
                          />
                           {getCartLabel(navBarCartData.cartLabelType)}
                </span>
           </CartContainer>
  )
}

export default CartView;

