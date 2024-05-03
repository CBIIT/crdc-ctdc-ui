import React from 'react'
import cartArrow from '../../../../assets/dash/cartArrow.svg';

const spanStyle = {
	color: '#00846A',
	fontFamily: 'Poppins',
	fontSize: '14px',
	fontWeight: 700,
	lineHeight: '22.75px',
	letterSpacing: '.5px',
	textAlign: 'left',
	margin: 0, 
	padding: 0,
};
const imgStyle = {
	marginLeft: '4px',
	paddingRight: '0px',
	marginTop: '2.5px',
};

const CustomGoToCartLink = () => (
  <a href="#/fileCentricCart" style={{textDecoration: 'none'}} >
    <span style={spanStyle}>
			Go to Cart
			<img alt="Go to Cart Arrow"  height='18px'  src={cartArrow} style={imgStyle} width='21px'/>
    </span>
  </a>
);

export default CustomGoToCartLink;