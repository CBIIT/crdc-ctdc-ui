import React from 'react'
import cartArrow from '../../../../assets/dash/cartArrow.svg';

const spanStyle = {
	color: '#00846A',
	fontFamily: 'Poppins',
	fontSize: '14px',
	fontWeight: 700,
	lineHeight: '22.75px',
	letterSpacing: '1px',
	textAlign: 'left',
	margin: 0, 
	padding: 0,
};
const imgStyle = {
	marginLeft: '7px',
	paddingRight: '0px',
	marginTop: '2px',
};

const CustomGoToCartLink = () => (
  <a href="#/fileCentricCart" style={{textDecoration: 'none'}} >
    <span style={spanStyle}>
			Go to Cart
			<img alt="Go to Cart Arrow"  height='18px'  width='21px' src={cartArrow} style={imgStyle}/>
    </span>
  </a>
);

export default CustomGoToCartLink;