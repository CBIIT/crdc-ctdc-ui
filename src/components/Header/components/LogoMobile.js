import React from 'react';
import styled from 'styled-components';
import { headerData } from '../../../config/globalHeaderData';

const LogoArea = styled.div`
    display: flex;
    img {
      width: fit-content;
      height: 100px;
      max-width: 400px;
    }
    .logoContainer {
      margin-top: 32px;
    }
`;

const Logo = () => (
  <LogoArea>
    <a id="header-logo-home-link" className="logoContainer" href={headerData.globalHeaderLogoLink}>
      <img src={headerData.globalHeaderLogoSmall} alt={headerData.globalHeaderLogoAltText} />
    </a>
  </LogoArea>
);

export default Logo;
